"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PropertyForm from "@/components/admin/PropertyForm";
import { generatePropertyFolderId } from "@/lib/uuid";
import { useAuth } from "@/contexts/AuthContext";
import { ImageItem } from "@/components/admin/ImageUploader";
import UploadProgressBar from "@/components/admin/UploadProgressBar";
import { compressImages, formatBytes, calculateReduction } from "@/utils/imageCompression";
import { uploadWithRetry } from "@/utils/uploadWithRetry";

export default function NewPropertyPage() {
  const router = useRouter();
  const { isAuthenticated, user, loading } = useAuth();
  
  // Generar UUID único para la carpeta de esta propiedad
  const [propertyFolderId] = useState(() => generatePropertyFolderId());
  
  // Redirigir si no está autenticado
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/admin/properties");
    }
  }, [isAuthenticated, loading, router]);
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

  const handleSubmit = async (formData: FormData, images: ImageItem[]) => {
    if (!user) return;
    
    try {
      // Filtrar solo las imágenes nuevas (en este caso, todas son nuevas)
      const newImages = images.filter((img) => img.type === 'new') as Array<{
        type: 'new';
        file: File;
        preview: string;
        id: string;
      }>;

      // Validar que haya al menos una imagen
      if (newImages.length === 0) {
        setMessage({
          type: "error",
          text: "Debes subir al menos una imagen",
        });
        return;
      }

      const totalImages = newImages.length;
      const token = localStorage.getItem("authToken");

      // PASO 1: COMPRIMIR IMÁGENES
      setMessage({ type: "success", text: `Comprimiendo ${totalImages} imágenes...` });
      setUploadProgress({
        current: 0,
        total: totalImages,
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
        text: `Imágenes comprimidas (${reduction}% de reducción: ${formatBytes(totalOriginalSize)} → ${formatBytes(totalCompressedSize)}). Iniciando carga...` 
      });

      // PASO 2: SUBIR IMÁGENES CON REINTENTOS Y EN LOTES
      setUploadProgress({
        current: 0,
        total: totalImages,
        stage: "uploading",
        compressionStats: {
          originalSize: totalOriginalSize,
          compressedSize: totalCompressedSize,
          reduction,
        },
      });

      const uploadedUrls: string[] = [];
      const BATCH_SIZE = 10; // Subir de 10 en 10
      const PARALLEL_UPLOADS = 5; // 5 uploads simultáneos por lote

      for (let batchStart = 0; batchStart < compressedFiles.length; batchStart += BATCH_SIZE) {
        const batchEnd = Math.min(batchStart + BATCH_SIZE, compressedFiles.length);
        const batch = compressedFiles.slice(batchStart, batchEnd);
        
        setMessage({ 
          type: "success", 
          text: `Subiendo lote ${Math.floor(batchStart / BATCH_SIZE) + 1} de ${Math.ceil(compressedFiles.length / BATCH_SIZE)} (imágenes ${batchStart + 1}-${batchEnd} de ${totalImages})...` 
        });

        // Dividir el lote en sub-lotes paralelos
        const batchUrls: string[] = [];
        for (let i = 0; i < batch.length; i += PARALLEL_UPLOADS) {
          const parallelBatch = batch.slice(i, i + PARALLEL_UPLOADS);
          
          const uploadPromises = parallelBatch.map(async (file, index) => {
            const actualIndex = batchStart + i + index;
            
            // Función de subida con reintentos
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

              if (!uploadResponse.ok) {
                const errorData = await uploadResponse.json();
                throw new Error(errorData.error || `Error al subir imagen ${actualIndex + 1}`);
              }

              const uploadData = await uploadResponse.json();
              return uploadData.data.url;
            };

            // Subir con reintentos (hasta 3 intentos)
            return uploadWithRetry(uploadFn, {
              maxRetries: 3,
              retryDelay: 1000,
              onRetry: (attempt, error) => {
                console.warn(`Reintento ${attempt}/3 para imagen ${actualIndex + 1}:`, error.message);
                setMessage({
                  type: "error",
                  text: `⚠️ Reintentando subir imagen ${actualIndex + 1} (intento ${attempt}/3)...`,
                });
              },
            });
          });

          const parallelResults = await Promise.all(uploadPromises);
          batchUrls.push(...parallelResults);

          // Actualizar progreso
          const currentProgress = batchStart + i + parallelBatch.length;
          setUploadProgress({
            current: currentProgress,
            total: totalImages,
            stage: "uploading",
            fileName: parallelBatch[parallelBatch.length - 1]?.name,
          });
        }

        uploadedUrls.push(...batchUrls);
      }

      setUploadProgress({
        current: totalImages,
        total: totalImages,
        stage: "completed",
      });

      setMessage({
        type: "success",
        text: `✓ ${totalImages} imágenes subidas exitosamente. Creando propiedad...`,
      });

      // 2. Preparar datos de la propiedad
      const propertyData: Record<string, unknown> = {
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
        image: uploadedUrls[0], // Primera imagen como principal
        images: uploadedUrls, // Todas las imágenes
      };

      // Campos opcionales numéricos
      const bedrooms = formData.get("bedrooms");
      if (bedrooms) propertyData.bedrooms = parseInt(bedrooms as string);

      const bathrooms = formData.get("bathrooms");
      if (bathrooms) propertyData.bathrooms = parseInt(bathrooms as string);

      const halfBathrooms = formData.get("halfBathrooms");
      if (halfBathrooms)
        propertyData.halfBathrooms = parseInt(halfBathrooms as string);

      const totalRooms = formData.get("totalRooms");
      if (totalRooms) propertyData.totalRooms = parseInt(totalRooms as string);

      const floors = formData.get("floors");
      if (floors) propertyData.floors = parseInt(floors as string);

      const floorNumber = formData.get("floorNumber");
      if (floorNumber) propertyData.floorNumber = parseInt(floorNumber as string);

      const yearBuilt = formData.get("yearBuilt");
      if (yearBuilt) propertyData.yearBuilt = parseInt(yearBuilt as string);

      // Campos opcionales de texto
      const usefulArea = formData.get("usefulArea");
      if (usefulArea) propertyData.usefulArea = usefulArea;

      const landArea = formData.get("landArea");
      if (landArea) propertyData.landArea = landArea;

      const address = formData.get("address");
      if (address) propertyData.address = address;

      const country = formData.get("country");
      if (country) propertyData.country = country;

      const latitude = formData.get("latitude");
      if (latitude) propertyData.latitude = latitude;

      const longitude = formData.get("longitude");
      if (longitude) propertyData.longitude = longitude;

      const videoUrl = formData.get("videoUrl");
      if (videoUrl) propertyData.videoUrl = videoUrl;

      const mapIframe = formData.get("mapIframe");
      if (mapIframe) propertyData.mapIframe = mapIframe;

      // Guardar el folderId (UUID de la carpeta en S3)
      propertyData.folderId = propertyFolderId;

      // Features
      const featuresJson = formData.get("features");
      if (featuresJson) {
        propertyData.features = JSON.parse(featuresJson as string);
      }

      // 3. Crear la propiedad en MongoDB
      const createResponse = await fetch("/api/admin/properties", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token || "",
          "x-user-id": user.id,
        },
        body: JSON.stringify(propertyData),
      });

      if (!createResponse.ok) {
        const errorData = await createResponse.json();
        throw new Error(errorData.error || "Error al crear la propiedad");
      }

      const result = await createResponse.json();

      setMessage({
        type: "success",
        text: `¡Propiedad "${result.data.title}" creada exitosamente!`,
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
          <p className="text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // El useEffect se encargará de redirigir
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
          <h1 className="text-3xl font-bold text-gray-900">
            Crear Nueva Propiedad
          </h1>
          <p className="text-gray-600 mt-2">
            Completa todos los campos obligatorios (*) para crear la propiedad
          </p>
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

        {/* Formulario */}
        <PropertyForm
          onSubmit={handleSubmit}
          submitLabel="Crear Propiedad"
        />
      </div>
    </div>
  );
}
