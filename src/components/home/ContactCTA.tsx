import Link from "next/link";

export default function ContactCTA() {
  return (
    <section className="py-16 bg-gradient-to-r from-blue-900 to-blue-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Contáctanos</h2>
        <p className="text-xl mb-8">Agenda tu reunión aquí</p>
        <Link
          href="/contacto"
          className="inline-block bg-white text-blue-900 px-8 py-3 rounded-md hover:bg-gray-100 transition-colors font-medium text-lg"
        >
          Agendar Reunión
        </Link>
      </div>
    </section>
  );
}

