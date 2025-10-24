"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Property } from "@/types/property";
import { useAuth } from "@/contexts/AuthContext";
import { getPropertyUrl } from "@/utils/propertyUrl";

export default function AdminPropertiesPage() {
  const { isAuthenticated, password, login, logout } = useAuth();
  const [loginPassword, setLoginPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [message, setMessage] = useState<{
    type: "success" | "error" | "info";
    text: string;
  } | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterActive, setFilterActive] = useState<boolean | "all">("all");
  const [filterFeatured, setFilterFeatured] = useState<boolean | "all">("all");

  // Auto-cerrar mensajes después de 5 segundos
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterActive !== "all") params.append("active", String(filterActive));
      if (filterFeatured !== "all") params.append("featured", String(filterFeatured));

      const response = await fetch(`/api/admin/properties?${params}`, {
        headers: {
          "x-admin-password": password,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProperties(data.data || []);
      } else {
        setMessage({ type: "error", text: "Error al cargar propiedades" });
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage({ type: "error", text: "Error de conexión" });
    } finally {
      setLoading(false);
    }
  }, [password, filterActive, filterFeatured]);

  // Cargar propiedades cuando se autentica
  useEffect(() => {
    if (isAuthenticated) {
      fetchProperties();
    }
  }, [isAuthenticated, fetchProperties]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (login(loginPassword)) {
      setMessage({ type: "success", text: "Acceso autorizado" });
    } else {
      setMessage({ type: "error", text: "Contraseña incorrecta" });
    }
  };

  const handleDeleteProperty = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar esta propiedad? Esta acción no se puede deshacer.")) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/admin/properties/${id}`, {
        method: "DELETE",
        headers: {
          "x-admin-password": password,
        },
      });

      if (response.ok) {
        setMessage({ type: "success", text: "Propiedad eliminada exitosamente" });
        fetchProperties(); // Recargar lista
      } else {
        const data = await response.json();
        setMessage({ type: "error", text: data.error || "Error al eliminar" });
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage({ type: "error", text: "Error de conexión" });
    } finally {
      setLoading(false);
    }
  };

  const filteredProperties = properties.filter((prop) => {
    const matchesSearch =
      searchTerm === "" ||
      prop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prop.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Pantalla de login
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4 sm:p-6">
        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 md:p-10 w-full max-w-md transform transition-all">
          {/* Header con logo/icono */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl shadow-lg mb-4 transform hover:scale-105 transition-transform">
              <svg
                className="w-8 h-8 sm:w-10 sm:h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Panel de Administración
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Gestión  Prohausen
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Contraseña de Acceso
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full px-4 py-3 sm:py-3.5 pr-12 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 placeholder-gray-400"
                  placeholder="Ingresa tu contraseña"
                  required
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Mensajes */}
            {message && (
              <div
                className={`p-4 rounded-xl border-2 flex items-start gap-3 animate-in slide-in-from-top-2 ${
                  message.type === "error"
                    ? "bg-red-50 border-red-200 text-red-800"
                    : "bg-green-50 border-green-200 text-green-800"
                }`}
              >
                {message.type === "error" ? (
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
                <span className="text-sm font-medium">{message.text}</span>
              </div>
            )}

            {/* Botón de submit */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 sm:py-3.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 focus:ring-4 focus:ring-blue-300"
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Ingresar al Panel
              </span>
            </button>
          </form>

          {/* Footer informativo */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-center text-gray-500">
              🔒 Acceso restringido solo para administradores
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Panel de administración
  return (
    <>
      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pt-32 sm:pt-45">
        {/* Header de la página */}
        <div className="mb-18">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-12">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
                Gestión de Propiedades
              </h1>
              <p className="text-base sm:text-lg text-gray-600">
                Panel de administración - CRUD completo
              </p>
            </div>
            <button
              onClick={logout}
              className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-md hover:shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Cerrar sesión
            </button>
          </div>
          <div className="h-1 w-32 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full"></div>
        </div>
        
        {/* Mensajes */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-xl border-2 flex items-start gap-3 animate-in slide-in-from-top-2 ${
              message.type === "success"
                ? "bg-green-50 border-green-200 text-green-900"
                : message.type === "error"
                ? "bg-red-50 border-red-200 text-red-900"
                : "bg-blue-50 border-blue-200 text-blue-900"
            }`}
          >
            {message.type === "success" ? (
              <svg className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : message.type === "error" ? (
              <svg className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 mt-0.5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            <p className="text-sm sm:text-base font-medium flex-1">{message.text}</p>
          </div>
        )}

        {/* Estadísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Propiedades</p>
                <p className="text-2xl font-bold text-gray-900">{properties.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Destacadas</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {properties.filter((p) => p.featured).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Activas</p>
                <p className="text-2xl font-bold text-green-600">
                  {properties.filter((p) => p.active).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros y búsqueda */}
        <div className="bg-white rounded-xl shadow-md p-5 mb-6 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Búsqueda */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Título o ubicación..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Filtro Estado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
              <select
                value={String(filterActive)}
                onChange={(e) => {
                  const val = e.target.value;
                  setFilterActive(val === "all" ? "all" : val === "true");
                  fetchProperties();
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todas</option>
                <option value="true">Activas</option>
                <option value="false">Inactivas</option>
              </select>
            </div>

            {/* Filtro Destacadas */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Destacadas
              </label>
              <select
                value={String(filterFeatured)}
                onChange={(e) => {
                  const val = e.target.value;
                  setFilterFeatured(val === "all" ? "all" : val === "true");
                  fetchProperties();
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todas</option>
                <option value="true">Sí</option>
                <option value="false">No</option>
              </select>
            </div>
          </div>
        </div>

        {/* Botón crear nueva */}
        <div className="mb-6">
          <button
            onClick={() => window.location.href = "/admin/properties/new"}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Crear Nueva Propiedad
          </button>
        </div>

        {/* Tabla de propiedades */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          {loading ? (
            <div className="p-12 text-center">
              <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-gray-600">Cargando propiedades...</p>
            </div>
          ) : filteredProperties.length === 0 ? (
            <div className="p-12 text-center">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <p className="text-gray-600 mb-2">No hay propiedades para mostrar</p>
              <p className="text-sm text-gray-500">Crea tu primera propiedad usando el botón de arriba</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Propiedad
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Precio
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProperties.map((property) => (
                    <tr key={property.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12 relative">
                            <Image
                              className="rounded-lg object-cover"
                              src={property.image || "/placeholder.jpg"}
                              alt={property.title}
                              fill
                              sizes="48px"
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {property.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              {property.location}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          {property.price}
                        </div>
                        <div className="text-xs text-gray-500">
                          {property.operation}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {property.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          {property.active ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Activa
                            </span>
                          ) : (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                              Inactiva
                            </span>
                          )}
                          {property.featured && (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                              ⭐ Destacada
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => window.open(getPropertyUrl(property.id, property.slug), "_blank")}
                            className="text-blue-600 hover:text-blue-900"
                            title="Ver propiedad"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => window.location.href = `/admin/properties/${property.id}/edit`}
                            className="text-green-600 hover:text-green-900"
                            title="Editar propiedad"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteProperty(property.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Eliminar propiedad"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
