"use client";
import React, { useEffect, useState } from "react";

export default function CategoryCard() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para obtener las categorías
  const getCategories = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api_distrimed_inventario/category/`
      );
      if (!res.ok) {
        throw new Error("No se pudo cargar las categorías.");
      }
      const data = await res.json();
      setCategories(data); // Guardamos las categorías en el estado
    } catch (error) {
      setError(error.message); // Guardamos el error en el estado
    } finally {
      setLoading(false); // Finaliza la carga, independientemente del resultado
    }
  };

  useEffect(() => {
    getCategories(); // Llamamos a la función cuando el componente se monta
  }, []);

  if (loading) return <p>Cargando categorías...</p>;
  if (error) return <div className="text-center text-red-500 py-4">Error: {error}</div>;

  return (
    <div>
      <h1 className="font-semibold text-2xl mb-4">Categorías</h1>
      {/* Mapeamos las categorías y las mostramos en un div */}
      {categories.map((category) => (
        <div
          key={category.id}
          className="flex items-center p-4 border-b border-gray-200 hover:bg-gray-100"
        >
          <div className="flex-grow">
            <div className="text-sm">{category.name}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
