"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function AdminLoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Formulario de login
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  // Limpiar sesión al cargar la página de login
  useEffect(() => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    localStorage.removeItem("authExpiry");
  }, []);

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginForm),
      });

      const data = await response.json();

      if (response.ok) {
        // Guardar en localStorage con las mismas keys que AuthContext
        const expiryTime = Date.now() + (24 * 60 * 60 * 1000); // 24 horas
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("userData", JSON.stringify(data.user));
        localStorage.setItem("authExpiry", expiryTime.toString());
        
        // Forzar recarga para que AuthContext detecte la sesión
        window.location.href = "/admin/properties";
      } else {
        setError(data.error || "Credenciales inválidas");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div 
        className="min-h-screen flex items-center justify-center p-4 relative"
        style={{
          backgroundImage: 'url("/backgroun%20img.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          paddingTop: '7rem' // Espacio para el navbar fijo
        }}
      >
        {/* Overlay oscuro para mejorar legibilidad */}
        <div className="absolute inset-0 bg-black/50"></div>
        
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative z-10">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-gray-600 p-3 rounded-lg">
                <Image 
                  src="/LOGO-PH-SIN-FONDO-BLANCO-2.png" 
                  alt="Prohausen Logo" 
                  width={150}
                  height={64}
                  className="h-16 w-auto object-contain"
                  style={{ display: 'block' }}
                  priority
                  unoptimized
                />
              </div>
            </div>
            <h1 className="text-2xl font-bold mb-2">Prohausen Admin</h1>
            <p className="text-blue-100 text-sm">Inicia sesión para continuar</p>
          </div>

          {/* Form */}
          <div className="p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  id="login-email"
                  type="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="tu@email.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña
                </label>
                <input
                  id="login-password"
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
              </button>
            </form>
          </div>

          {/* Footer del formulario */}
          <div className="bg-gray-50 px-8 py-4 text-center text-sm text-gray-600">
            <p>Sistema de gestión de propiedades</p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
