import Link from "next/link";

interface PropertyCardProps {
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

export default function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Link href={`/propiedades/${property.id}`} className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
      {/* Imagen con overlay de información */}
      <div className="relative h-56 bg-gray-300">
        {/* Badge destacado */}
        {property.featured && (
          <div className="absolute top-3 left-3 z-10 bg-white text-gray-800 px-3 py-1 rounded-md text-xs font-semibold shadow-md">
            Destacado
          </div>
        )}

        {/* Aquí iría la imagen real cuando se implemente el backend */}
        <div className="absolute inset-0 flex items-center justify-center text-gray-500">
          <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>

        {/* Características sobre la imagen (en la parte inferior) */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <div className="flex items-center gap-4 text-white text-sm">
            {property.bedrooms && (
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                <span>{property.bedrooms} camas</span>
              </div>
            )}
            {property.bathrooms && (
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                </svg>
                <span>{property.bathrooms} baños</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
              </svg>
              <span>{property.area} m²</span>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-4">
        {/* Título */}
        <h3 className="font-bold text-base mb-2 text-gray-900 line-clamp-1">{property.title}</h3>

        {/* Precio */}
        <div className="mb-3">
          <p className="text-xl font-bold text-gray-900">$ {property.price}</p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 text-xs">
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
      </div>
      </div>
    </Link>
  );
}

