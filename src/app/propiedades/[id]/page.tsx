import Link from "next/link";
import { Property } from "@/types/property";
import PropertyDetailClient from "@/components/properties/PropertyDetailClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

// Server Component - obtiene los datos del servidor
export default async function PropertyDetailPage({ params }: PageProps) {
  const { id } = await params;
  const propertyId = parseInt(id);

  // Obtener la propiedad desde la API del servidor
  let property: Property | null = null;
  let error: string | null = null;

  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/property/${propertyId}`, {
      next: { revalidate: 60 } // Revalidar cada 60 segundos
    });

    if (!response.ok) {
      if (response.status === 404) {
        error = "Propiedad no encontrada";
      } else {
        error = 'Error al cargar la propiedad desde caché';
      }
    } else {
      const data = await response.json();
      
      if (!data.success || !data.property) {
        error = 'No se pudo cargar la propiedad desde caché';
      } else {
        property = data.property;
      }
    }
  } catch {
    error = "Error al cargar la propiedad";
  }

  // Si hay error o no hay propiedad, mostrar mensaje
  if (error || !property) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center pt-20">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || "Propiedad no encontrada"}</p>
          <Link 
            href="/propiedades"
            className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-3 rounded transition-colors inline-block"
          >
            ← Volver a propiedades
          </Link>
        </div>
      </div>
    );
  }

  // Renderizar el componente cliente con los datos
  return <PropertyDetailClient initialProperty={property} />;
}