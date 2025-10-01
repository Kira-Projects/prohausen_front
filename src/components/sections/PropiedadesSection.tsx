"use client";

import { useState } from "react";
import PropertyCard from "@/components/properties/PropertyCard";
import PropertyListCard from "@/components/properties/PropertyListCard";
import PropertyFilters from "@/components/properties/PropertyFilters";

// Datos de ejemplo extendidos
const allProperties = [
  {
    id: 1,
    title: "Parcelas Bajo El Azul, Pupuya, Matanzas",
    location: "X4QC+3G Navidad, Chile",
    description: "Exclusivas parcelas de agrado ubicadas en un privilegiado sector de…",
    price: "1.690",
    area: "5700",
    type: "Parcela",
    operation: "Venta",
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
    type: "Parcela",
    operation: "Venta",
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
    type: "Departamento",
    operation: "Venta",
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
    type: "Departamento",
    operation: "Venta",
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
    type: "Parcela",
    operation: "Venta",
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
    type: "Parcela",
    operation: "Venta",
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
    type: "Departamento",
    operation: "Venta",
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
    type: "Casa",
    operation: "Venta",
    region: "Valparaíso",
    comuna: "Viña del Mar",
    featured: true,
    image: "/placeholder-property.jpg",
  },
];

export default function PropiedadesSection() {
  const [filteredProperties, setFilteredProperties] = useState(allProperties);
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid"); // grid, list, map

  const handleFilter = (filters: any) => {
    let filtered = [...allProperties];

    if (filters.operacion) {
      filtered = filtered.filter(
        (p) => p.operation.toLowerCase() === filters.operacion.toLowerCase()
      );
    }
    if (filters.categoria) {
      filtered = filtered.filter(
        (p) => p.type.toLowerCase() === filters.categoria.toLowerCase()
      );
    }
    if (filters.region) {
      filtered = filtered.filter(
        (p) => p.region.toLowerCase().includes(filters.region.toLowerCase())
      );
    }
    if (filters.comuna) {
      filtered = filtered.filter(
        (p) => p.comuna.toLowerCase().includes(filters.comuna.toLowerCase())
      );
    }

    setFilteredProperties(filtered);
  };

  const handleSort = (value: string) => {
    setSortBy(value);
    let sorted = [...filteredProperties];

    switch (value) {
      case "price-asc":
        sorted.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case "price-desc":
        sorted.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
      default:
        // newest - mantener orden original
        break;
    }

    setFilteredProperties(sorted);
  };

  return (
    <section id="propiedades" className="pt-28 pb-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Propiedades</h2>
        </div>

        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600 text-sm">
            <span className="font-bold">{filteredProperties.length}</span> resultados
          </p>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Ordenar por:</label>
              <select
                value={sortBy}
                onChange={(e) => handleSort(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-400 focus:border-transparent text-sm"
              >
                <option value="newest">El más nuevo</option>
                <option value="price-asc">Precio más bajo</option>
                <option value="price-desc">Precio más alto</option>
              </select>
            </div>

            {/* Iconos de visualización */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "grid" 
                    ? "bg-gray-200 text-gray-800" 
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "list" 
                    ? "bg-gray-200 text-gray-800" 
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode("map")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "map" 
                    ? "bg-gray-200 text-gray-800" 
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Renderizado según el modo de vista */}
        {viewMode === "grid" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredProperties.slice(0, 6).map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}

        {viewMode === "list" && (
          <div className="space-y-6 mb-8">
            {filteredProperties.slice(0, 6).map((property) => (
              <PropertyListCard key={property.id} property={property} />
            ))}
          </div>
        )}

        {viewMode === "map" && (
          <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center mb-8">
            <div className="text-center">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <p className="text-gray-500 text-lg">Vista de mapa próximamente</p>
            </div>
          </div>
        )}

        {/* Paginación */}
        <div className="flex justify-center items-center gap-2">
          <button className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm">
            1
          </button>
          <button className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm">
            2
          </button>
          <button className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm">
            3
          </button>
          <button className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm">
            4
          </button>
          <button className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm">
            →
          </button>
        </div>

        <p className="text-center text-gray-500 text-sm mt-4">
          1 - 11 of 43 properties
        </p>
      </div>
    </section>
  );
}
