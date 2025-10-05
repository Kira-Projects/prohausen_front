"use client";

import { useState, useEffect } from "react";
import PropertyCard from "@/components/properties/PropertyCard";
import PropertyFilters from "@/components/properties/PropertyFilters";
import { Property } from "@/types/property";
import { getProperties, getPropertyImagesOptimized } from "@/services/wordpress";
import { mapWordPressProperty } from "@/utils/mapWordPressData";

export default function PropiedadesPage() {
  // Estados sin datos hardcodeados - solo datos reales de WordPress
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [sortBy, setSortBy] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Cargar propiedades desde WordPress al montar el componente
  useEffect(() => {
    loadPropertiesFromWordPress();
  }, []);

  const loadPropertiesFromWordPress = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log("Cargando propiedades desde WordPress...");
      const wpProperties = await getProperties();
      
      if (wpProperties.length > 0) {
        console.log(`${wpProperties.length} propiedades obtenidas de WordPress`);
        
        const mappedProperties = await Promise.all(
          wpProperties.map(async (wpProp) => {
            // Usar método híbrido optimizado para obtener múltiples imágenes
            const allImages = await getPropertyImagesOptimized(wpProp);
            
            let featuredImageUrl = "";
            if (allImages.length > 0) {
              featuredImageUrl = allImages[0];
            }

            const mappedProperty = mapWordPressProperty(wpProp, featuredImageUrl);
            
            // Agregar todas las imágenes a la propiedad mapeada (máximo 5)
            if (allImages.length > 0) {
              mappedProperty.images = allImages.slice(0, 5); // Limitar a 5 imágenes
              mappedProperty.image = allImages[0]; // La primera imagen como principal
            }

            return mappedProperty;
          })
        );

        setAllProperties(mappedProperties);
        setFilteredProperties(mappedProperties);
      } else {
        console.log("No hay propiedades disponibles en WordPress");
        setError("No hay propiedades disponibles en este momento.");
        setAllProperties([]);
        setFilteredProperties([]);
      }
    } catch (err) {
      console.error("Error al cargar propiedades:", err);
      setError("Error al conectar con WordPress. Por favor, verifica tu conexión.");
      setAllProperties([]);
      setFilteredProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (filters: { operacion?: string; categoria?: string; region?: string; comuna?: string }) => {
    let filtered = [...allProperties];

    if (filters.operacion) {
      filtered = filtered.filter(
        (p) => p.operation.toLowerCase() === filters.operacion!.toLowerCase()
      );
    }
    if (filters.categoria) {
      filtered = filtered.filter(
        (p) => p.type.toLowerCase() === filters.categoria!.toLowerCase()
      );
    }
    if (filters.region) {
      filtered = filtered.filter(
        (p) => p.region.toLowerCase().includes(filters.region!.toLowerCase())
      );
    }
    if (filters.comuna) {
      filtered = filtered.filter(
        (p) => p.comuna.toLowerCase().includes(filters.comuna!.toLowerCase())
      );
    }

    setFilteredProperties(filtered);
    setCurrentPage(1); // Reiniciar a la primera página al filtrar
  };

  const handleSort = (value: string) => {
    setSortBy(value);

    switch (value) {
      case "price-asc":
        const sortedAsc = [...filteredProperties].sort((a, b) => {
          const priceA = parseFloat(a.price.replace(/\./g, ""));
          const priceB = parseFloat(b.price.replace(/\./g, ""));
          return priceA - priceB;
        });
        setFilteredProperties(sortedAsc);
        break;
      case "price-desc":
        const sortedDesc = [...filteredProperties].sort((a, b) => {
          const priceA = parseFloat(a.price.replace(/\./g, ""));
          const priceB = parseFloat(b.price.replace(/\./g, ""));
          return priceB - priceA;
        });
        setFilteredProperties(sortedDesc);
        break;
      default:
        // newest - mantener orden original
        break;
    }
  };

  // Calcular propiedades paginadas
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProperties = filteredProperties.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen pt-24 pb-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Propiedades</h1>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
            <p className="font-medium">⚠️ {error}</p>
          </div>
        )}

        {/* Filtros */}
        <PropertyFilters onFilter={handleFilter} />

        {/* Contador y ordenamiento */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-black">
            <span className="font-bold">{filteredProperties.length}</span> resultados
          </p>
          <div className="flex items-center gap-2">
            <label className="text-sm text-black">Ordenar por:</label>
            <select
              value={sortBy}
              onChange={(e) => handleSort(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-500"
            >
              <option value="newest">El más nuevo</option>
              <option value="price-asc">Precio más bajo</option>
              <option value="price-desc">Precio más alto</option>
            </select>
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Cargando propiedades desde WordPress...</p>
          </div>
        )}

        {/* Grid de propiedades */}
        {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {currentProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
        )}

        {/* Paginación */}
        {!loading && totalPages > 1 && (
          <div className="mt-8 flex justify-center items-center gap-1 sm:gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-2 sm:px-4 py-2 text-xs sm:text-sm rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="hidden sm:inline">Anterior</span>
              <span className="sm:hidden">‹</span>
            </button>
            
            <div className="flex gap-1 sm:gap-2 overflow-x-auto max-w-xs sm:max-w-none">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((page) => {
                  // En móviles, mostrar solo 3 páginas alrededor de la actual
                  if (totalPages <= 5) return true; // Mostrar todas si son pocas
                  
                  const start = Math.max(1, currentPage - 1);
                  const end = Math.min(totalPages, currentPage + 1);
                  return page >= start && page <= end;
                })
                .map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-2 sm:px-4 py-2 text-xs sm:text-sm rounded-md min-w-[32px] sm:min-w-[40px] ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-2 sm:px-4 py-2 text-xs sm:text-sm rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="hidden sm:inline">Siguiente</span>
              <span className="sm:hidden">›</span>
            </button>
          </div>
        )}

        {/* Sin resultados */}
        {!loading && filteredProperties.length === 0 && (
          <div className="text-center py-12">
            <p className="text-black text-lg">
              No se encontraron propiedades{error ? '.' : ' con los filtros seleccionados.'}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
