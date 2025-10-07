export default function ManualCompra() {
  return (
    <main className="min-h-screen">
      {/* Hero Section con imagen de fondo y título */}
      <section 
        className="relative text-white pt-32 sm:pt-40 lg:pt-48 pb-16 sm:pb-24 lg:pb-32 bg-cover bg-center bg-no-repeat min-h-[600px] sm:min-h-[650px] lg:min-h-[700px] overflow-hidden"
        style={{
          backgroundImage: "url('/backgroun img.jpg')",
        }}
      >
        {/* Overlay oscuro para mejorar la legibilidad del texto */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 px-4">
              Manual Paso a Paso
              <br />
              para obtener tu
              <br />
              Propiedad
            </h1>
          </div>
        </div>
      </section>

      {/* Contenido principal del manual */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8 sm:p-12">
            
            {/* Paso 1 */}
            <div className="mb-12">
              <div className="flex items-center mb-6">
                <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg mr-4">
                  1
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Definir tu objetivo y presupuesto
                </h2>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                Antes de comenzar a buscar una propiedad, es fundamental tener claridad sobre tus metas:
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-2xl mr-3">💭</span>
                  <span className="text-gray-700">¿Comprarás para vivir o invertir?</span>
                </li>
                <li className="flex items-start">
                  <span className="text-2xl mr-3">💰</span>
                  <span className="text-gray-700">Define tu presupuesto máximo y cuánto puedes pagar mensualmente.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-2xl mr-3">📈</span>
                  <span className="text-gray-700">Considera tus ingresos, ahorros y capacidad de endeudamiento.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-2xl mr-3">🔍</span>
                  <span className="text-gray-700"><strong>Tip:</strong> Usa simuladores hipotecarios para calcular cuánto banco te puede prestar según tu renta.</span>
                </li>
              </ul>
            </div>

            {/* Paso 2 */}
            <div className="mb-12">
              <div className="flex items-center mb-6">
                <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg mr-4">
                  2
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Revisar tu capacidad de crédito hipotecario
                </h2>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                Solicita una pre aprobación hipotecaria en diferentes bancos y mutuarias para conocer tus opciones:
              </p>
              <ul className="space-y-3 mb-6">
                <li className="text-gray-700">• Reúne documentación: liquidaciones de sueldo, certificado de cotizaciones, estado de deudas.</li>
                <li className="text-gray-700">• Consulta en 2 a 3 instituciones para comparar condiciones.</li>
                <li className="text-gray-700">• Conoce cuánto pie necesitas (generalmente 10%-20%) y qué tasa podrías obtener.</li>
              </ul>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                <p className="text-blue-800">
                  <span className="text-xl mr-2">📌</span>
                  <strong>Tener esta pre aprobación agiliza tu compra cuando encuentres la propiedad ideal.</strong>
                </p>
              </div>
            </div>

            {/* Paso 3 */}
            <div className="mb-12">
              <div className="flex items-center mb-6">
                <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg mr-4">
                  3
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Analizar el mercado y elegir comunas con alta plusvalía
                </h2>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                Busca zonas con alta demanda y proyección de crecimiento, ya que aseguran una mejor valorización de tu inversión:
              </p>
              <ul className="space-y-3 mb-6">
                <li className="text-gray-700">• Revisar datos de plusvalía histórica y futura.</li>
                <li className="text-gray-700">• Considerar conectividad, servicios, comercio, áreas verdes y desarrollo urbano.</li>
                <li className="text-gray-700">• Prioriza sectores emergentes bien conectados (metro, autopistas).</li>
              </ul>
              <div className="bg-green-50 border-l-4 border-green-500 p-4">
                <p className="text-green-800">
                  <span className="text-xl mr-2">🔍</span>
                  <strong>Tip:</strong> comunas en transformación suelen ofrecer precios más bajos y buena revalorización futura.
                </p>
              </div>
            </div>

            {/* Paso 4 */}
            <div className="mb-12">
              <div className="flex items-center mb-6">
                <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg mr-4">
                  4
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Buscar propiedades que se ajusten a tu perfil
                </h2>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                Con tu presupuesto y ubicación definida:
              </p>
              <ul className="space-y-3">
                <li className="text-gray-700">• Revisa portales inmobiliarios confiables.</li>
                <li className="text-gray-700">• Contáctate con corredores para acceder a oportunidades exclusivas.</li>
                <li className="text-gray-700">• Haz una lista de propiedades candidatas que cumplan con tus requisitos.</li>
              </ul>
            </div>

            {/* Paso 5 */}
            <div className="mb-12">
              <div className="flex items-center mb-6">
                <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg mr-4">
                  5
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Visitar y evaluar propiedades
                </h2>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                Durante las visitas, fíjate en:
              </p>
              <ul className="space-y-3 mb-6">
                <li className="text-gray-700">• Estado estructural y terminaciones.</li>
                <li className="text-gray-700">• Entorno (ruido, seguridad, comercio, transporte).</li>
                <li className="text-gray-700">• Gastos comunes y contribuciones.</li>
                <li className="text-gray-700">• Potencial de arriendo si es inversión.</li>
              </ul>
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
                <p className="text-yellow-800">
                  <span className="text-xl mr-2">📸</span>
                  Toma fotos y anota observaciones para comparar luego.
                </p>
              </div>
            </div>

            {/* Paso 6 */}
            <div className="mb-12">
              <div className="flex items-center mb-6">
                <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg mr-4">
                  6
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Hacer una oferta y negociar
                </h2>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                Cuando encuentres la propiedad ideal:
              </p>
              <ul className="space-y-3 mb-6">
                <li className="text-gray-700">• Haz una oferta formal por escrito.</li>
                <li className="text-gray-700">• Negocia precio, plazos y condiciones.</li>
                <li className="text-gray-700">• Firma una promesa de compraventa y paga la reserva.</li>
              </ul>
              <div className="bg-purple-50 border-l-4 border-purple-500 p-4">
                <p className="text-purple-800">
                  <span className="text-xl mr-2">💡</span>
                  Aquí puedes apoyarte en tu corredor para gestionar todo el proceso legal.
                </p>
              </div>
            </div>

            {/* Paso 7 */}
            <div className="mb-12">
              <div className="flex items-center mb-6">
                <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg mr-4">
                  7
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Gestionar el crédito hipotecario definitivo
                </h2>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                Con la promesa firmada:
              </p>
              <ul className="space-y-3">
                <li className="text-gray-700">• Presenta los documentos al banco elegido.</li>
                <li className="text-gray-700">• Coordina tasación y estudio de títulos.</li>
                <li className="text-gray-700">• Firma el crédito hipotecario ante notario.</li>
              </ul>
            </div>

            {/* Paso 8 */}
            <div className="mb-12">
              <div className="flex items-center mb-6">
                <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg mr-4">
                  8
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Firma de escritura y entrega de tu propiedad
                </h2>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="text-gray-700">• Firma la escritura de compraventa en notaría.</li>
                <li className="text-gray-700">• El banco inscribe la propiedad en el Conservador de Bienes Raíces.</li>
                <li className="text-gray-700">• Recibes las llaves y ¡ya eres propietario! 🗝️</li>
              </ul>
            </div>

            {/* Paso 9 */}
            <div className="mb-12">
              <div className="flex items-center mb-6">
                <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg mr-4">
                  9
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Postcompra: trámites y administración
                </h2>
              </div>
              <ul className="space-y-3">
                <li className="text-gray-700">• Cambiar suministros a tu nombre.</li>
                <li className="text-gray-700">• Contratar seguro complementarios, según preferencias.</li>
                <li className="text-gray-700">• Si es inversión: buscar arrendatarios y administrar arriendo.</li>
              </ul>
            </div>

            {/* Consejos finales */}
            <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-8 mb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="text-2xl mr-3">📝</span>
                Consejos finales
              </h3>
              <ul className="space-y-3 mb-6">
                <li className="text-gray-700">• Infórmate bien y compara opciones.</li>
                <li className="text-gray-700">• Rodéate de profesionales de confianza (corredor, ejecutivo hipotecario, abogado).</li>
                <li className="text-gray-700">• No tomes decisiones apresuradas: es una inversión a largo plazo.</li>
              </ul>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                ¿Listo para dar el gran paso? Obtener tu propiedad es más simple con una guía clara. 
                Sigue nuestro Manual Paso a Paso y transforma tu objetivo en una inversión segura.
              </p>
            </div>

            {/* Call to action */}
            <div className="bg-slate-600 text-white rounded-lg p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">
                ¡Estamos aquí para ayudarte a abrir la puerta de tu nuevo hogar!
              </h3>
              <p className="text-lg mb-6">
                Contáctanos hoy para una asesoría personalizada y comienza a construir tu patrimonio.
              </p>
              <div className="space-y-2">
                <p className="text-lg">
                  <strong>📧 contacto@prohausen.cl</strong>
                </p>
                <p className="text-lg">
                  O envíanos un mensaje directo a nuestras redes sociales
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
