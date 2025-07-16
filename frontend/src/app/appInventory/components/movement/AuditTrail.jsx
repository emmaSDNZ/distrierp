import Link from 'next/link'
import React, { useEffect, useState } from 'react'

export default function AuditTrail({ productDetail }) {
  const [auditData, setAuditData] = useState({ results: [] })
  const [visibleFields, setVisibleFields] = useState(["accion", "fecha_hora"])
  const [fieldLabels, setFieldLabels] = useState({
    accion: "Acción",
    fecha_hora: "Fecha"
  })

  useEffect(() => {
    const dataAudit = async () => {
      if (productDetail?.id) {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api_distrimed_productos/audit/product/list/?registro_id=${productDetail.id}`
          )
          const data = await response.json()
          setAuditData(data)
        } catch (error) {
          console.error("Error al obtener los datos de auditoría:", error)
        }
      }
    }
    dataAudit()
  }, [productDetail])

  return (
    <div>
      <h2>Producto ID: {productDetail?.id}</h2>
      <h2>Total de registros auditados: {auditData?.count || "N/A"}</h2>

      {/* Cabecera con los campos seleccionados */}
      <div className="flex flex-wrap gap-4 border-b pb-2">
        {visibleFields.map((field) => (
          <div
            key={field}
            className="text-sm font-semibold text-gray-700 w-full md:w-1/5"
          >
            {fieldLabels[field] || field}
          </div>
        ))}
      </div>

      {/* Lista de auditoría (estilo igual al de productsList) */}
      <div className="space-y-2 mt-2">
        {auditData.results && auditData.results.length > 0 ? (
          auditData.results.map((item) => (
            <Link
              key={item.id}
              href={`/appInventory/reports/movement/AuditProduct/${item.id}`}
            >
              <div className="flex flex-wrap gap-4 py-2 hover:bg-gray-50">
                {visibleFields.map((field) => (
                  <div
                    key={field}
                    className="text-sm text-gray-600 w-full md:w-1/5"
                  >
                    {item[field]}
                  </div>
                ))}
              </div>
            </Link>
          ))
        ) : (
          <p className="text-gray-500 mt-4">No hay registros de auditoría.</p>
        )}
      </div>
    </div>
  )
}
