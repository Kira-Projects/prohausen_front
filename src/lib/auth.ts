import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { getUserById } from "./db/users";

/**
 * Hashea una contraseña usando bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

/**
 * Compara una contraseña con su hash
 */
export async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

/**
 * Genera un token de sesión único
 */
export function generateToken(): string {
  return randomBytes(32).toString("hex");
}

/**
 * Verifica si la contraseña proporcionada es correcta (método antiguo - compatibilidad)
 */
export function verifyAdminPassword(password: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    throw new Error("ADMIN_PASSWORD no está configurado en las variables de entorno");
  }

  return password === adminPassword;
}

/**
 * Middleware para verificar autenticación en rutas del admin
 * Verifica el header "x-auth-token"
 */
export function withAuth<T = unknown>(
  handler: (req: NextRequest, context: T, userId: string) => Promise<NextResponse>
) {
  return async (req: NextRequest, context: T) => {
    try {
      // Obtener el token del header
      const token = req.headers.get("x-auth-token");

      if (!token) {
        return NextResponse.json(
          { error: "No autorizado. Token de autenticación requerido." },
          { status: 401 }
        );
      }

      // Aquí deberías verificar el token contra tu base de datos
      // Por ahora, usaremos el localStorage del frontend
      // En producción, considera usar JWT o una tabla de sesiones

      // Extraer userId del header (enviado por el frontend)
      const userId = req.headers.get("x-user-id");
      
      if (!userId) {
        return NextResponse.json(
          { error: "Usuario no identificado." },
          { status: 401 }
        );
      }

      // Si la autenticación es exitosa, ejecutar el handler
      return await handler(req, context, userId);
    } catch (error) {
      console.error("Error en autenticación:", error);
      return NextResponse.json(
        { error: "Error en la autenticación" },
        { status: 500 }
      );
    }
  };
}

/**
 * Middleware antiguo para compatibilidad con contraseña simple
 */
export function withAdminAuth<T = unknown>(
  handler: (req: NextRequest, context: T) => Promise<NextResponse>
) {
  return async (req: NextRequest, context: T) => {
    try {
      // Obtener la contraseña del header
      const password = req.headers.get("x-admin-password");

      if (!password) {
        return NextResponse.json(
          { error: "No autorizado. Falta la contraseña de administrador." },
          { status: 401 }
        );
      }

      // Verificar la contraseña
      if (!verifyAdminPassword(password)) {
        return NextResponse.json(
          { error: "Contraseña de administrador incorrecta." },
          { status: 403 }
        );
      }

      // Si la autenticación es exitosa, ejecutar el handler
      return await handler(req, context);
    } catch (error) {
      console.error("Error en autenticación:", error);
      return NextResponse.json(
        { error: "Error en la autenticación" },
        { status: 500 }
      );
    }
  };
}

/**
 * Extrae y verifica la contraseña del body de la request
 * Útil para requests POST/PUT/DELETE
 */
export async function verifyAdminPasswordFromBody(
  req: NextRequest
): Promise<{ authorized: boolean; error?: string }> {
  try {
    const body = await req.json();
    const password = body.password;

    if (!password) {
      return {
        authorized: false,
        error: "No autorizado. Falta la contraseña de administrador.",
      };
    }

    if (!verifyAdminPassword(password)) {
      return {
        authorized: false,
        error: "Contraseña de administrador incorrecta.",
      };
    }

    return { authorized: true };
  } catch (error) {
    console.error("Error al verificar contraseña:", error);
    return {
      authorized: false,
      error: "Error al procesar la autenticación",
    };
  }
}

/**
 * Middleware para verificar que el usuario autenticado tiene rol de administrador
 * Debe usarse después de withAuth
 */
export function withAdminRole<T = unknown>(
  handler: (req: NextRequest, context: T, userId: string) => Promise<NextResponse>
) {
  return async (req: NextRequest, context: T, userId: string) => {
    try {
      // Obtener información del usuario
      const user = await getUserById(userId);

      if (!user) {
        return NextResponse.json(
          { error: "Usuario no encontrado." },
          { status: 404 }
        );
      }

      // Verificar que el usuario tiene rol de administrador
      if (user.role !== "admin") {
        return NextResponse.json(
          { error: "Acceso denegado. Se requieren permisos de administrador." },
          { status: 403 }
        );
      }

      // Si el usuario es admin, ejecutar el handler
      return await handler(req, context, userId);
    } catch (error) {
      console.error("Error al verificar permisos de administrador:", error);
      return NextResponse.json(
        { error: "Error al verificar permisos" },
        { status: 500 }
      );
    }
  };
}
