"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Property } from "@/types/property";
import { getPropertyById, getFeatures, getMediaById, getPropertyImages } from "@/services/wordpress";
import { mapWordPressProperty } from "@/utils/mapWordPressData";

export default function PropertyDetailPageEstatik() {
  const params = useParams();
  const propertyId = params?.id ? parseInt(params.id as string) : null;
  
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (propertyId) {
      loadProperty(propertyId);
    }
  }, [propertyId]);

  const loadProperty = async (id: number) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log(`Cargando propiedad ID: ${id}`);
      const wpProperty = await getPropertyById(id);
      
      if (!wpProperty) {
        setError("Propiedad no encontrada");
        setLoading(false);
        return;
      }

      // Cargar imagen destacada
      let featuredImageUrl = "/placeholder-property.svg";
      if (wpProperty.featured_media) {
        const media = await getMediaById(wpProperty.featured_media);
        if (media?.source_url) {
          featuredImageUrl = media.source_url;
        }
      }

      // Mapear la propiedad con la imagen destacada
      const mappedProperty = mapWordPressProperty(wpProperty, featuredImageUrl);
      
      // Cargar todas las imágenes de la galería
      const propertyImages = await getPropertyImages(id);
      const imageUrls = propertyImages.map(img => img.source_url);
      
      // Si hay imágenes de galería, usarlas; si no, usar solo la destacada
      if (imageUrls.length > 0) {
        mappedProperty.images = imageUrls;
      } else if (featuredImageUrl !== "/placeholder-property.svg") {
        mappedProperty.images = [featuredImageUrl];
      }
      
      // Cargar características (features) si existen
      if (wpProperty.es_features && wpProperty.es_features.length > 0) {
        const featuresData = await getFeatures();
        const propertyFeatures = featuresData
          .filter(f => wpProperty.es_features.includes(f.id))
          .map(f => f.name);
        mappedProperty.features = propertyFeatures;
      }
      
      setProperty(mappedProperty);
      console.log("Propiedad cargada:", mappedProperty);
    } catch (err) {
      console.error("Error al cargar propiedad:", err);
      setError("Error al cargar la propiedad");
    } finally {
      setLoading(false);
    }
  };

  // Estado de carga
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando propiedad...</p>
        </div>
      </div>
    );
  }

  // Estado de error
  if (error || !property) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || "Propiedad no encontrada"}</p>
          <Link 
            href="/propiedades"
            className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded transition-colors inline-block"
          >
            ← Volver a propiedades
          </Link>
        </div>
      </div>
    );
  }

  const currentImage = property.images && property.images.length > 0 
    ? property.images[currentImageIndex] 
    : property.image;

  return (
    <div className="min-h-screen bg-white">
      {/* Header simple */}
      <div className="bg-gray-900 text-white py-3">
        <div className="max-w-7xl mx-auto px-4">
          <Link href="/propiedades" className="text-sm hover:underline">
            ← Volver a propiedades
          </Link>
        </div>
      </div>

      {/* Título */}
      <div className="border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">{property.title}</h1>
          <p className="text-gray-600 mt-2">{property.address || property.location}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna Principal - 2/3 */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Galería Principal */}
            <div className="bg-white">
              <div className="relative aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden">
                <Image 
                  src={currentImage}
                  alt={property.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
                />
              </div>

              {/* Miniaturas */}
              {property.images && property.images.length > 1 && (
                <div className="mt-4 grid grid-cols-6 gap-2">
                  {property.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`relative aspect-video rounded overflow-hidden border-2 ${
                        idx === currentImageIndex 
                          ? 'border-gray-900' 
                          : 'border-gray-200 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <Image src={img} alt={`${property.title} - ${idx + 1}`} fill className="object-cover" sizes="(max-width: 768px) 25vw, 15vw" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Características Principales - Iconos */}
            <div className="grid grid-cols-3 gap-4 py-6 border-y">
              {property.bedrooms && (
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">{property.bedrooms}</div>
                  <div className="text-sm text-gray-600 mt-1">Dormitorios</div>
                </div>
              )}
              {property.bathrooms && (
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">{property.bathrooms}</div>
                  <div className="text-sm text-gray-600 mt-1">Baños</div>
                </div>
              )}
              {property.area && property.area !== "0" && (
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">{property.area}</div>
                  <div className="text-sm text-gray-600 mt-1">m² de área</div>
                </div>
              )}
            </div>

            {/* Descripción */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Descripción</h2>
              <div 
                className="text-gray-700 leading-relaxed prose max-w-none"
                dangerouslySetInnerHTML={{ __html: property.description }}
              />
            </div>

            {/* Tabla de Características */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Características</h2>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <tbody>
                    <tr className="border-b bg-gray-50">
                      <td className="px-4 py-3 font-semibold text-gray-700 w-1/3">Categoría</td>
                      <td className="px-4 py-3 text-gray-900">{property.type}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="px-4 py-3 font-semibold text-gray-700">Operación</td>
                      <td className="px-4 py-3 text-gray-900">{property.operation}</td>
                    </tr>
                    <tr className="border-b bg-gray-50">
                      <td className="px-4 py-3 font-semibold text-gray-700">Región</td>
                      <td className="px-4 py-3 text-gray-900">{property.region}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="px-4 py-3 font-semibold text-gray-700">Comuna</td>
                      <td className="px-4 py-3 text-gray-900">{property.comuna}</td>
                    </tr>
                    {property.bedrooms && (
                      <tr className="border-b bg-gray-50">
                        <td className="px-4 py-3 font-semibold text-gray-700">Dormitorios</td>
                        <td className="px-4 py-3 text-gray-900">{property.bedrooms}</td>
                      </tr>
                    )}
                    {property.bathrooms && (
                      <tr className="border-b">
                        <td className="px-4 py-3 font-semibold text-gray-700">Baños</td>
                        <td className="px-4 py-3 text-gray-900">{property.bathrooms}</td>
                      </tr>
                    )}
                    {property.area && property.area !== "0" && (
                      <tr className="border-b bg-gray-50">
                        <td className="px-4 py-3 font-semibold text-gray-700">Área</td>
                        <td className="px-4 py-3 text-gray-900">{property.area} m²</td>
                      </tr>
                    )}
                    {property.address && (
                      <tr>
                        <td className="px-4 py-3 font-semibold text-gray-700">Dirección</td>
                        <td className="px-4 py-3 text-gray-900">{property.address}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Servicios y Características */}
            {property.features && property.features.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Servicios y características</h2>
                <ul className="grid grid-cols-2 gap-3">
                  {property.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-gray-700">
                      <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Mapa */}
            {property.address && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Ubicación</h2>
                <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                  <iframe
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    scrolling="no"
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=-71.55,-33.05,-71.45,-32.95&layer=mapnik&marker=-33.0,-71.5`}
                    className="w-full h-full"
                  />
                </div>
              </div>
            )}

            {/* Video */}
            {property.videoUrl && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Video</h2>
                <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                  <iframe
                    width="100%"
                    height="100%"
                    src={property.videoUrl.replace('watch?v=', 'embed/')}
                    title="Video de la propiedad"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - 1/3 */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
              {/* Precio */}
              <div className="bg-gray-50 border rounded-lg p-6">
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  $ {property.price}
                </div>
                <p className="text-sm text-gray-600">Comparte esta propiedad</p>
                <div className="flex gap-2 mt-4">
                  <button className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 text-sm">
                    Facebook
                  </button>
                  <button className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 text-sm">
                    WhatsApp
                  </button>
                </div>
              </div>

              {/* Formulario de Contacto */}
              <div className="bg-white border rounded-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  ¿Te interesa esta propiedad?
                </h3>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre
                    </label>
                    <input 
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      placeholder="Tu nombre"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono
                    </label>
                    <input 
                      type="tel"
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      placeholder="+56 9 1234 5678"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input 
                      type="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      placeholder="tu@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mensaje
                    </label>
                    <textarea 
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      placeholder="Escribe tu mensaje aquí..."
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 rounded transition-colors"
                  >
                    Enviar consulta
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

