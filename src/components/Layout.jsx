// src/components/Layout.jsx
import React from "react";
import Link from "next/link";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col text-blue-900">
      {/* HEADER */}
      <header>
        {/* Franja azul con navegación */}
        <div className="bg-blue-800 text-white">
          <div className="container mx-auto p-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold">HIMETAL S.A.</h1>
            <nav className="space-x-6">
              <Link href="/" className="hover:underline">Cotización</Link>
              <Link href="/lista" className="hover:underline">Materiales</Link>
              <Link href="/sidersa" className="hover:underline">Precios Sidersa</Link>
              <Link href="/stock" className="hover:underline">Stock Diario</Link>
              <Link href="/trabajos" className="hover:underline">Trabajos</Link>
            </nav>
          </div>
        </div>
        {/* Banner con imagen de portada */}
        <div className="w-full h-52 overflow-hidden">
          <img
            src="/images/portada.jpg"
            alt="Portada HIMETAL S.A."
            className="w-full h-full object-cover"
          />
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="container mx-auto flex-1 p-6">
        {children}
      </main>

      {/* FOOTER */}
      <footer className="bg-gray-100 text-center py-4">
        © {new Date().getFullYear()} Himetal S.A. – Todos los derechos reservados
      </footer>
    </div>
  );
}
