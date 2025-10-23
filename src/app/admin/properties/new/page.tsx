"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PropertyForm from "@/components/admin/PropertyForm";

interface ImageFile {
  file: File;
  preview: string;
  id: string;
}

export default function NewPropertyPage() {
  const router = useRouter();
  const [password] = useState(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("adminPassword") || "";
    }
    return "";
  });
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = async (formData: FormData, images: ImageFile[]) => {
    try {
      // Validar que haya al menos una imagen
      if (images.length === 0) {
        setMessage({
          type: "error",
          text: "Debes subir al menos una imagen",
        });
        return;
      }

      setMessage({ type: "success", text: "Subiendo imágenes a S3..." });

      // 1. Subir todas las imágenes a S3 primero
      const uploadedUrls: string[] = [];

      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        const imageFormData = new FormData();
        imageFormData.append("file", image.file);
        imageFormData.append("propertyId", "temp"); // Temporal hasta tener el ID

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

      setMessage({
        type: "success",
        text: "Imágenes subidas. Creando propiedad...",
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
          "x-admin-password": password,
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

        {/* Formulario */}
        <PropertyForm
          onSubmit={handleSubmit}
          submitLabel="Crear Propiedad"
        />
      </div>
    </div>
  );
}
