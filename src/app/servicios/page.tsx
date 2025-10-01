export default function ServiciosPage() {
  const services = [
    {
      title: "Venta",
      description:
        "Asesoría completa para la venta de tu propiedad con los mejores resultados del mercado.",
      icon: (
        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
      features: [
        "Tasación profesional de tu propiedad",
        "Estrategia de marketing personalizada",
        "Publicación en múltiples portales inmobiliarios",
        "Fotografía profesional incluida",
        "Asesoría legal durante todo el proceso",
        "Negociación y cierre de la operación",
      ],
    },
    {
      title: "Arriendo",
      description:
        "Encuentra el arriendo perfecto para ti o arrienda tu propiedad con total seguridad.",
      icon: (
        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
          />
        </svg>
      ),
      features: [
        "Búsqueda personalizada de propiedades",
        "Verificación de antecedentes de arrendatarios",
        "Contratos de arriendo con respaldo legal",
        "Inspección detallada de la propiedad",
        "Gestión de garantías y seguros",
        "Soporte continuo durante el arriendo",
      ],
    },
    {
      title: "Administración",
      description: "Administramos tu propiedad de forma profesional y transparente.",
      icon: (
        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
      features: [
        "Cobro mensual de arriendos",
        "Pago de gastos comunes y servicios",
        "Coordinación de mantenciones y reparaciones",
        "Informes mensuales detallados",
        "Atención a inquilinos 24/7",
        "Renovación de contratos",
      ],
    },
  ];

  return (
    <main className="min-h-screen pt-24 pb-12">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Nuestros Servicios</h1>
          <p className="text-xl">Soluciones inmobiliarias integrales para ti</p>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {services.map((service, index) => (
              <div
                key={index}
                className={`flex flex-col ${
                  index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                } gap-8 items-center bg-white rounded-lg shadow-lg p-8`}
              >
                {/* Icono y título */}
                <div className="lg:w-1/2">
                  <div className="flex justify-center lg:justify-start text-blue-900 mb-6">
                    {service.icon}
                  </div>
                  <h2 className="text-3xl font-bold mb-4 text-gray-900 text-center lg:text-left">
                    {service.title}
                  </h2>
                  <p className="text-gray-600 text-lg mb-6 text-center lg:text-left">
                    {service.description}
                  </p>
                </div>

                {/* Features */}
                <div className="lg:w-1/2">
                  <ul className="space-y-3">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <svg
                          className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">¿Listo para comenzar?</h2>
          <p className="text-xl mb-8">
            Contáctanos y descubre cómo podemos ayudarte con tus necesidades inmobiliarias
          </p>
          <a
            href="/contacto"
            className="inline-block bg-white text-blue-900 px-8 py-3 rounded-md hover:bg-gray-100 transition-colors font-medium text-lg"
          >
            Contactar ahora
          </a>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            ¿Por qué elegirnos?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-10 h-10 text-blue-900"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">+10 Años de Experiencia</h3>
              <p className="text-gray-600">
                Amplia trayectoria en el mercado inmobiliario chileno
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-10 h-10 text-blue-900"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">Atención Personalizada</h3>
              <p className="text-gray-600">
                Cada cliente es único y recibe un servicio a medida
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-10 h-10 text-blue-900"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">Transparencia Total</h3>
              <p className="text-gray-600">
                Procesos claros y comunicación constante en cada etapa
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

