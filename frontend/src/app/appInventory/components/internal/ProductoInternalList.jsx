import React, { useEffect } from 'react';

export default function ProductoInternalList({ productos, id_proveedor }) {
  useEffect(() => {
    console.log("productos  produto intal list.:", productos);
  }, [productos, id_proveedor]);

  if (!productos || productos.length === 0) {
    return <p className="text-gray-500">No hay productos para mostrar.</p>;
  }

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        Productos para el proveedor #{id_proveedor}
      </h3>
      <ul className="bg-white shadow rounded p-4 divide-y divide-gray-200 max-h-64 overflow-y-auto">
        {productos.map((item, index) => (
          <li key={index} className="py-2 text-sm text-gray-700">
            {Object.entries(item).map(([key, value]) => {
              if (key === 'precios_nuevos' && typeof value === 'object' && value !== null) {
                return (
                  <div key={key} className="mb-1">
                    <strong>{key}:</strong>{" "}
                    <span>Precio Compra Unitario: ${value._precio_compra_unitario}</span>
                  </div>
                );
              }
              return (
                <div key={key} className="mb-1">
                  <strong>{key}:</strong> {String(value)}
                </div>
              );
            })}
          </li>
        ))}
      </ul>
    </div>
  );
}
