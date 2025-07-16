"use client";
import React from 'react';

export default function ProductCard({ product }) {
  if (!product) {
    return <p>Producto no disponible</p>;
  }

  return (
    <div>
  
    <div className="flex flex-col md:flex-row gap-4 p-3 border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200">
      <div className="text-base text-gray-800 w-full md:w-1/5">Nombre del producto: {product.name}</div>
      <div className="text-base text-gray-800 w-full md:w-1/5">Precio general $ {product.price || "N/A"}</div>
      <div className="text-base text-gray-800 w-full md:w-3/5">Precio venta compra: ${product.price_cost|| "N/A"} </div>
      <div className="text-base text-gray-800 w-full md:w-3/5">Precio venta publico: ${product.sale}</div>
    </div>
     </div>
  );
}