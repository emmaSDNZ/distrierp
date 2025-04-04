"use client"
import React, { useContext } from 'react'
import { ProductContext } from '@/context/ProductContext'
import ProductCard from './ProductCard';
import Link from 'next/link';

export default function ProductsList() {
  const { products } = useContext(ProductContext);
  
  console.log("Products from Context:", products);
  if (!products || products.length === 0) {
    return <p>No se encontraron productos.</p>;
  }

  return (
    <div>
      {/* Encabezados de la tabla */}
      <div className="grid grid-cols-5 gap-4 p-3 border-b border-gray-200 font-semibold">
        <div>Nombre del producto</div>
        <div>Referencia interna</div>
        <div>Precio</div>
        <div>Coste</div>
        <div>Precio Venta</div>

      </div>

      {/* Datos de los productos */}
      {products.map((product) => (
        <Link key={product.id} href={`/inventory/products/${product.id}`}>
        <ProductCard key={product.id} product={product} />
        </Link>
      ))}
    </div>
  );
}