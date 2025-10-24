"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";

interface AuthContextType {
  isAuthenticated: boolean;
  password: string;
  login: (pwd: string) => boolean;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_PASSWORD_KEY = "adminPassword";
const AUTH_EXPIRY_KEY = "authExpiry";
const AUTH_DURATION = 24 * 60 * 60 * 1000; // 24 horas en milisegundos

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Verificar autenticación al cargar
  useEffect(() => {
    const checkAuth = () => {
      if (typeof window === "undefined") return;

      try {
        const storedPassword = localStorage.getItem(ADMIN_PASSWORD_KEY);
        const authExpiry = localStorage.getItem(AUTH_EXPIRY_KEY);

        if (storedPassword && authExpiry) {
          const expiryTime = parseInt(authExpiry, 10);
          const now = Date.now();

          // Si no ha expirado y la contraseña es correcta
          if (now < expiryTime) {
            const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin2024";
            if (storedPassword === adminPassword) {
              setPassword(storedPassword);
              setIsAuthenticated(true);
              setLoading(false);
              return;
            }
          }

          // Si llegamos aquí, la sesión expiró o es inválida
          localStorage.removeItem(ADMIN_PASSWORD_KEY);
          localStorage.removeItem(AUTH_EXPIRY_KEY);
        }

        setIsAuthenticated(false);
        setPassword("");
      } catch (error) {
        console.error("Error al verificar autenticación:", error);
        setIsAuthenticated(false);
        setPassword("");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Redirigir si no está autenticado en rutas protegidas
  useEffect(() => {
    if (!loading && !isAuthenticated && pathname?.startsWith("/admin/properties")) {
      if (pathname !== "/admin/properties") {
        router.push("/admin/properties");
      }
    }
  }, [isAuthenticated, loading, pathname, router]);

  const login = (pwd: string): boolean => {
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin2024";
    
    if (pwd === adminPassword) {
      const expiryTime = Date.now() + AUTH_DURATION;
      
      localStorage.setItem(ADMIN_PASSWORD_KEY, pwd);
      localStorage.setItem(AUTH_EXPIRY_KEY, expiryTime.toString());
      
      setPassword(pwd);
      setIsAuthenticated(true);
      return true;
    }
    
    return false;
  };

  const logout = () => {
    localStorage.removeItem(ADMIN_PASSWORD_KEY);
    localStorage.removeItem(AUTH_EXPIRY_KEY);
    
    setPassword("");
    setIsAuthenticated(false);
    router.push("/admin/properties");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, password, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
