"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Property } from "@/types/property";
import { getPropertyById, getFeatures, getMediaById, getPropertyImages } from "@/services/wordpress";
import { mapWordPressProperty } from "@/utils/mapWordPressData";

export default function PropertyDetailPage() {
  const params = useParams();
  const propertyId = params?.id ? parseInt(params.id as string) : null;
  
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [thumbnailStartIndex, setThumbnailStartIndex] = useState(0);

  useEffect(() => {
    if (propertyId) {
      loadProperty(propertyId);
    }
  }, [propertyId]);

  // Manejar teclado para el modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isModalOpen || !property?.images) return;
      
      if (e.key === 'Escape') {
        setIsModalOpen(false);
      } else if (e.key === 'ArrowLeft') {
        prevImage();
      } else if (e.key === 'ArrowRight') {
        nextImage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, currentImageIndex, property]);

  const loadProperty = async (id: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const wpProperty = await getPropertyById(id);
      
      if (!wpProperty) {
        setError("Propiedad no encontrada");
        setLoading(false);
        return;
      }

      let featuredImageUrl = "/placeholder-property.jpg";
      if (wpProperty.featured_media) {
        const media = await getMediaById(wpProperty.featured_media);
        if (media?.source_url) {
          featuredImageUrl = media.source_url;
        }
      }

      const mappedProperty = mapWordPressProperty(wpProperty, featuredImageUrl);
      
      const propertyImages = await getPropertyImages(id);
      console.log(`Imágenes de galería: ${propertyImages.length}`);
      
      const imageUrls = propertyImages.map(img => img.source_url);
      
      // Combinar imagen destacada con imágenes de galería
      const allImages: string[] = [];
      
      // Primero agregar imagen destacada
      if (featuredImageUrl && featuredImageUrl !== "/placeholder-property.jpg") {
        allImages.push(featuredImageUrl);
      }
      
      // Luego agregar imágenes de galería (evitando duplicados)
      imageUrls.forEach(url => {
        if (!allImages.includes(url)) {
          allImages.push(url);
        }
      });
      
      mappedProperty.images = allImages.length > 0 ? allImages : [featuredImageUrl];
      console.log(`Total imágenes: ${mappedProperty.images.length}`, mappedProperty.images);
      
      if (wpProperty.es_features && wpProperty.es_features.length > 0) {
        const featuresData = await getFeatures();
        const propertyFeatures = featuresData
          .filter(f => wpProperty.es_features.includes(f.id))
          .map(f => f.name);
        mappedProperty.features = propertyFeatures;
      }
      
      setProperty(mappedProperty);
    } catch (err) {
      console.error("Error al cargar propiedad:", err);
      setError("Error al cargar la propiedad");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
  return (
      <div className="min-h-screen bg-white flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-800 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando propiedad...</p>
        </div>
      </div>
    );
  }

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

  const nextImage = () => {
    if (property?.images && property.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % property.images!.length);
    }
  };

  const prevImage = () => {
    if (property?.images && property.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + property.images!.length) % property.images!.length);
    }
  };

  const nextThumbnails = () => {
    if (property?.images) {
      const maxStart = Math.max(0, property.images.length - 5);
      setThumbnailStartIndex((prev) => Math.min(prev + 5, maxStart));
    }
  };

  const prevThumbnails = () => {
    setThumbnailStartIndex((prev) => Math.max(0, prev - 5));
  };

  const openModal = () => {
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden'; // Prevenir scroll
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'unset';
  };

  const currentImage = property.images && property.images.length > 0 
    ? property.images[currentImageIndex] 
    : property.image;

  // Imagen para el banner (siempre la primera)
  const bannerImage = property.images && property.images.length > 0 
    ? property.images[0] 
    : property.image;

  // Calcular miniaturas visibles (5 a la vez)
  const visibleThumbnails = property?.images?.slice(thumbnailStartIndex, thumbnailStartIndex + 5) || [];
  const hasMoreThumbnails = property?.images && property.images.length > 5;
  const canGoNext = property?.images && thumbnailStartIndex + 5 < property.images.length;
  const canGoPrev = thumbnailStartIndex > 0;

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Título de la propiedad - con imagen de fondo */}
      <div className="relative bg-gray-800 text-white py-50">
        {/* Imagen de fondo */}
        <div className="absolute inset-0 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={bannerImage}
            alt={property.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              console.error('Error cargando imagen del banner:', bannerImage);
              e.currentTarget.style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40"></div>
        </div>
        
        {/* Título sobre la imagen */}
        <div className="relative max-w-6xl mx-auto px-4 z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-center text-white drop-shadow-2xl">{property.title}</h1>
        </div>
      </div>

      {/* Contenedor principal */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        
        {/* Galería Principal */}
        <div className="mb-4">
          <div className="relative w-full cursor-pointer" style={{ height: '500px' }} onClick={openModal}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={currentImage}
              alt={property.title}
              className="w-full h-full object-cover rounded"
            />
            
            {/* Flechas de navegación */}
            {property.images && property.images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all"
                  aria-label="Imagen anterior"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all"
                  aria-label="Siguiente imagen"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Contador de imágenes */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {property.images.length}
                </div>
              </>
            )}
          </div>

          {/* Miniaturas horizontales - Mostrar 5 a la vez */}
          {property.images && property.images.length > 1 && (
            <div className="mt-3 relative">
              <div className="flex items-center gap-2">
                {/* Flecha izquierda para miniaturas */}
                {hasMoreThumbnails && (
                  <button
                    onClick={prevThumbnails}
                    disabled={!canGoPrev}
                    className={`flex-shrink-0 p-2 rounded ${
                      canGoPrev 
                        ? 'bg-gray-200 hover:bg-gray-300' 
                        : 'bg-gray-100 opacity-50 cursor-not-allowed'
                    }`}
                    aria-label="Miniaturas anteriores"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                )}

                {/* Miniaturas visibles */}
                <div className="flex gap-2 overflow-hidden">
                  {visibleThumbnails.map((img, idx) => {
                    const actualIndex = thumbnailStartIndex + idx;
                    return (
                      <button
                        key={actualIndex}
                        onClick={() => setCurrentImageIndex(actualIndex)}
                        className={`flex-shrink-0 transition-all ${
                          actualIndex === currentImageIndex 
                            ? 'ring-2 ring-blue-600' 
                            : 'opacity-70 hover:opacity-100'
                        }`}
                        style={{ width: '100px', height: '75px' }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={img} 
                          alt={`${property.title} - ${actualIndex + 1}`} 
                          className="w-full h-full object-cover rounded"
                        />
                      </button>
                    );
                  })}
                </div>

                {/* Flecha derecha para miniaturas */}
                {hasMoreThumbnails && (
                  <button
                    onClick={nextThumbnails}
                    disabled={!canGoNext}
                    className={`flex-shrink-0 p-2 rounded ${
                      canGoNext 
                        ? 'bg-gray-200 hover:bg-gray-300' 
                        : 'bg-gray-100 opacity-50 cursor-not-allowed'
                    }`}
                    aria-label="Miniaturas siguientes"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Lightbox */}
        {isModalOpen && property.images && (
          <div 
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          >
            {/* Contenedor del modal */}
            <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
              
              {/* Botón cerrar */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full z-10"
                aria-label="Cerrar"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Contador de imágenes */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/10 text-white px-4 py-2 rounded-full text-lg font-semibold">
                {currentImageIndex + 1} / {property.images.length}
              </div>

              {/* Imagen principal del modal */}
              <div 
                className="relative max-w-6xl max-h-[80vh] flex items-center justify-center"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={currentImage}
                  alt={`${property.title} - ${currentImageIndex + 1}`}
                  className="max-w-full max-h-[80vh] object-contain"
                />

                {/* Flechas de navegación */}
                {property.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-4 rounded-full transition-all"
                      aria-label="Imagen anterior"
                    >
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-4 rounded-full transition-all"
                      aria-label="Siguiente imagen"
                    >
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}
              </div>

              {/* Miniaturas en el modal */}
              {property.images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 max-w-6xl">
                  <div className="flex items-center gap-2">
                    {/* Flecha izquierda */}
                    {hasMoreThumbnails && (
                      <button
                        onClick={prevThumbnails}
                        disabled={!canGoPrev}
                        className={`flex-shrink-0 p-2 rounded ${
                          canGoPrev 
                            ? 'bg-white/20 hover:bg-white/30' 
                            : 'bg-white/10 opacity-50 cursor-not-allowed'
                        } text-white`}
                        aria-label="Miniaturas anteriores"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                    )}

                    {/* Miniaturas visibles */}
                    <div className="flex gap-2">
                      {visibleThumbnails.map((img, idx) => {
                        const actualIndex = thumbnailStartIndex + idx;
                        return (
                          <button
                            key={actualIndex}
                            onClick={() => setCurrentImageIndex(actualIndex)}
                            className={`flex-shrink-0 transition-all ${
                              actualIndex === currentImageIndex 
                                ? 'ring-4 ring-white' 
                                : 'opacity-60 hover:opacity-100'
                            }`}
                            style={{ width: '100px', height: '75px' }}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img 
                              src={img} 
                              alt={`Miniatura ${actualIndex + 1}`} 
                              className="w-full h-full object-cover rounded"
                            />
                          </button>
                        );
                      })}
                    </div>

                    {/* Flecha derecha */}
                    {hasMoreThumbnails && (
                      <button
                        onClick={nextThumbnails}
                        disabled={!canGoNext}
                        className={`flex-shrink-0 p-2 rounded ${
                          canGoNext 
                            ? 'bg-white/20 hover:bg-white/30' 
                            : 'bg-white/10 opacity-50 cursor-not-allowed'
                        } text-white`}
                        aria-label="Miniaturas siguientes"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* Layout 2 columnas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Columna izquierda - Contenido principal */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Información básica */}
            <div className="bg-white rounded border p-4">
              <h2 className="text-2xl font-bold mb-2">{property.title}</h2>
              <p className="text-gray-600 text-sm mb-4">{property.address || property.location}</p>
              
              {/* Características rápidas */}
              <div className="flex gap-8 text-center py-4 border-y">
                {property.bedrooms && (
                  <div>
                    <div className="text-3xl font-bold">{property.bedrooms}</div>
                    <div className="text-sm text-gray-600">Dormitorios</div>
                  </div>
                )}
                {property.bathrooms && (
                  <div>
                    <div className="text-3xl font-bold">{property.bathrooms}</div>
                    <div className="text-sm text-gray-600">Baños</div>
                  </div>
                )}
                {property.area && property.area !== "0" && (
                  <div>
                    <div className="text-3xl font-bold">{property.area}</div>
                    <div className="text-sm text-gray-600">m²</div>
                  </div>
                )}
              </div>
            </div>

            {/* Características */}
            <div className="bg-white rounded border p-4">
              <h3 className="text-xl font-bold mb-4">Características</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Categoría:</span>
                  <span className="font-semibold">{property.type}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Operación:</span>
                  <span className="font-semibold">{property.operation}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Región:</span>
                  <span className="font-semibold">{property.region}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Comuna:</span>
                  <span className="font-semibold">{property.comuna}</span>
                </div>
                {property.bedrooms && (
                <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Dormitorios:</span>
                    <span className="font-semibold">{property.bedrooms}</span>
                </div>
                )}
                {property.bathrooms && (
                <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Baños:</span>
                    <span className="font-semibold">{property.bathrooms}</span>
                </div>
                )}
                {property.area && property.area !== "0" && (
                <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Área:</span>
                    <span className="font-semibold">{property.area} m²</span>
                </div>
                )}
                {property.address && (
                  <div className="flex justify-between py-2 border-b col-span-2">
                    <span className="text-gray-600">Dirección:</span>
                    <span className="font-semibold">{property.address}</span>
                </div>
                )}
              </div>
            </div>

            {/* Descripción */}
            <div className="bg-white rounded border p-4">
              <h3 className="text-xl font-bold mb-4">Descripción</h3>
              <div 
                className="text-gray-700 leading-relaxed prose max-w-none"
                dangerouslySetInnerHTML={{ __html: property.description }}
              />
            </div>

            {/* Servicios y características */}
            {property.features && property.features.length > 0 && (
              <div className="bg-white rounded border p-4">
                <h3 className="text-xl font-bold mb-4">Servicios y características</h3>
                <ul className="space-y-2">
                {property.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-blue-600 mr-2">✓</span>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Ubicación - Mapa */}
            {property.address && (
              <div className="bg-white rounded border p-4">
                <h3 className="text-xl font-bold mb-4">Ubicación</h3>
                <div className="w-full h-96 bg-gray-200 rounded overflow-hidden">
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
              <div className="bg-white rounded border p-4">
                <h3 className="text-xl font-bold mb-4">Video</h3>
                <div className="aspect-video bg-gray-200 rounded overflow-hidden">
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

          {/* Sidebar derecha */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              
              {/* Precio */}
              <div className="bg-white rounded border p-6">
                <div className="text-4xl font-bold text-gray-900 mb-4">
                  $ {property.price}
                </div>

                {/* Botones para compartir */}
                <p className="text-sm text-gray-600 mb-3">Comparte esta propiedad</p>
                <div className="space-y-2">
                  <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors text-sm font-semibold">
                    Facebook
                  </button>
                  <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-colors text-sm font-semibold">
                      WhatsApp
                  </button>
                </div>
              </div>

              {/* Formulario de contacto */}
              <div className="bg-white rounded border p-6">
                <h3 className="text-lg font-bold mb-4">¿Te interesa esta propiedad?</h3>
                <form className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Nombre</label>
                    <input 
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder=""
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Teléfono</label>
                    <input 
                      type="tel"
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder=""
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Email</label>
                    <input 
                      type="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder=""
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Mensaje</label>
                    <textarea 
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder=""
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full bg-gray-800 hover:bg-gray-900 text-white font-semibold py-3 rounded transition-colors"
                  >
                    Enviar consulta
                  </button>
                </form>
              </div>

              {/* Botón volver */}
              <Link 
                href="/propiedades"
                className="block w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 rounded transition-colors"
              >
                ← Volver a propiedades
              </Link>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
