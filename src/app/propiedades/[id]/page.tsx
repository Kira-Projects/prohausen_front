import Link from "next/link";
import { Property } from "@/types/property";
import PropertyDetailClient from "@/components/properties/PropertyDetailClient";
import { getPropertyById } from "@/lib/db/properties";

interface PageProps {
  params: Promise<{ id: string }>;
}

// Server Component - obtiene los datos directamente desde MongoDB Atlas
export default async function PropertyDetailPage({ params }: PageProps) {
  const { id } = await params;
  const propertyId = parseInt(id, 10);

  // Obtener la propiedad directamente desde MongoDB Atlas
  let property: Property | null = null;
  let error: string | null = null;

  try {
    property = await getPropertyById(propertyId);

    if (!property) {
      error = "Propiedad no encontrada";
    }
  } catch (err) {
    console.error("Error al cargar la propiedad desde MongoDB:", err);
    error = "Error al cargar la propiedad";
  }

  // Si hay error o no hay propiedad, mostrar mensaje
  if (error || !property) {
  return (
      <div className="min-h-screen bg-white flex items-center justify-center pt-20">
        <div className="text-center">
          <p className="text-red-600 mb-4">
            {error || "Propiedad no encontrada"}
          </p>
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
