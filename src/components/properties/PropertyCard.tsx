import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

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
    images?: string[];
  };
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Usar las imágenes múltiples si están disponibles, sino usar solo la imagen principal
  const images = property.images && property.images.length > 0 ? property.images : [property.image];
  const currentImage = images[currentImageIndex];
  
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };
  
  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
      {/* Imagen con carrusel */}
      <div className="relative h-56 bg-gray-300 group">
        {/* Badge destacado */}
        {property.featured && (
          <div className="absolute top-3 left-3 z-20 bg-white text-gray-800 px-3 py-1 rounded-md text-xs font-semibold shadow-md">
            Destacado
          </div>
        )}

        {/* Imagen actual - Optimizada con prioridad */}
        <Image
          src={currentImage}
          alt={property.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={currentImageIndex === 0} // Prioridad solo para primera imagen
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyOiKhco6RqWw==" 
          onError={() => {
            console.error(`❌ Error cargando imagen para ${property.title}:`, currentImage);
          }}
        />

        {/* Navegación de imágenes - Solo si hay más de una imagen */}
        {images.length > 1 && (
          <>
            {/* Botón anterior */}
            <button
              onClick={(e) => {
                e.preventDefault();
                prevImage();
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Botón siguiente */}
            <button
              onClick={(e) => {
                e.preventDefault();
                nextImage();
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

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
      <Link href={`/propiedades/${property.id}`} className="block p-4 hover:bg-gray-50 transition-colors">
        {/* Título */}
        <h3 className="font-bold text-base mb-2 text-gray-900 line-clamp-1">{property.title}</h3>

        {/* Precio */}
        <div className="mb-3">
          <p className="text-xl font-bold text-gray-900">{property.price}</p>
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
      </Link>
    </div>
  );
}

