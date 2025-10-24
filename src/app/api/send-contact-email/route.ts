import { NextRequest, NextResponse } from "next/server";

// Forzar dynamic rendering
export const dynamic = "force-dynamic";

/**
 * API Endpoint para enviar emails de contacto
 * POST /api/send-contact-email
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nombre, telefono, email, comentario } = body;

    // Validar campos requeridos
    if (!nombre || !telefono || !email || !comentario) {
      return NextResponse.json(
        { error: "Todos los campos son requeridos" },
        { status: 400 }
      );
    }

    // Generar HTML minimalista para el email
    const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 0;
            background-color: #f5f5f5;
        }
        .container {
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .header {
            background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
            color: white;
            padding: 30px 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
        }
        .header p {
            margin: 8px 0 0 0;
            font-size: 14px;
            opacity: 0.9;
        }
        .content {
            padding: 30px 20px;
        }
        .field {
            margin-bottom: 24px;
            padding: 16px;
            background: #f9fafb;
            border-left: 4px solid #1e3a8a;
            border-radius: 4px;
        }
        .label {
            font-weight: 600;
            color: #1e3a8a;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 6px;
        }
        .value {
            color: #333;
            font-size: 15px;
            word-wrap: break-word;
        }
        .footer {
            padding: 20px;
            text-align: center;
            background: #f9fafb;
            border-top: 1px solid #e5e7eb;
            font-size: 12px;
            color: #6b7280;
        }
        .emoji {
            font-size: 18px;
            margin-right: 8px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📧 Nuevo Mensaje de Contacto</h1>
            <p>Prohausen - Propiedades</p>
        </div>
        <div class="content">
            <div class="field">
                <div class="label"><span class="emoji">👤</span>Nombre</div>
                <div class="value">${nombre}</div>
            </div>
            <div class="field">
                <div class="label"><span class="emoji">📱</span>Teléfono</div>
                <div class="value">${telefono}</div>
            </div>
            <div class="field">
                <div class="label"><span class="emoji">📧</span>Email</div>
                <div class="value"><a href="mailto:${email}" style="color: #1e3a8a; text-decoration: none;">${email}</a></div>
            </div>
            <div class="field">
                <div class="label"><span class="emoji">💬</span>Comentario</div>
                <div class="value">${comentario}</div>
            </div>
        </div>
        <div class="footer">
            <p>Este mensaje fue enviado desde el formulario de contacto de <strong>prohausen.cl</strong></p>
            <p style="margin-top: 8px;">${new Date().toLocaleString("es-CL", {
              dateStyle: "full",
              timeStyle: "short",
            })}</p>
        </div>
    </div>
</body>
</html>
    `.trim();

    // Enviar email a la API externa
    const emailResponse = await fetch(
      "https://mails-api.kiracloud.dev/api/email/simple",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: "contacto@prohausen.cl",
          subject: `[Prohausen] Nuevo mensaje de contacto - ${nombre}`,
          content: htmlContent,
          from: "no-reply",
        }),
      }
    );

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      console.error("Error al enviar email:", errorText);
      throw new Error(`Error de la API de emails: ${emailResponse.status}`);
    }

    return NextResponse.json({
      success: true,
      message: "Email enviado exitosamente",
    });
  } catch (error) {
    console.error("❌ Error al enviar email:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Error al enviar el email",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * Método GET para verificar que el endpoint está activo
 */
export async function GET() {
  return NextResponse.json({
    message: "Contact email endpoint",
    status: "ready",
    usage: "POST with { nombre, telefono, email, comentario }",
  });
}
