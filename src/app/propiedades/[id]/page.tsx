"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function PropertyDetailPage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Datos estáticos de ejemplo (serán dinámicos más adelante)
  const property = {
    id: 1,
    title: "Dpto Costas de Montemar",
    type: "Departamento",
    operation: "Venta",
    region: "Valparaíso",
    comuna: "Concón",
    price: "9.199",
    bedrooms: 3,
    bathrooms: 2,
    area: 123,
    usefulArea: 95,
    floors: 28,
    floorNumber: 23,
    groundLevel: -1,
    yearBuilt: 2022,
    description: `Precioso departamento ubicado en un exclusivo condominio de Costas de Montemar, Concón.
Esta propiedad te fascinará por su imponente vista al mar y sus luminosos espacios. El departamento cuenta con un precioso hall de acceso, amplia cocina americana que conecta armónicamente con el living y terraza del departamento, 3 dormitorios, siendo 1 de ellos en suite, con vista al mar y su propia terraza independiente.
En relación a sus áreas comunes, el departamento se encuentra al interior de un exclusivo departamento que cuenta lindas áreas verdes y comunes, tales como, sauna, jacuzzi, sala de cine, sala de eventos, azotea con parrilla y vista al mar, gimnasio, seguridad las 24 horas y circuito cerrado de cámaras. Adicionalmente la propiedad considera 2 estacionamiento y bodega asociada.`,
    features: ["Azotea", "Gimnasio", "Jacuzzi", "Quincho", "Sala de cine", "Sala Eventos"],
    images: [
      "https://via.placeholder.com/800x600/cccccc/666666?text=Imagen+1",
      "https://via.placeholder.com/800x600/cccccc/666666?text=Imagen+2",
      "https://via.placeholder.com/800x600/cccccc/666666?text=Imagen+3",
      "https://via.placeholder.com/800x600/cccccc/666666?text=Imagen+4",
    ],
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("URL copiada al portapapeles");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header con breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-gray-900">Inicio</Link>
            <span>/</span>
            <Link href="/propiedades" className="hover:text-gray-900">Propiedades</Link>
            <span>/</span>
            <span className="text-gray-900">{property.title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Título y tags principales */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium">
              {property.operation}
            </span>
            <span className="bg-gray-200 text-gray-800 px-3 py-1 rounded text-sm font-medium">
              {property.type}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {property.title}
          </h1>
          <p className="text-lg text-gray-600">
            {property.region} • {property.comuna}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna principal - Imágenes y descripción */}
          <div className="lg:col-span-2 space-y-8">
            {/* Galería de imágenes */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative aspect-video bg-gray-200">
                <img 
                  src={property.images[currentImageIndex]} 
                  alt={`${property.title} - imagen ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                />
                
                {/* Botones de navegación */}
                <button 
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
                  aria-label="Imagen anterior"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button 
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
                  aria-label="Imagen siguiente"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Indicador de imágenes */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {property.images.length}
                </div>
              </div>

              {/* Miniaturas */}
              <div className="p-4 grid grid-cols-4 gap-2">
                {property.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`relative aspect-video rounded overflow-hidden ${
                      idx === currentImageIndex ? 'ring-2 ring-blue-600' : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Miniatura ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Características principales */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="flex flex-col items-center gap-2">
                  <svg className="w-8 h-8 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{property.bedrooms}</p>
                    <p className="text-sm text-gray-600">Dormitorios</p>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <svg className="w-8 h-8 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{property.bathrooms}</p>
                    <p className="text-sm text-gray-600">Baños</p>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <svg className="w-8 h-8 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{property.area}</p>
                    <p className="text-sm text-gray-600">m² totales</p>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <svg className="w-8 h-8 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{property.usefulArea}</p>
                    <p className="text-sm text-gray-600">m² útiles</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Características detalladas */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Características</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium text-gray-600">Categoría:</span>
                  <span className="text-gray-900">{property.type}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium text-gray-600">Región:</span>
                  <span className="text-gray-900">{property.region}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium text-gray-600">Operación:</span>
                  <span className="text-gray-900">{property.operation}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium text-gray-600">Comuna:</span>
                  <span className="text-gray-900">{property.comuna}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium text-gray-600">Dormitorios:</span>
                  <span className="text-gray-900">{property.bedrooms}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium text-gray-600">Baños:</span>
                  <span className="text-gray-900">{property.bathrooms}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium text-gray-600">Cantidad Pisos:</span>
                  <span className="text-gray-900">{property.floors}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium text-gray-600">N° de Piso:</span>
                  <span className="text-gray-900">{property.floorNumber}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium text-gray-600">Nivel del suelo:</span>
                  <span className="text-gray-900">{property.groundLevel}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium text-gray-600">Superficie total:</span>
                  <span className="text-gray-900 font-bold">{property.area} m²</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium text-gray-600">Superficie útil:</span>
                  <span className="text-gray-900 font-bold">{property.usefulArea} m²</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium text-gray-600">Año de construcción:</span>
                  <span className="text-gray-900">{property.yearBuilt}</span>
                </div>
              </div>
            </div>

            {/* Descripción */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Descripción</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </div>

            {/* Servicios y características */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Servicios y características</h2>
              <div className="flex flex-wrap gap-2">
                {property.features.map((feature, idx) => (
                  <span 
                    key={idx}
                    className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>

            {/* Video */}
            {property.videoUrl && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Video</h2>
                <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                  <iframe
                    width="100%"
                    height="100%"
                    src={property.videoUrl}
                    title="Video de la propiedad"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            )}
          </div>

          {/* Columna lateral - Precio y contacto */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
              {/* Precio y compartir */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="mb-6">
                  <p className="text-3xl font-bold text-gray-900">$ {property.price}</p>
                </div>

                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Comparte esta propiedad</h3>
                  <button 
                    onClick={copyUrl}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm transition-colors mb-2"
                  >
                    Copiar URL
                  </button>
                  <div className="flex gap-2">
                    <a 
                      href={`https://www.facebook.com/sharer/sharer.php?u=${typeof window !== 'undefined' ? window.location.href : ''}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg text-center transition-colors"
                    >
                      Facebook
                    </a>
                    <a 
                      href={`https://api.whatsapp.com/send?text=${typeof window !== 'undefined' ? window.location.href : ''}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg text-center transition-colors"
                    >
                      WhatsApp
                    </a>
                  </div>
                </div>
              </div>

              {/* Formulario de contacto */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">¿Te interesa esta propiedad?</h3>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre
                    </label>
                    <input 
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      placeholder="Tu nombre"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono
                    </label>
                    <input 
                      type="tel"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      placeholder="+56 9 1234 5678"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input 
                      type="email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      placeholder="tu@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mensaje
                    </label>
                    <textarea 
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      placeholder="Escribe tu mensaje aquí..."
                    ></textarea>
                  </div>
                  <button 
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
                  >
                    Enviar consulta
                  </button>
                </form>
              </div>

              {/* Botón volver */}
              <Link 
                href="/propiedades"
                className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-lg text-center transition-colors"
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

