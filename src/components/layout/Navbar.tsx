"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-[#505050] shadow-md fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-28">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image 
              src="/LOGO-PH-SIN-FONDO-BLANCO-2.png" 
              alt="Prohausen Propiedades" 
              width={220} 
              height={80}
              className="h-20 sm:h-24 w-auto"
              priority
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            <Link href="/" className="text-white hover:text-gray-300 font-medium transition-colors uppercase text-sm">
              Inicio
            </Link>
            <Link href="/propiedades" className="text-white hover:text-gray-300 font-medium transition-colors uppercase text-sm">
              Propiedades
            </Link>
            <Link href="/#servicios" className="text-white hover:text-gray-300 font-medium transition-colors uppercase text-sm">
              Nuestros Servicios
            </Link>
            <Link href="/#contacto" className="text-white hover:text-gray-300 font-medium transition-colors uppercase text-sm">
              Contacto
            </Link>
            <Link href="/manual-compra" className="text-white hover:text-gray-300 font-medium transition-colors uppercase text-sm">
              Manual de Compra
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-white hover:bg-gray-600"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-2">
              <Link
                href="/"
                className="text-white hover:text-gray-300 font-medium py-2 transition-colors uppercase text-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                Inicio
              </Link>
              <Link
                href="/propiedades"
                className="text-white hover:text-gray-300 font-medium py-2 transition-colors uppercase text-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                Propiedades
              </Link>
              <Link
                href="/#servicios"
                className="text-white hover:text-gray-300 font-medium py-2 transition-colors uppercase text-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                Nuestros Servicios
              </Link>
              <Link
                href="/#contacto"
                className="text-white hover:text-gray-300 font-medium py-2 transition-colors uppercase text-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                Contacto
              </Link>
              <Link
                href="/manual-compra"
                className="text-white hover:text-gray-300 font-medium py-2 transition-colors uppercase text-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                Manual de Compra
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

