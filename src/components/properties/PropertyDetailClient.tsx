"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Property } from "@/types/property";
import GoogleMapComponent from "@/components/maps/GoogleMapComponent";

interface PropertyDetailClientProps {
  initialProperty: Property;
}

export default function PropertyDetailClient({ initialProperty }: PropertyDetailClientProps) {
  const [property] = useState<Property>(initialProperty);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [thumbnailStartIndex, setThumbnailStartIndex] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);

  // Manejar teclado para el modal
  useEffect(() => {
    if (!isModalOpen || !property?.images) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsModalOpen(false);
      } else if (e.key === 'ArrowLeft') {
        setCurrentImageIndex((prev) => (prev - 1 + property.images!.length) % property.images!.length);
      } else if (e.key === 'ArrowRight') {
        setCurrentImageIndex((prev) => (prev + 1) % property.images!.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, property]);

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
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'unset';
  };

  const copyToClipboard = () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    navigator.clipboard.writeText(url);
    alert('URL copiada al portapapeles');
  };

  const shareUrl = typeof window !== 'undefined' ? encodeURIComponent(window.location.href) : '';
  const shareTitle = encodeURIComponent(property?.title || '');

  const currentImage = property.images && property.images.length > 0 
    ? property.images[currentImageIndex] 
    : property.image;

  const bannerImage = property.images && property.images.length > 0 
    ? property.images[0] 
    : property.image;

  const visibleThumbnails = property?.images?.slice(thumbnailStartIndex, thumbnailStartIndex + 5) || [];
  const hasMoreThumbnails = property?.images && property.images.length > 5;
  const canGoNext = property?.images && thumbnailStartIndex + 5 < property.images.length;
  const canGoPrev = thumbnailStartIndex > 0;

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Banner con título */}
      <div className="relative bg-gray-800 text-white py-50">
        <div className="absolute inset-0 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={bannerImage}
            alt={property.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40"></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-2xl text-center">{property.title}</h1>
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
            
            {property.featured && (
              <div className="absolute top-4 left-4 bg-white/75 hover:bg-white/90 text-gray-700 px-3 py-1.5 rounded text-sm font-medium shadow-md transition-all">
                Destacado
              </div>
            )}

            <div className="absolute top-4 right-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowShareModal(true);
                }}
                className="bg-white/75 hover:bg-white/90 text-gray-700 p-2 rounded shadow-md transition-all cursor-pointer"
                aria-label="Compartir propiedad"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </button>
            </div>
            
            {property.images && property.images.length > 1 && (
              <>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-all cursor-pointer"
                  aria-label="Imagen anterior"
                >
                  <svg className="w-10 h-10 drop-shadow-2xl" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-all cursor-pointer"
                  aria-label="Siguiente imagen"
                >
                  <svg className="w-10 h-10 drop-shadow-2xl" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {property.images.length}
                </div>
              </>
            )}
          </div>

          {/* Miniaturas */}
          {property.images && property.images.length > 1 && (
            <div className="mt-3 relative">
              <div className="flex items-center gap-2">
                {hasMoreThumbnails && (
                  <button
                    onClick={prevThumbnails}
                    disabled={!canGoPrev}
                    className={`flex-shrink-0 p-3 md:p-2 rounded transition-all ${
                      canGoPrev 
                        ? 'bg-gray-800 hover:bg-gray-900 text-white cursor-pointer shadow-md' 
                        : 'bg-gray-300 opacity-50 cursor-not-allowed text-gray-500'
                    }`}
                    aria-label="Miniaturas anteriores"
                  >
                    <svg className="w-6 h-6 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                )}

                <div className="flex flex-1 gap-2 overflow-x-auto md:overflow-visible">
                  {visibleThumbnails.map((img, idx) => {
                    const actualIndex = thumbnailStartIndex + idx;
                    return (
                      <button
                        key={actualIndex}
                        onClick={() => setCurrentImageIndex(actualIndex)}
                        className={`transition-all rounded cursor-pointer ${
                          actualIndex === currentImageIndex 
                            ? 'ring-2 ring-blue-600' 
                            : 'opacity-70 hover:opacity-100'
                        } flex-shrink-0 md:flex-1 w-[120px] md:w-auto h-20`}
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

                {hasMoreThumbnails && (
                  <button
                    onClick={nextThumbnails}
                    disabled={!canGoNext}
                    className={`flex-shrink-0 p-3 md:p-2 rounded transition-all ${
                      canGoNext 
                        ? 'bg-gray-800 hover:bg-gray-900 text-white cursor-pointer shadow-md' 
                        : 'bg-gray-300 opacity-50 cursor-not-allowed text-gray-500'
                    }`}
                    aria-label="Miniaturas siguientes"
                  >
                    <svg className="w-6 h-6 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal de Compartir */}
        {showShareModal && (
          <div 
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={() => setShowShareModal(false)}
          >
            <div 
              className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Comparte esta casa</h3>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-2">Copie esta URL para compartir</p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={typeof window !== 'undefined' ? window.location.href : ''}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm bg-gray-50 min-w-0"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded font-medium text-sm transition-colors whitespace-nowrap"
                  >
                    COPIAR
                  </button>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-3">O compartir con</p>
                <div className="flex gap-3 justify-center">
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded transition-colors"
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </a>

                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded transition-colors"
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>

                  <a
                    href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded transition-colors"
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>

                  <a
                    href={`https://pinterest.com/pin/create/button/?url=${shareUrl}&description=${shareTitle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded transition-colors"
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/>
                    </svg>
                  </a>

                  <a
                    href={`https://api.whatsapp.com/send?text=${shareTitle}%20${shareUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded transition-colors"
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Lightbox */}
        {isModalOpen && property.images && (
          <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
            <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
              
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full z-10 cursor-pointer"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/10 text-white px-4 py-2 rounded-full text-lg font-semibold">
                {currentImageIndex + 1} / {property.images.length}
              </div>

              <div className="relative max-w-6xl max-h-[80vh] flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={currentImage}
                  alt={`${property.title} - ${currentImageIndex + 1}`}
                  className="max-w-full max-h-[80vh] object-contain"
                />

                {property.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-4 rounded-full transition-all cursor-pointer"
                    >
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-4 rounded-full transition-all cursor-pointer"
                    >
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}
              </div>

              {property.images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 max-w-6xl">
                  <div className="flex items-center gap-2">
                    {hasMoreThumbnails && (
                      <button
                        onClick={prevThumbnails}
                        disabled={!canGoPrev}
                        className={`flex-shrink-0 p-3 md:p-2 rounded transition-all ${
                          canGoPrev 
                            ? 'bg-white/30 hover:bg-white/40 cursor-pointer shadow-lg' 
                            : 'bg-white/10 opacity-50 cursor-not-allowed'
                        } text-white`}
                      >
                        <svg className="w-6 h-6 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                    )}

                    <div className="flex flex-1 gap-2 max-w-2xl md:max-w-4xl overflow-x-auto">
                      {visibleThumbnails.map((img, idx) => {
                        const actualIndex = thumbnailStartIndex + idx;
                        return (
                          <button
                            key={actualIndex}
                            onClick={() => setCurrentImageIndex(actualIndex)}
                            className={`transition-all rounded cursor-pointer ${
                              actualIndex === currentImageIndex 
                                ? 'ring-4 ring-white' 
                                : 'opacity-60 hover:opacity-100'
                            } flex-shrink-0 md:flex-1 w-[100px] md:w-auto h-[70px]`}
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

                    {hasMoreThumbnails && (
                      <button
                        onClick={nextThumbnails}
                        disabled={!canGoNext}
                        className={`flex-shrink-0 p-3 md:p-2 rounded transition-all ${
                          canGoNext 
                            ? 'bg-white/30 hover:bg-white/40 cursor-pointer shadow-lg' 
                            : 'bg-white/10 opacity-50 cursor-not-allowed'
                        } text-white`}
                      >
                        <svg className="w-6 h-6 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

        {/* Layout 2 columnas - CONTENIDO ESTÁTICO */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Columna izquierda */}
          <div className="lg:col-span-2 space-y-6">
            
            <div className="bg-white">
              <div className="flex items-center gap-2 text-sm mb-4">
                <span className="text-gray-800 font-medium">{property.operation}</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-800 font-medium">{property.type}</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-800 font-medium">{property.region}</span>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-3">{property.title}</h1>

              <p className="text-gray-800 mb-6 font-medium">{property.address || `${property.location}, ${property.region}, Chile`}</p>
              
              <div className="flex items-center gap-6 pb-6 border-b border-gray-200">
                {property.bedrooms && (
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span className="text-gray-900 font-semibold">{property.bedrooms}</span>
                    <span className="text-gray-800 font-medium">camas</span>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                    </svg>
                    <span className="text-gray-900 font-semibold">{property.bathrooms}</span>
                    <span className="text-gray-800 font-medium">baños</span>
                  </div>
                )}
                {property.area && property.area !== "0" && (
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                    <span className="text-gray-900 font-semibold">{property.area}</span>
                    <span className="text-gray-800 font-medium">m²</span>
                  </div>
                )}
              </div>
            </div>

            {/* Características */}
            <div className="bg-white border border-gray-200 rounded">
              <h3 className="text-xl font-bold px-6 py-4 border-b border-gray-200 text-gray-900">Características</h3>
              <div className="px-6 py-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-gray-700 text-sm mb-1 font-medium">Categoría</p>
                    <p className="font-semibold text-gray-900 break-words">{property.type}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-gray-700 text-sm mb-1 font-medium">Operación</p>
                    <p className="font-semibold text-gray-900 break-words">{property.operation}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-gray-700 text-sm mb-1 font-medium">Comuna</p>
                    <p className="font-semibold text-gray-900 break-words">{property.comuna}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-gray-700 text-sm mb-1 font-medium">Dormitorios</p>
                    <p className="font-semibold text-gray-900">{property.bedrooms || 0}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-gray-700 text-sm mb-1 font-medium">Baños</p>
                    <p className="font-semibold text-gray-900">{property.bathrooms || 0}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-gray-700 text-sm mb-1 font-medium">Medios baños</p>
                    <p className="font-semibold text-gray-900">{property.halfBathrooms || 0}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-gray-700 text-sm mb-1 font-medium">Habitaciones totales</p>
                    <p className="font-semibold text-gray-900">{property.totalRooms || property.bedrooms || 0}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-gray-700 text-sm mb-1 font-medium">Cantidad Pisos</p>
                    <p className="font-semibold text-gray-900">{property.floors || 0}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-gray-700 text-sm mb-1 font-medium">N° de Piso</p>
                    <p className="font-semibold text-gray-900">{property.floorNumber || 0}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-gray-700 text-sm mb-1 font-medium">Superficie total</p>
                    <p className="font-semibold text-gray-900">{property.landArea || property.area} m²</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-gray-700 text-sm mb-1 font-medium">Superficie Útil</p>
                    <p className="font-semibold text-gray-900">{property.usefulArea || property.area} m²</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-gray-700 text-sm mb-1 font-medium">Año de construcción</p>
                    <p className="font-semibold text-gray-900">{property.yearBuilt || '-'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Descripción */}
            <div className="bg-white border border-gray-200 rounded">
              <h3 className="text-xl font-bold px-6 py-4 border-b border-gray-200 text-gray-900">Descripción</h3>
              <div className="px-6 py-6">
                <div 
                  className="text-gray-700 leading-relaxed prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: property.description }}
                />
              </div>
            </div>

            {/* Servicios */}
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

            {/* Mapa */}
            {property.latitude && property.longitude && (
              <div className="bg-white rounded border p-4">
                <h3 className="text-xl font-bold mb-4 text-gray-900">Ubicación</h3>
                <div className="w-full h-96 bg-gray-200 rounded overflow-hidden">
                  <GoogleMapComponent
                    latitude={property.latitude}
                    longitude={property.longitude}
                    title={property.title}
                  />
                </div>
              </div>
            )}

            {/* Video */}
            {property.videoUrl && (
              <div className="bg-white rounded border p-4">
                <h3 className="text-xl font-bold mb-4 text-gray-900">Video</h3>
                <div className="aspect-video bg-gray-200 rounded overflow-hidden">
                  <iframe
                    width="100%"
                    height="100%"
                    src={(() => {
                      const url = property.videoUrl;
                      if (url.includes('youtu.be/')) {
                        const videoId = url.split('youtu.be/')[1].split('?')[0];
                        return `https://www.youtube.com/embed/${videoId}`;
                      }
                      if (url.includes('watch?v=')) {
                        return url.replace('watch?v=', 'embed/');
                      }
                      return url;
                    })()}
                    title="Video de la propiedad"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

          </div>

          {/* Sidebar derecha */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              
              <div className="bg-white rounded border p-6">
                <div className="mb-4">
                  <div className="text-4xl font-bold text-gray-900">
                    {property.price}
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-3">¿Te interesa esta propiedad?</p>
                <a
                  href={`https://wa.me/56940454965?text=${encodeURIComponent(
                    `Hola, tengo algunas preguntas sobre ${property.title}. ${typeof window !== 'undefined' ? `${window.location.origin}/propiedades/${property.id}` : ''}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-blue-50 hover:bg-blue-100 border border-blue-200 text-gray-700 py-3 px-4 rounded transition-colors flex items-center justify-center gap-2 font-normal"
                >
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp
                </a>
              </div>

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