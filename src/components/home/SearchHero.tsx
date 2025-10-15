"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SearchHero() {
  const router = useRouter();
  const [filters, setFilters] = useState({
    operacion: "",
    categoria: "",
    region: "",
    comuna: "",
  });

  // Estados para opciones dinámicas
  const [availableRegions, setAvailableRegions] = useState<string[]>([]);
  const [availableComunas, setAvailableComunas] = useState<string[]>([]);

  // Cargar regiones y comunas dinámicamente desde la API
  useEffect(() => {
    fetch('/api/all-properties')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.properties) {
          // Extraer regiones únicas y filtrar vacías/nulas
          const regions = [...new Set(
            data.properties
              .map((p: { region: string }) => p.region)
              .filter((r: string) => r && r.trim() !== '')
          )].sort() as string[];
          
          // Extraer comunas únicas y filtrar vacías/nulas
          const comunas = [...new Set(
            data.properties
              .map((p: { comuna: string }) => p.comuna)
              .filter((c: string) => c && c.trim() !== '')
          )].sort() as string[];
          
          setAvailableRegions(regions);
          setAvailableComunas(comunas);
        }
      })
      .catch(err => console.error('Error cargando filtros:', err));
  }, []);

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
      className="relative text-white pt-32 sm:pt-40 lg:pt-48 pb-16 sm:pb-24 lg:pb-32 bg-cover bg-center bg-no-repeat min-h-[600px] sm:min-h-[650px] lg:min-h-[700px] overflow-hidden"
      style={{
        backgroundImage: "url('/backgroun img.jpg')",
      }}
    >
      {/* Overlay oscuro para mejorar la legibilidad del texto */}
      <div className="absolute inset-0 bg-black/40"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-poppins mb-4 sm:mb-6 px-4">Bienvenidos a Prohausen</h1>
          <p className="text-lg sm:text-xl md:text-2xl lg:text-4xl px-4 font-poppins">Encuentra tu propiedad aquí</p>
        </div>

        <div className="mx-4 sm:mx-6 lg:mx-8">
          <form onSubmit={handleSearch} className="bg-transparent backdrop-blur-sm rounded-lg shadow-xl p-4 sm:p-6 text-white">
            <div className="space-y-4 lg:space-y-0 lg:grid lg:grid-cols-5 lg:gap-4 lg:items-end">
            {/* Operación */}
            <div>
              <select
                value={filters.operacion}
                onChange={(e) => setFilters({ ...filters, operacion: e.target.value })}
                className="w-full px-4 py-3 bg-white/90 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none cursor-pointer text-gray-900"
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
                className="w-full px-4 py-3 bg-white/90 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none cursor-pointer text-gray-900"
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
                className="w-full px-4 py-3 bg-white/90 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none cursor-pointer text-gray-900"
              >
                <option value="">Región</option>
                {availableRegions.map(region => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>

            {/* Comuna */}
            <div>
              <select
                value={filters.comuna}
                onChange={(e) => setFilters({ ...filters, comuna: e.target.value })}
                className="w-full px-4 py-3 bg-white/90 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none cursor-pointer text-gray-900"
              >
                <option value="">Comuna</option>
                {availableComunas.map(comuna => (
                  <option key={comuna} value={comuna}>
                    {comuna}
                  </option>
                ))}
              </select>
            </div>

            {/* Botón de búsqueda */}
            <div>
              <button
                type="submit"
                className="w-full bg-blue-700 text-white px-6 py-3 rounded-md hover:bg-blue-900 transition-colors font-medium uppercase flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Buscar
              </button>
            </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

