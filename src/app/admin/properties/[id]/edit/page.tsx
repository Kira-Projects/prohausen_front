"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PropertyForm from "@/components/admin/PropertyForm";
import { Property } from "@/types/property";
import { generatePropertyFolderId } from "@/lib/uuid";
import { useAuth } from "@/contexts/AuthContext";
import { ImageItem } from "@/components/admin/ImageUploader";
import UploadProgressBar from "@/components/admin/UploadProgressBar";
import { compressImages, calculateReduction } from "@/utils/imageCompression";
import { uploadWithRetry } from "@/utils/uploadWithRetry";

export default function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const [propertyId, setPropertyId] = useState<string>("");
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Estados para el progreso de carga
  const [uploadProgress, setUploadProgress] = useState<{
    current: number;
    total: number;
    fileName?: string;
    stage: "compressing" | "uploading" | "completed" | "error";
    compressionStats?: {
      originalSize: number;
      compressedSize: number;
      reduction: number;
    };
  } | null>(null);

  // Redirigir si no está autenticado
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/admin/properties");
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    const initParams = async () => {
      const resolvedParams = await params;
      setPropertyId(resolvedParams.id);
    };
    initParams();
  }, [params]);

  useEffect(() => {
    if (!propertyId || !isAuthenticated || !user) return;

    const fetchProperty = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(`/api/admin/properties/${propertyId}`, {
          headers: {
            "x-auth-token": token || "",
            "x-user-id": user.id,
          },
        });

        if (!response.ok) {
          throw new Error("Error al cargar la propiedad");
        }

        const data = await response.json();
        setProperty(data.data);
      } catch (error) {
        console.error("Error:", error);
        setMessage({
          type: "error",
          text: "Error al cargar la propiedad",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [propertyId, user, isAuthenticated]);

  const handleSubmit = async (formData: FormData, images: ImageItem[]) => {
    if (!property || !user) return;
    
    try {
      const token = localStorage.getItem("authToken");
      
      // Separar imágenes existentes de las nuevas
      const existingImages = images
        .filter((img) => img.type === 'existing')
        .map((img) => (img as { type: 'existing'; url: string; id: string }).url);
      
      const newImages = images.filter((img) => img.type === 'new') as Array<{
        type: 'new';
        file: File;
        preview: string;
        id: string;
      }>;

      // Detectar imágenes eliminadas (las que estaban en property.images pero ya no están en images)
      const deletedImages = property?.images?.filter(
        (url) => !existingImages.includes(url)
      ) || [];

      // Obtener o generar el folderId para las imágenes
      const propertyFolderId = property?.folderId || generatePropertyFolderId();

      // Subir solo las imágenes nuevas a S3 con compresión y reintentos
      const uploadedUrls: string[] = [];

      if (newImages.length > 0) {
        const totalNewImages = newImages.length;

        // PASO 1: COMPRIMIR IMÁGENES NUEVAS
        setMessage({ type: "success", text: `Comprimiendo ${totalNewImages} imagen(es) nueva(s)...` });
        setUploadProgress({
          current: 0,
          total: totalNewImages,
          stage: "compressing",
        });

        const originalFiles = newImages.map(img => img.file);
        let totalOriginalSize = 0;
        let totalCompressedSize = 0;

        originalFiles.forEach(file => {
          totalOriginalSize += file.size;
        });

        const compressedFiles = await compressImages(
          originalFiles,
          {
            maxWidth: 1920,
            maxHeight: 1920,
            quality: 0.85,
            maxSizeMB: 10,
          },
          (current, total) => {
            setUploadProgress({
              current,
              total,
              stage: "compressing",
              fileName: originalFiles[current - 1]?.name,
            });
          }
        );

        compressedFiles.forEach(file => {
          totalCompressedSize += file.size;
        });

        const reduction = calculateReduction(totalOriginalSize, totalCompressedSize);

        setMessage({ 
          type: "success", 
          text: `Imágenes comprimidas (${reduction}% reducción). Subiendo...` 
        });

        // PASO 2: SUBIR CON REINTENTOS Y EN PARALELO
        setUploadProgress({
          current: 0,
          total: totalNewImages,
          stage: "uploading",
        });

        const PARALLEL_UPLOADS = 5;

        for (let i = 0; i < compressedFiles.length; i += PARALLEL_UPLOADS) {
          const parallelBatch = compressedFiles.slice(i, i + PARALLEL_UPLOADS);
          
          const uploadPromises = parallelBatch.map(async (file, index) => {
            const actualIndex = i + index;
            
            const uploadFn = async () => {
              const imageFormData = new FormData();
              imageFormData.append("file", file);
              imageFormData.append("propertyId", propertyFolderId);

              const uploadResponse = await fetch("/api/admin/upload-image", {
                method: "POST",
                headers: {
                  "x-auth-token": token || "",
                  "x-user-id": user.id,
                },
                body: imageFormData,
              });

              // Leer el response como texto primero (solo se puede leer una vez)
              const responseText = await uploadResponse.text();
              
              if (!uploadResponse.ok) {
                let errorMessage = `Error al subir imagen ${actualIndex + 1}`;
                try {
                  // Intentar parsear como JSON
                  const errorData = JSON.parse(responseText);
                  errorMessage = errorData.error || errorMessage;
                } catch {
                  // Si no es JSON válido, usar el texto directamente
                  errorMessage = responseText.substring(0, 200) || `Error ${uploadResponse.status}: ${uploadResponse.statusText}`;
                }
                throw new Error(errorMessage);
              }

              // Parsear respuesta exitosa como JSON
              const uploadData = JSON.parse(responseText);
              return uploadData.data.url;
            };

            return uploadWithRetry(uploadFn, {
              maxRetries: 3,
              retryDelay: 1000,
              onRetry: (attempt, error) => {
                console.warn(`Reintento ${attempt}/3 para imagen ${actualIndex + 1}:`, error.message);
              },
            });
          });

          const parallelResults = await Promise.all(uploadPromises);
          uploadedUrls.push(...parallelResults);

          const currentProgress = i + parallelBatch.length;
          setUploadProgress({
            current: currentProgress,
            total: totalNewImages,
            stage: "uploading",
            fileName: parallelBatch[parallelBatch.length - 1]?.name,
          });
        }

        setUploadProgress({
          current: totalNewImages,
          total: totalNewImages,
          stage: "completed",
        });
      }

      // Eliminar imágenes de S3 que el admin quitó
      if (deletedImages.length > 0) {
        setMessage({ type: "success", text: `Eliminando ${deletedImages.length} imagen(es)...` });
        
        for (const imageUrl of deletedImages) {
          try {
            await fetch("/api/admin/delete-image", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "x-auth-token": token || "",
                "x-user-id": user.id,
              },
              body: JSON.stringify({ imageUrl }),
            });
          } catch (error) {
            console.error(`Error al eliminar imagen ${imageUrl}:`, error);
            // Continuar aunque falle la eliminación de una imagen
          }
        }
      }

      setMessage({
        type: "success",
        text: "Actualizando propiedad...",
      });

      // Combinar URLs: existentes + nuevas subidas
      const allImageUrls = [...existingImages, ...uploadedUrls];

      // Preparar datos de actualización
      const updateData: Record<string, unknown> = {
        title: formData.get("title"),
        slug: formData.get("slug"),
        location: formData.get("location"),
        description: formData.get("description"),
        price: formData.get("price"),
        area: formData.get("area"),
        type: formData.get("type"),
        operation: formData.get("operation"),
        region: formData.get("region"),
        comuna: formData.get("comuna"),
        active: formData.get("active") === "on",
        featured: formData.get("featured") === "on",
      };

      // Actualizar imágenes solo si hay cambios
      if (allImageUrls.length > 0) {
        updateData.image = allImageUrls[0]; // Primera imagen como principal
        updateData.images = allImageUrls;
      }

      // Campos opcionales numéricos
      const bedrooms = formData.get("bedrooms");
      if (bedrooms) updateData.bedrooms = parseInt(bedrooms as string);

      const bathrooms = formData.get("bathrooms");
      if (bathrooms) updateData.bathrooms = parseInt(bathrooms as string);

      const halfBathrooms = formData.get("halfBathrooms");
      if (halfBathrooms)
        updateData.halfBathrooms = parseInt(halfBathrooms as string);

      const totalRooms = formData.get("totalRooms");
      if (totalRooms) updateData.totalRooms = parseInt(totalRooms as string);

      const floors = formData.get("floors");
      if (floors) updateData.floors = parseInt(floors as string);

      const floorNumber = formData.get("floorNumber");
      if (floorNumber) updateData.floorNumber = parseInt(floorNumber as string);

      const yearBuilt = formData.get("yearBuilt");
      if (yearBuilt) updateData.yearBuilt = parseInt(yearBuilt as string);

      // Campos opcionales de texto
      const usefulArea = formData.get("usefulArea");
      if (usefulArea) updateData.usefulArea = usefulArea;

      const landArea = formData.get("landArea");
      if (landArea) updateData.landArea = landArea;

      const address = formData.get("address");
      if (address) updateData.address = address;

      const country = formData.get("country");
      if (country) updateData.country = country;

      const mapIframe = formData.get("mapIframe");
      if (mapIframe) updateData.mapIframe = mapIframe;

      // Guardar el folderId (existente o nuevo)
      updateData.folderId = propertyFolderId;

      const videoUrl = formData.get("videoUrl");
      if (videoUrl) updateData.videoUrl = videoUrl;

      // Features
      const featuresJson = formData.get("features");
      if (featuresJson) {
        updateData.features = JSON.parse(featuresJson as string);
      }

      // Actualizar la propiedad
      const updateResponse = await fetch(`/api/admin/properties/${propertyId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token || "",
          "x-user-id": user.id,
        },
        body: JSON.stringify(updateData),
      });

      if (!updateResponse.ok) {
        const errorData = await updateResponse.json();
        throw new Error(errorData.error || "Error al actualizar la propiedad");
      }

      const result = await updateResponse.json();

      setMessage({
        type: "success",
        text: `¡Propiedad "${result.data.title}" actualizada exitosamente!`,
      });

      // Redirigir al panel admin después de 2 segundos
      setTimeout(() => {
        router.push("/admin/properties");
      }, 2000);
    } catch (error) {
      console.error("Error:", error);
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  };

  // Mostrar loading mientras verifica autenticación
  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg
            className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <p className="text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg
            className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <p className="text-gray-600">Cargando propiedad...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Propiedad no encontrada</p>
          <button
            onClick={() => router.push("/admin/properties")}
            className="text-blue-600 hover:underline"
          >
            Volver al Panel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 pt-32">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push("/admin/properties")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Volver al Panel
          </button>
          <h1 className="text-4xl font-bold text-gray-900">
            Editar Propiedad #{property.id}
          </h1>
          <p className="text-gray-900 mt-3">{property.title}</p>
        </div>

        {/* Mensajes */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg border-2 ${
              message.type === "success"
                ? "bg-green-50 border-green-200 text-green-800"
                : "bg-red-50 border-red-200 text-red-800"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Barra de Progreso */}
        {uploadProgress && (
          <div className="mb-6">
            <UploadProgressBar
              current={uploadProgress.current}
              total={uploadProgress.total}
              currentFileName={uploadProgress.fileName}
              stage={uploadProgress.stage}
              compressionStats={uploadProgress.compressionStats}
            />
          </div>
        )}

        {/* Info: Imágenes */}
        {/* <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>💡 Nota sobre imágenes:</strong> Puedes agregar nuevas imágenes sin perder las existentes, 
            eliminar individualmente las que no quieras, y reordenarlas arrastrándolas. Los cambios se guardarán al actualizar la propiedad.
          </p>
        </div> */}

        {/* Formulario */}
        <PropertyForm
          key={property.id}
          initialData={property}
          onSubmit={handleSubmit}
          submitLabel="Actualizar Propiedad"
        />
      </div>
    </div>
  );
}
