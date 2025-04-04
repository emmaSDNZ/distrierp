import React from 'react';
import miImagen from "../../../../public/imagen/logo.png";
import Navbar from "./Navbar";
import Image from "next/image";

export default function Header() {
  return (
    <header className="flex justify-between items-center mb-12">
      <div className="flex items-center gap-4">
        <Image
          src={miImagen}
          alt="Logo"
          width={280} // Aumenta un poco más el ancho
          height={56}  // Aumenta un poco más la altura
          priority
        />
        <h1 className="text-2xl font-semibold text-gray-800 mt-1">Panel de Administración</h1>
      </div>
      <Navbar />
    </header>
  );
}