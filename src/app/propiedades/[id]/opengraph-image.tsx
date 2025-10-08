import { ImageResponse } from 'next/og'
 
export const runtime = 'edge'
export const alt = 'Propiedad - Prohausen'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'
 
export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  // Obtener la propiedad desde la API
  try {
    const { id } = await params
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/property/${id}`, {
      next: { revalidate: 60 }
    })
    const data = await response.json()
    
    if (!data.success || !data.property) {
      return new ImageResponse(
        (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#1f2937',
              color: 'white',
              fontSize: 48,
              fontWeight: 'bold',
            }}
          >
            Propiedad no encontrada
          </div>
        ),
        {
          ...size,
        }
      )
    }

    const property = data.property

    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#ffffff',
            padding: 40,
          }}
        >
          {/* Header con logo */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: 40,
            }}
          >
            <div
              style={{
                fontSize: 32,
                fontWeight: 'bold',
                color: '#1f2937',
              }}
            >
              Prohausen Propiedades
            </div>
          </div>

          {/* Contenido principal */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 20,
              flex: 1,
            }}
          >
            <div
              style={{
                fontSize: 56,
                fontWeight: 'bold',
                color: '#1f2937',
                lineHeight: 1.2,
              }}
            >
              {property.title}
            </div>

            <div
              style={{
                fontSize: 48,
                fontWeight: 'bold',
                color: '#059669',
              }}
            >
              {property.price}
            </div>

            <div
              style={{
                fontSize: 28,
                color: '#6b7280',
                display: 'flex',
                gap: 20,
              }}
            >
              <span>📍 {property.location}</span>
              <span>🛏️ {property.bedrooms} hab</span>
              <span>🚿 {property.bathrooms} baños</span>
              <span>📐 {property.area} m²</span>
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 40,
              borderTop: '2px solid #e5e7eb',
              paddingTop: 20,
            }}
          >
            <div
              style={{
                fontSize: 24,
                color: '#6b7280',
              }}
            >
              www.prohausen.cl
            </div>
            <div
              style={{
                fontSize: 24,
                color: '#6b7280',
              }}
            >
              +56 9 4045 4965
            </div>
          </div>
        </div>
      ),
      {
        ...size,
      }
    )
  } catch {
    // Si hay error, mostrar imagen de fallback
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#1f2937',
            color: 'white',
            fontSize: 48,
            fontWeight: 'bold',
          }}
        >
          Prohausen Propiedades
        </div>
      ),
      {
        ...size,
      }
    )
  }
}
