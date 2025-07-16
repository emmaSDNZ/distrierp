"use client";
import VirtualizedList from '@/shared/components/VirtualizedList';
import React, { useContext } from 'react';
import { ApiUserContext } from '@/shared/context/UserContext';

export default function ContactosLIsta() {
  const { apiUsuariosProveedoresLista } = useContext(ApiUserContext);

  const fetchDataFn = async (queryOrUrl) => {
    try {
      const data = await apiUsuariosProveedoresLista(queryOrUrl);
      console.log("📦 Datos recibidos de la API:", data);
      return {
        data: data.results || [],
        next: data.next,
        previous: data.previous,
        count: data.count || 0,
      };
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      return {
        data: [],
        next: null,
        previous: null,
        count: 0,
      };
    }
  };

  return (
    <VirtualizedList
      fetchDataFn={fetchDataFn}
      fields={["nombre_proveedor"]} // ✅ Corrección aquí
      fieldLabels={{
        nombre_proveedor: "Nombre del proveedor",
      }}
      renderItem={(user, fields) => (
        <div className="flex flex-wrap gap-4 py-2 hover:bg-gray-50 h-full">
          {fields.map((field) => (
            <div key={field} className="text-sm text-gray-600 w-1/5">
              {user[field]}
            </div>
          ))}
        </div>
      )}
    />
  );
}
