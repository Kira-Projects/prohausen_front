import { NextRequest, NextResponse } from "next/server";
import { verifyUserCredentials } from "@/lib/db/users";
import { generateToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * POST /api/admin/auth/login
 * Endpoint para iniciar sesión
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validar campos requeridos
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email y contraseña son requeridos" },
        { status: 400 }
      );
    }

    // Verificar credenciales
    const user = await verifyUserCredentials(email, password);
    
    if (!user) {
      return NextResponse.json(
        { error: "Credenciales incorrectas" },
        { status: 401 }
      );
    }

    // Generar token de sesión
    const token = generateToken();

    // Retornar datos del usuario y token
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("❌ Error en login:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Error al iniciar sesión",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
