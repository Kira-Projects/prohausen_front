"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import PropertyCard from "@/components/properties/PropertyCard";
import { Property } from "@/types/property";
import { getProperties, getPropertyImagesOptimized } from "@/services/wordpress";
import { mapWordPressProperty } from "@/utils/mapWordPressData";



export default function FeaturedProperties() {
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeaturedProperties() {
      try {
        const wpProperties = await getProperties();
        
        // Filtrar solo las propiedades destacadas
        const featured = wpProperties.filter(
          (prop) => prop.class_list.includes("es_label-featured")
        );

        // Mapear propiedades y obtener imágenes destacadas
        const mappedProperties = await Promise.all(
          featured.slice(0, 4).map(async (wpProp) => {
            // Usar método híbrido para obtener múltiples imágenes
            const allImages = await getPropertyImagesOptimized(wpProp);
            
            let featuredImageUrl = "";
            if (allImages.length > 0) {
              featuredImageUrl = allImages[0];
            }

            const mappedProperty = mapWordPressProperty(wpProp, featuredImageUrl);
            
            // Agregar todas las imágenes a la propiedad mapeada
            if (allImages.length > 0) {
              mappedProperty.images = allImages;
              mappedProperty.image = allImages[0]; // La primera imagen como principal
            }

            return mappedProperty;
          })
        );

        setFeaturedProperties(mappedProperties);
      } catch (error) {
        console.error("Error loading featured properties:", error);
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
          <div className="text-center text-gray-600">
            Cargando propiedades...
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

