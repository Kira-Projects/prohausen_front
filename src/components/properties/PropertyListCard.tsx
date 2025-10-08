import Link from "next/link";
import Image from "next/image";

interface PropertyListCardProps {
  property: {
    id: number;
    title: string;
    location: string;
    description: string;
    price: string;
    bedrooms?: number;
    bathrooms?: number;
    area: string;
    type: string;
    operation: string;
    region: string;
    comuna: string;
    featured?: boolean;
    image: string;
  };
}

export default function PropertyListCard({ property }: PropertyListCardProps) {
  return (
    <Link href={`/propiedades/${property.id}`} className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
      <div className="flex flex-col md:flex-row">
        {/* Imagen */}
        <div className="md:w-80 flex-shrink-0">
          <div className="relative h-64 md:h-full">
            {/* Badge destacado */}
            {property.featured && (
              <div className="absolute top-3 left-3 z-10 bg-white text-gray-800 px-3 py-1 rounded-md text-xs font-semibold shadow-md">
                Destacado
              </div>
            )}

            {/* Logo PRO HAUSEN */}
            <div className="absolute bottom-3 right-3 z-10 bg-white px-2 py-1 rounded text-xs font-bold text-gray-800 shadow-md">
              PRO HAUSEN
            </div>

            {/* Imagen de la propiedad */}
            <Image
              src={property.image}
              alt={property.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 320px"
            />

            {/* Indicadores de carrusel (puntos blancos) */}
            <div className="absolute bottom-3 left-3 flex space-x-1 z-10">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Contenido */}
        <div className="flex-1 p-6 relative">
          {/* Ubicación */}
          <p className="text-sm text-black mb-2">{property.location}</p>

          {/* Descripción */}
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{property.description}</p>

          {/* Área */}
          <div className="flex items-center gap-1 mb-4 text-sm text-gray-600">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
            </svg>
            <span>{property.area} m²</span>
          </div>

          {/* Título */}
          <h3 className="font-bold text-lg mb-3 text-gray-900 line-clamp-1">{property.title}</h3>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 text-xs mb-4">
            <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded font-medium">
              {property.operation}
            </span>
            <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded font-medium">
              {property.type}
            </span>
            {property.region && (
              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded font-medium">
                {property.region}
              </span>
            )}
            {property.comuna && (
              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded font-medium">
                {property.comuna}
              </span>
            )}
          </div>

          {/* Precio */}
          <div className="absolute top-6 right-6">
            <p className="text-2xl font-bold text-gray-900">{property.price}</p>
          </div>
        </div>
      </div>
      </div>
    </Link>
  );
}
