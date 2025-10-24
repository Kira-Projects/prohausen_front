"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PropertyForm from "@/components/admin/PropertyForm";
import { Property } from "@/types/property";
import { generatePropertyFolderId } from "@/lib/uuid";
import { useAuth } from "@/contexts/AuthContext";

interface ImageFile {
  file: File;
  preview: string;
  id: string;
}

export default function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { isAuthenticated, password, loading: authLoading } = useAuth();
  const [propertyId, setPropertyId] = useState<string>("");
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
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
    if (!propertyId || !isAuthenticated) return;

    const fetchProperty = async () => {
      try {
        const response = await fetch(`/api/admin/properties/${propertyId}`, {
          headers: {
            "x-admin-password": password,
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
  }, [propertyId, password, isAuthenticated]);

  const handleSubmit = async (formData: FormData, images: ImageFile[]) => {
    try {
      // Obtener o generar el folderId para las imágenes
      // Si la propiedad ya tiene un folderId, usarlo; si no, generar uno nuevo
      const propertyFolderId = property?.folderId || generatePropertyFolderId();

      // Si hay nuevas imágenes, subirlas a S3
      const uploadedUrls: string[] = [];

      if (images.length > 0) {
        setMessage({ type: "success", text: "Subiendo nuevas imágenes..." });

        for (let i = 0; i < images.length; i++) {
          const image = images[i];
          const imageFormData = new FormData();
          imageFormData.append("file", image.file);
          imageFormData.append("propertyId", propertyFolderId); // Usar el folderId UUID

          const uploadResponse = await fetch("/api/admin/upload-image", {
            method: "POST",
            headers: {
              "x-admin-password": password,
            },
            body: imageFormData,
          });

          if (!uploadResponse.ok) {
            throw new Error(`Error al subir imagen ${i + 1}`);
          }

          const uploadData = await uploadResponse.json();
          uploadedUrls.push(uploadData.data.url);
        }
      }

      setMessage({
        type: "success",
        text: "Actualizando propiedad...",
      });

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

      // Si se subieron nuevas imágenes, actualizar image e images
      if (uploadedUrls.length > 0) {
        updateData.image = uploadedUrls[0];
        updateData.images = uploadedUrls;
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
          "x-admin-password": password,
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
          <h1 className="text-3xl font-bold text-gray-900">
            Editar Propiedad #{property.id}
          </h1>
          <p className="text-gray-600 mt-2">{property.title}</p>
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

        {/* Info: Imágenes */}
        <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>💡 Nota sobre imágenes:</strong> Si subes nuevas imágenes,
            reemplazarán completamente las actuales. Si no subes ninguna, se
            mantendrán las imágenes existentes.
          </p>
        </div>

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
