"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import PropertyCard from "@/components/properties/PropertyCard";
import { Property } from "@/types/property";

export default function FeaturedProperties() {
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadTime, setLoadTime] = useState<number>(0);

  useEffect(() => {
    async function loadFeaturedProperties() {
      try {
        const startTime = performance.now();
        console.time("🏠 Total Featured Properties Load Time");
        console.log("🔍 [Frontend] Solicitando propiedades a /api/featured-properties...");
        
        // Consultar desde Upstash cache (vía API route backend)
        // Usa revalidate en lugar de no-store para permitir cache del navegador
        const response = await fetch('/api/featured-properties', {
          method: 'GET',
          next: { revalidate: 60 } // Cache por 60 segundos
        });

        console.log("📡 [Frontend] Respuesta recibida:", response.status, response.statusText);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error("❌ [Frontend] Error en respuesta:", errorData);
          throw new Error(`API Error: ${response.status} - ${errorData.error || 'Unknown'}`);
        }

        const data = await response.json();
        console.log("📦 [Frontend] Datos recibidos:", {
          success: data.success,
          cached: data.cached,
          count: data.count,
          loadTime: data.loadTime,
          tienePropiedades: !!data.properties,
          cantidadPropiedades: data.properties?.length || 0
        });
        
        if (!data.success || !data.properties) {
          throw new Error('No se pudieron cargar las propiedades desde caché');
        }

        const mapped: Property[] = data.properties;
        console.log(`✅ [Frontend] Propiedades mapeadas: ${mapped.length}`);
        console.log("📋 [Frontend] Primera propiedad:", mapped[0]);

        const endTime = performance.now();
        const totalLoadTime = Math.round(endTime - startTime);
        setLoadTime(totalLoadTime);

        setFeaturedProperties(mapped);
        console.timeEnd("🏠 Total Featured Properties Load Time");
        console.log(
          `⚡ [Frontend] ${mapped.length} propiedades destacadas cargadas en ${totalLoadTime}ms (CACHE)`
        );
      } catch (error) {
        console.error("Error loading featured properties:", error);
        setFeaturedProperties([]);
      } finally {
        setLoading(false);
      }
    }

    loadFeaturedProperties();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Propiedades Destacadas
          </h2>
          {/* Loading Skeleton - Mejor UX durante carga */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                <div className="h-56 bg-gray-300"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-300 rounded mb-4"></div>
                  <div className="h-3 bg-gray-300 rounded mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded mb-4 w-3/4"></div>
                  <div className="h-6 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Propiedades Destacadas</h2>
          {loadTime > 0 && (
            <span className={`text-sm font-mono ${loadTime < 1500 ? 'text-green-600' : 'text-orange-600'}`}>
              ⚡ {loadTime < 1000 ? '🚀 CACHE' : 'API'} - {loadTime}ms
            </span>
          )}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {featuredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/propiedades"
            className="inline-block bg-blue-900 text-white px-8 py-3 rounded-md hover:bg-blue-800 transition-colors font-medium"
          >
            Ver todas las propiedades
          </Link>
        </div>
      </div>
    </section>
  );
}

