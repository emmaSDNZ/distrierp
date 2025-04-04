import React from 'react'
import Image from 'next/image'
import miImagen from '/public/imagen/mi-imagen.png';
import Link from 'next/link';

export default function page() {
  return (
    <div className="relative h-screen w-screen">
      <Image
        src={miImagen}
        alt="Descripción"
        layout="fill"
        objectFit="cover"
      />
      <div className="absolute top-8 right-8"> {/* Ajusta la posición para el botón más grande */}
        <Link  href="/home">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-xl"> 
          Acceso
        </button>
        </Link>
      </div>
    </div>
  );
}
 