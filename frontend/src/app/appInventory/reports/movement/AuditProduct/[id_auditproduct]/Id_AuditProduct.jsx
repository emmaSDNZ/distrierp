"use client"
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function Id_AuditProduct() {
  const params = useParams();
  const { id_auditproduct } = params;
  const [auditProductDetail, setAuditProductDetail] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api_distrimed_productos/audit/product/${id_auditproduct}/`
        );
        const data = await response.json();
        setAuditProductDetail(data || {});
      } catch (error) {
        console.log("Error en fetch:", error.message);
      }
    };

    if (id_auditproduct) {
      fetchDetail();
    }
  }, [id_auditproduct]);

  if (!auditProductDetail?.data) return <p className="text-gray-500">No hay detalles para mostrar.</p>;

  const detalle = auditProductDetail.data;
  const cambios = detalle.cambios || {};

  return (
    <div className="p-6 bg-white rounded-md shadow-md border border-gray-200 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">Detalle de Auditoría</h2>

      <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
        <p><span className="font-semibold text-gray-600">Modelo:</span> {detalle.modelo}</p>
        <p><span className="font-semibold text-gray-600">Registro ID:</span> {detalle.registro_id}</p>
        <p><span className="font-semibold text-gray-600">Nombre del Registro:</span> {detalle.registro_nombre}</p>
        <p><span className="font-semibold text-gray-600">Acción:</span> {detalle.accion}</p>
        <p><span className="font-semibold text-gray-600">Fecha y Hora:</span> {new Date(detalle.fecha_hora).toLocaleString()}</p>
      </div>

      <h3 className="text-lg font-semibold text-gray-700 mt-6 border-t pt-4">Cambios Realizados:</h3>
      <div className="divide-y divide-gray-200 bg-gray-50 rounded-md shadow-sm border border-gray-200">
        {Object.entries(cambios).map(([campo, valor], index) => (
          <div
            key={index}
            className="px-4 py-3 hover:bg-white transition-colors duration-200"
          >
            <p className="font-medium text-gray-800 capitalize mb-1">{campo.replace(/_/g, " ")}:</p>
            {typeof valor === "object" && valor !== null ? (
              <div className="ml-4 text-sm">
                <p><span className="font-semibold text-red-600">Antes:</span> {valor.antes ?? "—"}</p>
                <p><span className="font-semibold text-green-600">Después:</span> {valor.despues ?? "—"}</p>
              </div>
            ) : (
              <p className="ml-4 text-sm text-gray-700">{valor}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
