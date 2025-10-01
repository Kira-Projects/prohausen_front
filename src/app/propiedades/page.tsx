"use client";

import { useState } from "react";
import PropertyCard from "@/components/properties/PropertyCard";
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
  {
    id: 9,
    title: "Dpto Hernando de Aguirre",
    location: "Hernando de Aguirre 1191, Providencia",
    description: "Precioso departamento en venta, ubicado a solo una cuadra de…",
    price: "8.499",
    bedrooms: 2,
    bathrooms: 2,
    area: "95",
    type: "Departamento",
    operation: "Venta",
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
    type: "Penthouse",
    operation: "Venta",
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
    type: "Departamento",
    operation: "Venta",
    region: "Valparaíso",
    comuna: "Concón",
    image: "/placeholder-property.jpg",
  },
];

export default function PropiedadesPage() {
  const [filteredProperties, setFilteredProperties] = useState(allProperties);
  const [sortBy, setSortBy] = useState("newest");

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
    <main className="min-h-screen pt-24 pb-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">Propiedades</h1>

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>

        {filteredProperties.length === 0 && (
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

