"use client";

import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { usePathname } from "next/navigation";

function AdminHeader() {
  const { isAuthenticated, user, logout } = useAuth();
  const pathname = usePathname();

  if (!isAuthenticated) return null;

  return (
    <header className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo y título */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">Prohausen Admin</h1>
            </div>
          </div>

          {/* Navegación */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/admin/properties"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === "/admin/properties" || pathname?.startsWith("/admin/properties/")
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              Propiedades
            </Link>
            {user?.role === "admin" && (
              <Link
                href="/admin/users"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === "/admin/users" || pathname?.startsWith("/admin/users/")
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                Usuarios
              </Link>
            )}
            <Link
              href="/admin/profile"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === "/admin/profile"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              Mi Perfil
            </Link>
          </nav>

          {/* Usuario y logout */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <div className="flex items-center justify-end gap-2">
                <p className="text-sm font-medium text-gray-900">
                  👋 Bienvenido, {user?.nombre}
                </p>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                  user?.role === "admin" 
                    ? "bg-purple-100 text-purple-700" 
                    : "bg-blue-100 text-blue-700"
                }`}>
                  {user?.role === "admin" ? "Administrador" : "Usuario"}
                </span>
              </div>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-sm font-medium transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Salir
            </button>
          </div>
        </div>

        {/* Navegación móvil */}
        <div className="md:hidden pb-3 pt-2 border-t border-gray-200 mt-2">
          <div className="flex gap-2">
            <Link
              href="/admin/properties"
              className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors text-center ${
                pathname === "/admin/properties" || pathname?.startsWith("/admin/properties/")
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Propiedades
            </Link>
            {user?.role === "admin" && (
              <Link
                href="/admin/users"
                className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors text-center ${
                  pathname === "/admin/users" || pathname?.startsWith("/admin/users/")
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Usuarios
              </Link>
            )}
            <Link
              href="/admin/profile"
              className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors text-center ${
                pathname === "/admin/profile"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Perfil
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <AdminHeader />
        {children}
      </div>
    </AuthProvider>
  );
}
