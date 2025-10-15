"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import PropertyCard from "@/components/properties/PropertyCard";
import { Property } from "@/types/property";

export default function FeaturedProperties() {
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeaturedProperties() {
      try {
        const response = await fetch('/api/featured-properties', {
          method: 'GET',
          next: { revalidate: 60 }
        });

        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        
        if (!data.success || !data.properties) {
          throw new Error('No se pudieron cargar las propiedades desde caché');
        }

        // ✅ FILTRAR SOLO LAS PROPIEDADES CON featured: true
        const featuredOnly: Property[] = data.properties.filter(
          (prop: Property) => prop.featured === true
        );

        console.log('🏠 Total propiedades recibidas:', data.properties.length);
        console.log('⭐ Propiedades destacadas filtradas:', featuredOnly.length);

        setFeaturedProperties(featuredOnly);
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
          <h2 className="text-4xl font-poppins text-center mb-12 text-gray-900">
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
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-poppins text-gray-900">Propiedades Destacadas</h2>
        </div>
        
        {featuredProperties.length === 0 ? (
          <div className="text-center text-gray-900 py-12">
            No hay propiedades destacadas disponibles en este momento.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link
            href="/propiedades"
            className="inline-block bg-blue-700 text-white px-8 py-3 rounded-md hover:bg-blue-900 transition-colors font-medium"
            //bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16
          >
            Ver todas las propiedades
          </Link>
        </div>
      </div>
    </section>
  );
}

