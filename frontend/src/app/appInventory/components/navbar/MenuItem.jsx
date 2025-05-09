import React from 'react'
import Link from 'next/link'; // Asegúrate de importar Link aquí


export default function MenuItem({ href, children, isTitle }) {

    const className = `block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${
        isTitle ? 'font-semibold text-gray-800 mt-2' : ''
      }`;
      if (href) {
        return (
          <Link href={href} className={className}>
            {children}
          </Link>
        );
      }
      return <div className={className}>{children}</div>;
}
