'use client';
import React, { useEffect, useState } from 'react';

export default function ProductAttributeList() {
    const [atributos, setAtributos] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchAtributos = async () => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api_distrimed_inventario/product-attribute/`);
          if (!res.ok) throw new Error("Error al obtener los atributos de productos");
  
          const data = await res.json();
          setAtributos(data);
        } catch (err) {
          setError("No se pudo obtener los datos");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
  
      fetchAtributos();
    }, []);
  
    if (loading) return <p className="p-4">Cargando datos...</p>;
    if (error) return <p className="text-red-600 p-4">{error}</p>;
  
    return (
      <div className="p-4 space-y-4">
        <h1 className="text-2xl font-bold">Atributos de Productos</h1>
        {atributos.map((item) => (
          <div key={item.id} className="p-4 border rounded shadow">
            <h2 className="text-xl font-semibold">{item.product.nombre}</h2>
            <p className="text-sm text-gray-500">{item.product.descripcion}</p>
  
            <div className="mt-2">
              <p><strong>Referencia:</strong> {item.product.referencia}</p>
              <p><strong>Cód. Barras:</strong> {item.product.cod_barras}</p>
              <p><strong>Precio Venta:</strong> ${item.product.precio_venta.precio_venta}</p>
              <p><strong>Precio Coste:</strong> ${item.product.precio_coste.precio_coste}</p>
            </div>
  
            <div className="mt-4">
              <h3 className="font-medium">Atributos:</h3>
              {item.attribute_values.map((attr) => (
                <div key={attr.id} className="ml-4 mt-2">
                  <p className="font-semibold">{attr.name_attr.name_attr}</p>
                  <ul className="list-disc ml-6 text-sm text-gray-700">
                    {attr.values.map((val) => (
                      <li key={val.id}>{val.value}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }