"use client";

import { useState } from "react";

export default function ContactoSection() {
  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    email: "",
    comentario: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitError, setSubmitError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");
    setSubmitError("");
    
    try {
      const response = await fetch("/api/send-contact-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al enviar el mensaje");
      }

      // Éxito
      setSubmitMessage("¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.");
      setFormData({
        nombre: "",
        telefono: "",
        email: "",
        comentario: "",
      });
    } catch (error) {
      console.error("Error al enviar formulario:", error);
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Hubo un error al enviar tu mensaje. Por favor intenta nuevamente."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section id="contacto" className="pt-28 pb-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Contáctanos</h2>
          
          <a
            href="https://wa.me/56940454965?text=Hola,%20me%20gustaría%20agendar%20una%20reunión"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-[#2563EB] hover:bg-[#1E40AF] text-white px-8 py-4 rounded-md transition-colors font-bold uppercase text-sm shadow-lg hover:shadow-xl"
          >
            Agenda tu reunión aquí
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulario */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-2xl font-bold mb-6 text-gray-900">Envíanos un mensaje</h3>
              
            {submitMessage && (
              <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-md">
                {submitMessage}
              </div>
            )}

            {submitError && (
              <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-md">
                {submitError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Primera fila: Nombre, Teléfono, Email */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    placeholder="Nombre *"
                  />
                </div>

                <div>
                  <input
                    type="tel"
                    id="telefono"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    placeholder="Teléfono *"
                  />
                </div>

                <div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    placeholder="Email *"
                  />
                </div>
              </div>

              {/* Comentario */}
              <div>
                <textarea
                  id="comentario"
                  name="comentario"
                  value={formData.comentario}
                  onChange={handleChange}
                  required
                  rows={5}
                  maxLength={180}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900"
                  placeholder="Comentario *"
                />
                <p className="text-sm text-gray-500 mt-1 text-right">
                  {formData.comentario.length} / 180
                </p>
              </div>

              {/* Botón */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-900 hover:bg-blue-800 text-white px-8 py-3 rounded-md transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Enviando..." : "Enviar mensaje"}
                </button>
              </div>
            </form>
          </div>

          {/* Información de contacto */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4 text-gray-900">Información de Contacto</h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 rounded-full p-2">
                    <svg className="w-5 h-5 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Teléfono</p>
                    <p className="text-gray-600 text-sm">+56 9 4045 4965</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 rounded-full p-2">
                    <svg className="w-5 h-5 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Email</p>
                    <p className="text-gray-600 text-sm">contacto@prohausen.cl</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 rounded-full p-2">
                    <svg className="w-5 h-5 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Dirección</p>
                    <p className="text-gray-600 text-sm">Isidora Goyenechea 3000, Las Condes</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#707070] rounded-lg shadow-lg p-6 text-white">
              <h4 className="text-lg font-bold mb-3">Horario de Atención</h4>
              <div className="space-y-1 text-sm">
                <p>Lunes - Viernes: 9:00 - 18:00</p>
                <p>Sábado: 10:00 - 14:00</p>
                <p>Domingo: Cerrado</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
