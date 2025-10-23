import { NextRequest, NextResponse } from "next/server";

/**
 * Verifica si la contraseña proporcionada es correcta
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
 * Verifica el header "x-admin-password"
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
