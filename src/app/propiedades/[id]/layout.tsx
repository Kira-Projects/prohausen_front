import { Metadata } from 'next'

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  
  // Obtener la propiedad desde la API
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/property/${id}`, {
      next: { revalidate: 60 }
    })
    const data = await response.json()
    
    if (!data.success || !data.property) {
      return {
        title: 'Propiedad no encontrada',
        description: 'Esta propiedad no está disponible',
      }
    }

    const property = data.property
    const imageUrl = property.images?.[0] || `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/placeholder-property.svg`
    const currentUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/propiedades/${id}`

    return {
      title: `${property.title} - Prohausen Propiedades`,
      description: `${property.location} • ${property.price} • ${property.bedrooms} hab • ${property.bathrooms} baños • ${property.area} m²`,
      
      // Open Graph para WhatsApp, Facebook, LinkedIn
      openGraph: {
        title: property.title,
        description: `${property.location} • ${property.price}`,
        url: currentUrl,
        siteName: 'Prohausen Propiedades',
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: property.title,
          }
        ],
        locale: 'es_CL',
        type: 'website',
      },
      
      // Twitter Card
      twitter: {
        card: 'summary_large_image',
        title: property.title,
        description: `${property.location} • ${property.price}`,
        images: [imageUrl],
      },

      // Meta tags adicionales
      alternates: {
        canonical: currentUrl,
      },
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'Prohausen Propiedades',
      description: 'Encuentra tu propiedad ideal',
    }
  }
}

export default function PropertyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
