"use client";
import React, { useState, useContext } from 'react';
import { ProductContext } from '@/context/ProductContext';
import { useRouter } from 'next/navigation';

function FormProducts() {
  const { addProduct } = useContext(ProductContext);
  const [nombre, setProductoNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    addProduct({ nombre: nombre, descripcion: descripcion });
    setProductoNombre('');
    setDescripcion('');
    router.refresh();
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md"
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="productName"
          >
            Nombre del Producto
          </label> 
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="productName"
            type="text"
            placeholder="Nombre del producto"
            value={nombre}
            onChange={(e) => setProductoNombre(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="description"
          >
            Descripción
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="description"
            placeholder="Descripción del producto"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
}

export default FormProducts;