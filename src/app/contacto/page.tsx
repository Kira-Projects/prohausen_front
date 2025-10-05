"use client";

import { useState } from "react";

export default function ContactoPage() {
  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    email: "",
    rentaPromedio: "",
    complementaRenta: "no",
    rentaCodeudor: "",
    comentario: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Aquí se implementará la integración con el backend
    setTimeout(() => {
      setSubmitMessage("¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.");
      setIsSubmitting(false);
      setFormData({
        nombre: "",
        telefono: "",
        email: "",
        rentaPromedio: "",
        complementaRenta: "no",
        rentaCodeudor: "",
        comentario: "",
      });
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <main className="min-h-screen pt-24 pb-12">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contáctanos</h1>
          <p className="text-xl">Agenda tu reunión aquí</p>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Formulario */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Envíanos un mensaje</h2>
              
              {submitMessage && (
                <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-md">
                  {submitMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="nombre" className="block text-sm font-medium mb-2 text-gray-700">
                    Nombre <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tu nombre completo"
                  />
                </div>

                <div>
                  <label htmlFor="telefono" className="block text-sm font-medium mb-2 text-gray-700">
                    Teléfono <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="telefono"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+56 9 1234 5678"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-700">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="tu@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="rentaPromedio" className="block text-sm font-medium mb-2 text-gray-700">
                    Renta Promedio
                  </label>
                  <input
                    type="text"
                    id="rentaPromedio"
                    name="rentaPromedio"
                    value={formData.rentaPromedio}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="$1.000.000"
                  />
                </div>

                <div>
                  <label htmlFor="complementaRenta" className="block text-sm font-medium mb-2 text-gray-700">
                    ¿Complementas renta?
                  </label>
                  <select
                    id="complementaRenta"
                    name="complementaRenta"
                    value={formData.complementaRenta}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="no">No</option>
                    <option value="si">Sí</option>
                  </select>
                </div>

                {formData.complementaRenta === "si" && (
                  <div>
                    <label htmlFor="rentaCodeudor" className="block text-sm font-medium mb-2 text-gray-700">
                      Renta Promedio Codeudor
                    </label>
                    <input
                      type="text"
                      id="rentaCodeudor"
                      name="rentaCodeudor"
                      value={formData.rentaCodeudor}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="$500.000"
                    />
                  </div>
                )}

                <div>
                  <label htmlFor="comentario" className="block text-sm font-medium mb-2 text-gray-700">
                    Comentario <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="comentario"
                    name="comentario"
                    value={formData.comentario}
                    onChange={handleChange}
                    required
                    rows={4}
                    maxLength={180}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Cuéntanos qué necesitas..."
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {formData.comentario.length} / 180
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-900 text-white px-6 py-3 rounded-md hover:bg-blue-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Enviando..." : "Enviar mensaje"}
                </button>
              </form>
            </div>

            {/* Información de contacto */}
            <div>
              <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                <h2 className="text-2xl font-bold mb-6 text-gray-900">Información de Contacto</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-100 rounded-full p-3">
                      <svg className="w-6 h-6 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">Teléfono</h3>
                      <p className="text-gray-600">+56 9 4045 4965</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-blue-100 rounded-full p-3">
                      <svg className="w-6 h-6 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">Email</h3>
                      <p className="text-gray-600">contacto@prohausen.cl</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-blue-100 rounded-full p-3">
                      <svg className="w-6 h-6 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">Dirección</h3>
                      <p className="text-gray-600">Isidora Goyenechea 3000, Las Condes, Santiago</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-900 rounded-lg shadow-lg p-8 text-white">
                <h3 className="text-xl font-bold mb-4">Horario de Atención</h3>
                <div className="space-y-2">
                  <p>Lunes - Viernes: 9:00 - 18:00</p>
                  <p>Sábado: 10:00 - 14:00</p>
                  <p>Domingo: Cerrado</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

