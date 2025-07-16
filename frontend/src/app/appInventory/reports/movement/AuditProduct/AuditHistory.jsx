"use client";

import { useContext, useEffect, useState } from "react";
import { ApiProductContext } from "@/shared/context/ProductContext";
import EntityFilterAccion from "@/shared/components/entityAuditTrial/EntityFilterAccion";
import EntityList from "@/shared/components/entityAuditTrial/EntityList";
import HeaderList from "@/shared/components/enityList/HeaderList";

function AuditHistory() {
  const {
    auditLista,
    apiAuditListaGeneral,
    nextUrl,
    prevUrl
  } = useContext(ApiProductContext);

  const [accion, setAccion] = useState("");
  const [name, setName] = useState("");

  const buildUrl = () => {
    const base = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api_distrimed_productos/audit/product/list`;
    let url = base;
    if (accion) url += `?accion=${accion}`;
    if (name) url += `${accion ? "&" : "?"}name=${name}`;
    return url;
  };

  const url = buildUrl(); // ✅ NECESARIO

  useEffect(() => {
    apiAuditListaGeneral(url);
  }, [accion, name]);

  if (!auditLista) return <p>Cargando registros...</p>;

  const fields = ["fecha_hora", "modelo", "registro_nombre", "registro_id", "accion"];
  const fieldLabels = {
    fecha_hora: "Fecha y Hora",
    modelo: "Modelo",
    registro_nombre: "Nombre del Registro",
    registro_id: "ID Registro",
    accion: "Acción",
  };

  return (
    <div className="container mx-auto p-4">
      <HeaderList
        title="Historial de Auditoría de Productos"
        onSearch={setName} 
        nextUrl={nextUrl}
        prevUrl={prevUrl}
        onPageChange={apiAuditListaGeneral}
      />
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-6">
        <EntityFilterAccion
          accion={accion}
          setAccion={setAccion}
        />
      </div>
      <EntityList
        lista={auditLista}
        fields={fields}
        fieldLabels={fieldLabels}
        itemUrlFn={(item) => `/appInventory/reports/movement/AuditProduct/${item.id}`}
      />
    </div>
  );
}

export default AuditHistory;
