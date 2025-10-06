"use client";

import { useState } from "react";

export default function AdminCachePage() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error" | "info";
    text: string;
  } | null>(null);
  const [cacheInfo, setCacheInfo] = useState<{
    lastUpdate?: string;
    propertiesCount?: number;
  } | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin2024";
    
    if (password === adminPassword) {
      setIsAuthenticated(true);
      setMessage({ type: "success", text: "Acceso autorizado" });
      fetchCacheInfo();
    } else {
      setMessage({ type: "error", text: "Contraseña incorrecta" });
    }
  };

  const fetchCacheInfo = async () => {
    try {
      const response = await fetch("/api/admin/cache-info");
      if (response.ok) {
        const data = await response.json();
        setCacheInfo(data);
      }
    } catch (error) {
      console.error("Error fetching cache info:", error);
    }
  };

  const handleRefreshCache = async () => {
    setLoading(true);
    setMessage({ type: "info", text: "Actualizando caché..." });

    try {
      const response = await fetch("/api/admin/refresh-cache", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: "success",
          text: `✅ Caché actualizado exitosamente. ${data.propertiesCount} propiedades procesadas.`,
        });
        fetchCacheInfo();
      } else {
        setMessage({
          type: "error",
          text: data.error || "Error al actualizar caché",
        });
      }
    } catch {
      setMessage({
        type: "error",
        text: "Error de conexión. Intenta nuevamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Pantalla de login
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-6">
            <div className="inline-block p-3 bg-blue-100 rounded-full mb-4">
              <svg
                className="w-12 h-12 text-blue-600"
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
            <h1 className="text-2xl font-bold text-gray-900">
              Panel de Administración
            </h1>
            <p className="text-gray-600 mt-2">Control de Caché</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Contraseña de Acceso
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ingresa la contraseña"
                required
              />
            </div>

            {message && (
              <div
                className={`p-3 rounded-lg ${
                  message.type === "error"
                    ? "bg-red-100 text-red-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {message.text}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Ingresar
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Panel de administración
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                🔐 Panel de Control de Caché
              </h1>
              <p className="text-gray-600 mt-2">
                Gestión de actualización de propiedades
              </p>
            </div>
            <button
              onClick={() => {
                setIsAuthenticated(false);
                setPassword("");
                setMessage(null);
              }}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Cerrar sesión
            </button>
          </div>
        </div>

        {/* Estado del Caché */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            📊 Estado del Caché
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Última Actualización</p>
              <p className="text-lg font-semibold text-blue-900 mt-1">
                {cacheInfo?.lastUpdate
                  ? new Date(cacheInfo.lastUpdate).toLocaleString("es-CL")
                  : "No disponible"}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Propiedades en Caché</p>
              <p className="text-lg font-semibold text-green-900 mt-1">
                {cacheInfo?.propertiesCount || "—"}
              </p>
            </div>
          </div>
        </div>

        {/* Botón Principal */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            🔄 Actualizar Caché
          </h2>
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <p className="text-sm text-gray-700">
              <strong>¿Cuándo usar este botón?</strong>
            </p>
            <ul className="list-disc list-inside text-sm text-gray-600 mt-2 space-y-1">
              <li>Después de crear nuevas propiedades en WordPress</li>
              <li>Cuando edites información de propiedades existentes</li>
              <li>Si eliminaste propiedades</li>
            </ul>
          </div>

          <button
            onClick={handleRefreshCache}
            disabled={loading}
            className={`w-full py-4 rounded-lg font-semibold text-white transition-all ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl"
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Procesando...
              </span>
            ) : (
              "🔄 REFLEJAR CAMBIOS"
            )}
          </button>

          {message && (
            <div
              className={`mt-4 p-4 rounded-lg ${
                message.type === "success"
                  ? "bg-green-100 text-green-800"
                  : message.type === "error"
                  ? "bg-red-100 text-red-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              <p className="font-medium">{message.text}</p>
            </div>
          )}
        </div>

        {/* Información */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">
            ℹ️ Información Importante
          </h3>
          <ul className="text-sm text-blue-800 space-y-2">
            <li>
              • El proceso toma aproximadamente 5-10 segundos
            </li>
            <li>
              • Los cambios serán visibles inmediatamente en el sitio web
            </li>
            <li>
              • Esta acción actualiza TODAS las propiedades
            </li>
            <li>
              • Solo usa este botón cuando hayas hecho cambios en WordPress
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
