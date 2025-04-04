"use client";
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Layout from '../../components/Layout';
import ProductForm from '../../components/products/ProductForm';

export default function IdProducto() {
  const params = useParams();
  const { id_product } = params;
  const [product, setProduct] = useState(null);
  console.log('ID del producto:', id_product);

  useEffect(() => {
    if (id_product) {
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api_distrimed_inventario/productos/${id_product}/`)
        .then((res) => res.json())
        .then((data) => {
          console.log('Datos del producto:', data);
          setProduct(data);
        });
    }
  }, [id_product]);

  if (!product) {
    return (
      <Layout>
        <p>Cargando...</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-row gap-6 p-6">
        <div className="w-full">
          <ProductForm productToEdit={product} />
        </div>
      </div>
    </Layout>
  );
}


