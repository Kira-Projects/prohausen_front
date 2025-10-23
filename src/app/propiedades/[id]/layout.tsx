import { Metadata } from 'next'
import { getPropertyById } from '@/lib/db/properties'

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  
  // Obtener la propiedad directamente desde MongoDB Atlas
  try {
    const propertyId = parseInt(id, 10)
    const property = await getPropertyById(propertyId);

    if (!property) {
      return {
        title: 'Propiedad no encontrada',
        description: 'Esta propiedad no está disponible',
      }
    }
    const siteUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:3000';

    // Asegurarse que la imagen sea absoluta y pública
    let imageUrl = property.images?.[0] || property.image || `${siteUrl}/placeholder-property.svg`;
    if (imageUrl && !imageUrl.startsWith('http')) {
      imageUrl = `${siteUrl}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
    }
    const currentUrl = `${siteUrl}/propiedades/${id}`;

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
