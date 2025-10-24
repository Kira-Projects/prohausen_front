"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";

interface User {
  id: string;
  nombre: string;
  email: string;
  role: "admin" | "user";
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (user: User) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_TOKEN_KEY = "authToken";
const USER_DATA_KEY = "userData";
const AUTH_EXPIRY_KEY = "authExpiry";
const AUTH_DURATION = 24 * 60 * 60 * 1000; // 24 horas en milisegundos

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Verificar autenticación al cargar
  useEffect(() => {
    const checkAuth = () => {
      if (typeof window === "undefined") return;

      try {
        const token = localStorage.getItem(AUTH_TOKEN_KEY);
        const userData = localStorage.getItem(USER_DATA_KEY);
        const authExpiry = localStorage.getItem(AUTH_EXPIRY_KEY);

        if (token && userData && authExpiry) {
          const expiryTime = parseInt(authExpiry, 10);
          const now = Date.now();

          // Si no ha expirado
          if (now < expiryTime) {
            const parsedUser = JSON.parse(userData) as User;
            setUser(parsedUser);
            setIsAuthenticated(true);
            setLoading(false);
            return;
          }

          // Si llegamos aquí, la sesión expiró
          localStorage.removeItem(AUTH_TOKEN_KEY);
          localStorage.removeItem(USER_DATA_KEY);
          localStorage.removeItem(AUTH_EXPIRY_KEY);
        }

        setIsAuthenticated(false);
        setUser(null);
      } catch (error) {
        console.error("Error al verificar autenticación:", error);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Redirigir si no está autenticado en rutas protegidas
  useEffect(() => {
    if (!loading && !isAuthenticated && pathname?.startsWith("/admin/")) {
      // Permitir acceso a la página de login/registro
      if (pathname !== "/admin") {
        router.push("/admin");
      }
    }
  }, [isAuthenticated, loading, pathname, router]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        return false;
      }

      const expiryTime = Date.now() + AUTH_DURATION;
      
      // Guardar en localStorage
      localStorage.setItem(AUTH_TOKEN_KEY, data.token);
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(data.user));
      localStorage.setItem(AUTH_EXPIRY_KEY, expiryTime.toString());
      
      setUser(data.user);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error("Error en login:", error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(USER_DATA_KEY);
    localStorage.removeItem(AUTH_EXPIRY_KEY);
    
    setUser(null);
    setIsAuthenticated(false);
    router.push("/admin");
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, updateUser, loading }}>
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
