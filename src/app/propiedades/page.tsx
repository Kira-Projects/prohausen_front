"use client";

import { useState, useEffect } from "react";
import PropertyCard from "@/components/properties/PropertyCard";
import PropertyFilters from "@/components/properties/PropertyFilters";
import { Property } from "@/types/property";
import { getProperties } from "@/services/wordpress";
import { mapWordPressProperties } from "@/utils/mapWordPressData";

// Datos de ejemplo como fallback
const mockProperties: Property[] = [
  {
    id: 1,
    title: "Parcelas Bajo El Azul, Pupuya, Matanzas",
    location: "X4QC+3G Navidad, Chile",
    description: "Exclusivas parcelas de agrado ubicadas en un privilegiado sector de…",
    price: "1.690",
    area: "5700",
    type: "Parcela" as const,
    operation: "Venta" as const,
    region: "O'Higgins",
    comuna: "Navidad",
    featured: true,
    image: "/placeholder-property.jpg",
  },
  {
    id: 2,
    title: "Parcelas Punta Pupuya, Matanzas",
    location: "24F9+26 Navidad, Chile",
    description: "Condominio Punta Pupuya es un proyecto inmobiliario ubicado en primera…",
    price: "13.900",
    area: "5000",
    type: "Parcela" as const,
    operation: "Venta" as const,
    region: "O'Higgins",
    comuna: "Navidad",
    featured: true,
    image: "/placeholder-property.jpg",
  },
  {
    id: 3,
    title: "Dpto Manquehue Norte",
    location: "Av. Manquehue Nte. 2475, Vitacura",
    description: "Exclusivo y amplio departamento ubicado en un privilegiado sector de…",
    price: "16.900",
    bedrooms: 4,
    bathrooms: 4,
    area: "220",
    type: "Departamento" as const,
    operation: "Venta" as const,
    region: "Metropolitana",
    comuna: "Vitacura",
    featured: true,
    image: "/placeholder-property.jpg",
  },
  {
    id: 4,
    title: "Dpto I Proyecto Pocuro",
    location: "Av. Pocuro 2191, Providencia",
    description: "Exclusivos departamentos nuevos en venta, ubicados en calle Pocuro, comuna…",
    price: "12.190",
    bedrooms: 3,
    bathrooms: 3,
    area: "121",
    type: "Departamento" as const,
    operation: "Venta" as const,
    region: "Metropolitana",
    comuna: "Providencia",
    featured: true,
    image: "/placeholder-property.jpg",
  },
  {
    id: 5,
    title: "Parcela Huilo Huilo",
    location: "43CG+QV Puerto Fuy, Panguipulli, Chile",
    description: "Preciosa parcela en venta en un exclusivo condominio al interior…",
    price: "1.400",
    area: "5000",
    type: "Parcela" as const,
    operation: "Venta" as const,
    region: "Los Lagos",
    comuna: "Panguipulli",
    featured: true,
    image: "/placeholder-property.jpg",
  },
  {
    id: 6,
    title: "Parcelas San Isidro",
    location: "Pueblo de Indios, Quillota, Valparaíso, Chile",
    description: "Exclusivas parcelas de agrado, ubicadas en un privilegiado sector Quillota,…",
    price: "4.590",
    area: "5000",
    type: "Parcela" as const,
    operation: "Venta" as const,
    region: "Valparaíso",
    comuna: "Quillota",
    featured: true,
    image: "/placeholder-property.jpg",
  },
  {
    id: 7,
    title: "Departamento Halimeda",
    location: "Halimeda, Viña del Mar, Valparaíso, Chile",
    description: "Amplio departamento ubicado en un privilegiado sector de Viña del…",
    price: "5.790",
    bedrooms: 3,
    bathrooms: 2,
    area: "85",
    type: "Departamento" as const,
    operation: "Venta" as const,
    region: "Valparaíso",
    comuna: "Viña del Mar",
    featured: true,
    image: "/placeholder-property.jpg",
  },
  {
    id: 8,
    title: "Casa 1 Norte",
    location: "1 Nte., Viña del Mar, Valparaíso, Chile",
    description: "Amplia propiedad ubicada en un privilegiado sector de la comuna…",
    price: "14.890",
    bedrooms: 5,
    bathrooms: 4,
    area: "973",
    type: "Casa" as const,
    operation: "Venta" as const,
    region: "Valparaíso",
    comuna: "Viña del Mar",
    featured: true,
    image: "/placeholder-property.jpg",
  },
  {
    id: 9,
    title: "Dpto Hernando de Aguirre",
    location: "Hernando de Aguirre 1191, Providencia",
    description: "Precioso departamento en venta, ubicado a solo una cuadra de…",
    price: "8.499",
    bedrooms: 2,
    bathrooms: 2,
    area: "95",
    type: "Departamento" as const,
    operation: "Venta" as const,
    region: "Metropolitana",
    comuna: "Providencia",
    image: "/placeholder-property.jpg",
  },
  {
    id: 10,
    title: "PentHouse Málaga",
    location: "Las Condes",
    description: "Exclusivo Penthouse con vista panorámica, ubicado en uno de los…",
    price: "22.999",
    bedrooms: 4,
    bathrooms: 3,
    area: "388",
    type: "Penthouse" as const,
    operation: "Venta" as const,
    region: "Metropolitana",
    comuna: "Las Condes",
    image: "/placeholder-property.jpg",
  },
  {
    id: 11,
    title: "Dpto Costas de Montemar",
    location: "Concón",
    description: "Precioso departamento ubicado en un exclusivo condominio de Costas de…",
    price: "9.199",
    bedrooms: 3,
    bathrooms: 2,
    area: "123",
    type: "Departamento" as const,
    operation: "Venta" as const,
    region: "Valparaíso",
    comuna: "Concón",
    image: "/placeholder-property.jpg",
  },
];

export default function PropiedadesPage() {
  const [allProperties, setAllProperties] = useState<Property[]>(mockProperties);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(mockProperties);
  const [sortBy, setSortBy] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        const mapped = mapWordPressProperties(wpProperties);
        setAllProperties(mapped);
        setFilteredProperties(mapped);
      } else {
        console.log("No se encontraron propiedades, usando datos de ejemplo");
        setAllProperties(mockProperties);
        setFilteredProperties(mockProperties);
      }
    } catch (err) {
      console.error("Error al cargar propiedades:", err);
      setError("Error al cargar las propiedades. Mostrando datos de ejemplo.");
      setAllProperties(mockProperties);
      setFilteredProperties(mockProperties);
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

  return (
    <main className="min-h-screen pt-24 pb-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Propiedades</h1>
          
          {/* Botón de actualizar */}
          <button
            onClick={loadPropertiesFromWordPress}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Cargando...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Actualizar
              </>
            )}
          </button>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-yellow-800">{error}</p>
          </div>
        )}

        <PropertyFilters onFilter={handleFilter} />

        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            <span className="font-bold">{filteredProperties.length}</span> resultados
          </p>

          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Ordenar por:</label>
            <select
              value={sortBy}
              onChange={(e) => handleSort(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}

        {/* Sin resultados */}
        {!loading && filteredProperties.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No se encontraron propiedades con los filtros seleccionados.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

