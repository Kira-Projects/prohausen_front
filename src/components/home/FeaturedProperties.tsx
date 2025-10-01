import PropertyCard from "@/components/properties/PropertyCard";

// Datos de ejemplo basados en el sitio original
const featuredProperties = [
  {
    id: 1,
    title: "Parcelas Bajo El Azul, Pupuya, Matanzas",
    location: "X4QC+3G Navidad, Chile",
    description: "Exclusivas parcelas de agrado ubicadas en un privilegiado sector de…",
    price: "1.690",
    area: "5700",
    type: "Parcela",
    operation: "Venta",
    region: "O'Higgins",
    comuna: "Navidad",
    featured: true,
    image: "/placeholder-property.jpg",
  },
  {
    id: 2,
    title: "Parcelas Punta Pupuya, Matanzas",
    location: "24F9+26 Navidad, Chile",
    description: "Condominio Punta Pupuya es un proyecto inmobiliario ubicado en primera…",
    price: "13.900",
    area: "5000",
    type: "Parcela",
    operation: "Venta",
    region: "O'Higgins",
    comuna: "Navidad",
    featured: true,
    image: "/placeholder-property.jpg",
  },
  {
    id: 3,
    title: "Dpto Manquehue Norte",
    location: "Av. Manquehue Nte. 2475, Vitacura",
    description: "Exclusivo y amplio departamento ubicado en un privilegiado sector de…",
    price: "16.900",
    bedrooms: 4,
    bathrooms: 4,
    area: "220",
    type: "Departamento",
    operation: "Venta",
    region: "Metropolitana",
    comuna: "Vitacura",
    featured: true,
    image: "/placeholder-property.jpg",
  },
  {
    id: 4,
    title: "Dpto I Proyecto Pocuro",
    location: "Av. Pocuro 2191, Providencia",
    description: "Exclusivos departamentos nuevos en venta, ubicados en calle Pocuro, comuna…",
    price: "12.190",
    bedrooms: 3,
    bathrooms: 3,
    area: "121",
    type: "Departamento",
    operation: "Venta",
    region: "Metropolitana",
    comuna: "Providencia",
    featured: true,
    image: "/placeholder-property.jpg",
  },
];

export default function FeaturedProperties() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Propiedades Destacadas</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {featuredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="/propiedades"
            className="inline-block bg-blue-900 text-white px-8 py-3 rounded-md hover:bg-blue-800 transition-colors font-medium"
          >
            Ver todas las propiedades
          </a>
        </div>
      </div>
    </section>
  );
}

