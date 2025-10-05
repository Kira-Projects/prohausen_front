"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchHero() {
  const router = useRouter();
  const [filters, setFilters] = useState({
    operacion: "",
    categoria: "",
    region: "",
    comuna: "",
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    router.push(`/propiedades?${params.toString()}`);
  };

  return (
    <div 
      className="relative text-white pt-48 pb-32 bg-cover bg-center bg-no-repeat min-h-[700px]"
      style={{
        backgroundImage: "url('/backgroun img.jpg')",
      }}
    >
      {/* Overlay oscuro para mejorar la legibilidad del texto */}
      <div className="absolute inset-0 bg-black/40"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Bienvenidos a Prohausen</h1>
          <p className="text-xl md:text-3xl">Encuentra tu propiedad aquí</p>
        </div>

        <form onSubmit={handleSearch} className="bg-white/95 backdrop-blur-sm rounded-lg shadow-xl p-6 text-gray-900">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Operación */}
            <div>
              <select
                value={filters.operacion}
                onChange={(e) => setFilters({ ...filters, operacion: e.target.value })}
                className="w-full px-4 py-3 bg-white border-0 rounded-md focus:ring-2 focus:ring-gray-300 focus:outline-none appearance-none cursor-pointer"
                style={{
                  backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23666'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E\")",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 0.75rem center",
                  backgroundSize: "1.5rem",
                  paddingRight: "2.5rem"
                }}
              >
                <option value="">Operación</option>
                <option value="arriendo">Arriendo</option>
                <option value="venta">Venta</option>
              </select>
            </div>

            {/* Categoría */}
            <div>
              <select
                value={filters.categoria}
                onChange={(e) => setFilters({ ...filters, categoria: e.target.value })}
                className="w-full px-4 py-3 bg-white border-0 rounded-md focus:ring-2 focus:ring-gray-300 focus:outline-none appearance-none cursor-pointer"
                style={{
                  backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23666'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E\")",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 0.75rem center",
                  backgroundSize: "1.5rem",
                  paddingRight: "2.5rem"
                }}
              >
                <option value="">Categoría</option>
                <option value="casa">Casa</option>
                <option value="departamento">Departamento</option>
                <option value="derecho-llave">Derecho a llave</option>
                <option value="parcela">Parcela</option>
                <option value="penthouse">Penthouse</option>
              </select>
            </div>

            {/* Región */}
            <div>
              <select
                value={filters.region}
                onChange={(e) => setFilters({ ...filters, region: e.target.value })}
                className="w-full px-4 py-3 bg-white border-0 rounded-md focus:ring-2 focus:ring-gray-300 focus:outline-none appearance-none cursor-pointer"
                style={{
                  backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23666'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E\")",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 0.75rem center",
                  backgroundSize: "1.5rem",
                  paddingRight: "2.5rem"
                }}
              >
                <option value="">Región</option>
                <option value="libertador-b-ohiggins">Libertador B. O&apos;Higgins</option>
                <option value="los-lagos">Los Lagos</option>
                <option value="metropolitana">Metropolitana</option>
                <option value="ohiggins">O&apos;Higgins</option>
                <option value="valparaiso">Valparaíso</option>
              </select>
            </div>

            {/* Comuna */}
            <div>
              <input
                type="text"
                value={filters.comuna}
                onChange={(e) => setFilters({ ...filters, comuna: e.target.value })}
                placeholder="Comuna"
                className="w-full px-4 py-3 bg-white border-0 rounded-md focus:ring-2 focus:ring-gray-300 focus:outline-none"
              />
            </div>

            {/* Botón de búsqueda */}
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full bg-[#2563EB] text-white px-6 py-2 rounded-md hover:bg-[#1E40AF] transition-colors font-medium uppercase flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Búsqueda
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

