"use client"
import React, {useContext}  from "react";
import ProductCard from "./ProductCard";
import { ProductContext } from "@/context/ProductContext"; 

export default function ProductList() {
  const { products: productos, loading, error } = useContext(ProductContext);
  if (loading) {
    return <p>Cargando productos...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!productos || productos.length === 0) {
    return <p>No hay productos disponibles.</p>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-4">Lista de Productos</h2>
        <ul className="divide-y divide-gray-200">
          {productos.map((producto) => (
            <ProductCard key={producto.id} producto={producto} />
          ))}
        </ul>
      </div>
    </div>
  );
}