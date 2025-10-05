"use client";

import React from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";

interface GoogleMapComponentProps {
  latitude: string;
  longitude: string;
  title?: string;
}

const containerStyle = {
  width: "100%",
  height: "100%",
};

export default function GoogleMapComponent({
  latitude,
  longitude,
  title = "Ubicación de la propiedad",
}: GoogleMapComponentProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  console.log("🗺️ Google Maps Component - API Key:", apiKey ? "Configurada" : "NO configurada");
  console.log("📍 Coordenadas:", { latitude, longitude });

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey || "",
  });

  const lat = parseFloat(latitude);
  const lng = parseFloat(longitude);

  // Validar que las coordenadas sean válidas
  if (isNaN(lat) || isNaN(lng)) {
    console.error("❌ Coordenadas inválidas:", { latitude, longitude });
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded">
        <p className="text-gray-600">Coordenadas no disponibles</p>
      </div>
    );
  }

  const center = {
    lat: lat,
    lng: lng,
  };

  if (!apiKey) {
    console.error("❌ Google Maps API Key no configurada");
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded">
        <p className="text-gray-600">
          Mapa no disponible. Configura NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
        </p>
      </div>
    );
  }

  if (loadError) {
    console.error("❌ Error al cargar Google Maps:", loadError);
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded">
        <div className="text-center">
          <p className="text-red-600 font-semibold mb-2">Error al cargar Google Maps</p>
          <p className="text-gray-600 text-sm">
            Verifica que la API Key tenga los permisos correctos
          </p>
          <p className="text-gray-500 text-xs mt-2">
            {loadError.message}
          </p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded">
        <p className="text-gray-600">Cargando mapa...</p>
      </div>
    );
  }

  console.log("✅ Google Maps cargado correctamente");

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={16}
      options={{
        mapTypeControl: true,
        mapTypeControlOptions: {
          position: 3, // TOP_RIGHT
        },
        streetViewControl: true,
        fullscreenControl: true,
        zoomControl: true,
      }}
    >
      {/* Marcador en la ubicación de la propiedad */}
      <Marker position={center} title={title} />
    </GoogleMap>
  );
}

