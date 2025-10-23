"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import PropertyCard from "@/components/properties/PropertyCard";
import PropertyFilters from "@/components/properties/PropertyFilters";
import { Property } from "@/types/property";

function PropiedadesContent() {
  // Estados sin datos hardcodeados - solo datos reales desde Upstash
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Obtener parámetros de búsqueda de la URL
  const searchParams = useSearchParams();

  // Función para normalizar texto (elimina tildes, convierte a minúsculas, normaliza espacios)
  const normalizeText = (text: string): string => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  };

  // Cargar propiedades desde Upstash al montar el componente
  useEffect(() => {
    loadPropertiesFromCache();
  }, []);

  // Aplicar filtros de la URL cuando cambian los searchParams o las propiedades
  useEffect(() => {
    if (allProperties.length > 0) {
      const urlFilters = {
        operacion: searchParams.get('operacion') || '',
        categoria: searchParams.get('categoria') || '',
        region: searchParams.get('region') || '',
        comuna: searchParams.get('comuna') || ''
      };
      
      // Aplicar filtros
      let filtered = [...allProperties];

      if (urlFilters.operacion) {
        filtered = filtered.filter(
          (p) => normalizeText(p.operation) === normalizeText(urlFilters.operacion!)
        );
      }
      if (urlFilters.categoria) {
        filtered = filtered.filter(
          (p) => normalizeText(p.type) === normalizeText(urlFilters.categoria!)
        );
      }
      if (urlFilters.region) {
        filtered = filtered.filter(
          (p) => normalizeText(p.region).includes(normalizeText(urlFilters.region!))
        );
      }
      if (urlFilters.comuna) {
        filtered = filtered.filter(
          (p) => normalizeText(p.comuna).includes(normalizeText(urlFilters.comuna!))
        );
      }

      setFilteredProperties(filtered);
      setCurrentPage(1);
    }
  }, [allProperties, searchParams]);

  const loadPropertiesFromCache = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/all-properties', {
        method: 'GET',
        next: { revalidate: 60 }
      });

      if (!response.ok) {
        throw new Error('Error al cargar propiedades desde MongoDB');
      }

      const data = await response.json();
      
      if (!data.success || !data.properties) {
        throw new Error('No se pudieron cargar las propiedades desde MongoDB');
      }

      const properties: Property[] = data.properties;

      setAllProperties(properties);
      setFilteredProperties(properties);
    } catch (err) {
      console.error("Error al cargar propiedades:", err);
      setError(err instanceof Error ? err.message : "Error al conectar con la base de datos. Por favor, verifica tu conexión.");
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
        (p) => normalizeText(p.operation) === normalizeText(filters.operacion!)
      );
    }
    if (filters.categoria) {
      filtered = filtered.filter(
        (p) => normalizeText(p.type) === normalizeText(filters.categoria!)
      );
    }
    if (filters.region) {
      filtered = filtered.filter(
        (p) => normalizeText(p.region).includes(normalizeText(filters.region!))
      );
    }
    if (filters.comuna) {
      filtered = filtered.filter(
        (p) => normalizeText(p.comuna).includes(normalizeText(filters.comuna!))
      );
    }

    setFilteredProperties(filtered);
    setCurrentPage(1); // Reiniciar a la primera página al filtrar
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
    <main className="min-h-screen pt-40 pb-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h1 className="text-5xl font-poppins text-gray-900">Propiedades</h1>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
            <p className="font-medium">⚠️ {error}</p>
          </div>
        )}

        {/* Contador y Filtros */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <p className="text-black">
              <span className="font-bold">{filteredProperties.length}</span> resultados
            </p>
            <PropertyFilters 
              onFilter={handleFilter} 
              initialFilters={{
                operacion: searchParams.get('operacion') || '',
                categoria: searchParams.get('categoria') || '',
                region: searchParams.get('region') || '',
                comuna: searchParams.get('comuna') || ''
              }}
            />
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Cargando propiedades desde MongoDB...</p>
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
                      ? 'bg-blue-900 text-white'
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

// Componente principal con Suspense boundary
export default function PropiedadesPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando propiedades...</p>
        </div>
      </div>
    }>
      <PropiedadesContent />
    </Suspense>
  );
}
