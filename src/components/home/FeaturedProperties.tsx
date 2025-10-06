"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import PropertyCard from "@/components/properties/PropertyCard";
import { Property } from "@/types/property";
import { mapWordPressProperty } from "@/utils/mapWordPressData";
import type { WordPressProperty } from "@/types/property";

// Interface temporal para datos embebidos
interface EmbeddedProperty extends WordPressProperty {
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      source_url?: string;
      guid?: {
        rendered: string;
      };
    }>;
  };
}



export default function FeaturedProperties() {
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeaturedProperties() {
      try {
        console.time("🏠 Total Featured Properties Load Time");
        
        // SOLUCIÓN FINAL: Una sola llamada con _embed pero limitada y optimizada
        
        // Obtener SOLO propiedades destacadas con imágenes embebidas en UNA SOLA LLAMADA
        const response = await fetch(
          `https://prohausen.cl/wp-json/wp/v2/properties?per_page=20&_embed&orderby=modified&order=desc`,
          { next: { revalidate: 7200 } } // Cache 2 horas para evitar sobrecarga
        );
        
        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }
        
        const propertiesWithMedia = await response.json();
        console.log(`📋 Propiedades con media obtenidas: ${propertiesWithMedia.length}`);
        
        // Filtrar solo las destacadas
        const featuredProperties = (propertiesWithMedia as EmbeddedProperty[])
          .filter((prop) => prop.class_list.includes("es_label-featured"))
          .slice(0, 4);
          
        console.log(`⭐ Propiedades destacadas encontradas: ${featuredProperties.length}`);
        
        // Mapear con imágenes embebidas (sin llamadas adicionales)
        const mappedProperties = featuredProperties.map((wpProp) => {
          let featuredImageUrl = "";
          
          // Extraer imagen de datos embebidos
          try {
            if (wpProp._embedded?.["wp:featuredmedia"]?.[0]?.source_url) {
              featuredImageUrl = wpProp._embedded["wp:featuredmedia"][0].source_url;
              console.log(`✅ Imagen embebida para ${wpProp.id}: ${featuredImageUrl}`);
            } else if (wpProp._embedded?.["wp:featuredmedia"]?.[0]?.guid?.rendered) {
              // Backup: usar guid si source_url no está disponible
              featuredImageUrl = wpProp._embedded["wp:featuredmedia"][0].guid.rendered;
              console.log(`🔄 Usando GUID para ${wpProp.id}: ${featuredImageUrl}`);
            } else {
              console.warn(`⚠️ No image data for property ${wpProp.id}`, wpProp._embedded);
            }
          } catch (error) {
            console.error(`❌ Error procesando imagen para ${wpProp.id}:`, error);
          }

          const mappedProperty = mapWordPressProperty(wpProp, featuredImageUrl);
          return mappedProperty;
        });

        setFeaturedProperties(mappedProperties);
        console.timeEnd("🏠 Total Featured Properties Load Time");
        console.log(`⚡ ${mappedProperties.length} propiedades destacadas cargadas en tiempo récord`);
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
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Propiedades Destacadas</h2>
        
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

