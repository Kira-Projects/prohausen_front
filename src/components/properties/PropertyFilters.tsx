"use client";

import { useState } from "react";

interface PropertyFiltersProps {
  onFilter: (filters: any) => void;
}

export default function PropertyFilters({ onFilter }: PropertyFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    operacion: "",
    categoria: "",
    region: "",
    comuna: "",
  });

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters = {
      operacion: "",
      categoria: "",
      region: "",
      comuna: "",
    };
    setFilters(emptyFilters);
    onFilter(emptyFilters);
  };

  return (
    <div className="mb-8">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="mb-4 flex items-center gap-2 bg-blue-900 text-white px-6 py-2 rounded-md hover:bg-blue-800 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        Filtros
      </button>

      {isOpen && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Operación */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Operación</label>
              <select
                value={filters.operacion}
                onChange={(e) => handleFilterChange("operacion", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todas</option>
                <option value="arriendo">Arriendo</option>
                <option value="venta">Venta</option>
              </select>
            </div>

            {/* Categoría */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Categoría</label>
              <select
                value={filters.categoria}
                onChange={(e) => handleFilterChange("categoria", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todas</option>
                <option value="casa">Casa</option>
                <option value="departamento">Departamento</option>
                <option value="derecho-llave">Derecho a llave</option>
                <option value="parcela">Parcela</option>
                <option value="penthouse">Penthouse</option>
              </select>
            </div>

            {/* Región */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Región</label>
              <select
                value={filters.region}
                onChange={(e) => handleFilterChange("region", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todas</option>
                <option value="libertador-b-ohiggins">Libertador B. O&apos;Higgins</option>
                <option value="los-lagos">Los Lagos</option>
                <option value="metropolitana">Metropolitana</option>
                <option value="ohiggins">O&apos;Higgins</option>
                <option value="valparaiso">Valparaíso</option>
              </select>
            </div>

            {/* Comuna */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Comuna</label>
              <input
                type="text"
                value={filters.comuna}
                onChange={(e) => handleFilterChange("comuna", e.target.value)}
                placeholder="Buscar comuna"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={clearFilters}
              className="text-blue-900 hover:text-blue-700 font-medium"
            >
              Limpiar filtros
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

