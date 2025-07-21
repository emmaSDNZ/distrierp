// src/app/appInventory/reports/movement/AuditProduct/AuditHistory.jsx
"use client";

import { useContext, useEffect, useState } from "react";
import { ApiProductContext } from "@/shared/context/ProductContext";
import EntityFilterAccion from "@/shared/components/entityAuditTrial/EntityFilterAccion";
import EntityList from "@/shared/components/entityAuditTrial/EntityList";
import HeaderList from "@/shared/components/enityList/HeaderList";

import { Box, Typography, CircularProgress } from '@mui/material';

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
    let url = new URL(base);

    if (accion) url.searchParams.append("accion", accion);
    if (name) url.searchParams.append("name", name);
    
    return url.toString();
  };

  const currentApiUrl = buildUrl(); 

  useEffect(() => {
    apiAuditListaGeneral(currentApiUrl);
  }, [currentApiUrl, apiAuditListaGeneral]);

  if (!auditLista) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress sx={{ color: 'primary.main' }} />
        <Typography variant="h6" color="text.secondary" sx={{ ml: 2 }}>Cargando registros de auditoría...</Typography>
      </Box>
    );
  }

  const fields = ["fecha_hora", "modelo", "registro_nombre", "registro_id", "accion"];
  const fieldLabels = {
    fecha_hora: "Fecha y Hora",
    modelo: "Modelo",
    registro_nombre: "Nombre del Registro",
    registro_id: "ID Registro",
    accion: "Acción",
  };

  return (
    <Box sx={{
      mx: 'auto',
      p: { xs: 2, sm: 3, md: 4 },
      maxWidth: 'lg',
    }}>
      {/* La cabecera dinámica */}
      <HeaderList
        title="Historial de Auditoría de Productos"
        onSearch={setName}
        nextUrl={nextUrl}
        prevUrl={prevUrl}
        onPageChange={apiAuditListaGeneral}
      />

      {/* Contenedor para el filtro de acción, con estilos Material-UI */}
      <Box sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: { xs: 2, sm: 3 }, // Espacio entre los filtros si hay más de uno
        mb: 3, // Margen inferior para separar de la lista
        // Ajustar px para que se alinee con el contenido del HeaderList si es necesario
        // px: { xs: 1, sm: 0 },
      }}>
        <EntityFilterAccion
          accion={accion}
          setAccion={setAccion}
        />
      </Box>

      {/* La lista de entidades (la tabla) */}
      <EntityList
        lista={auditLista}
        fields={fields}
        fieldLabels={fieldLabels}
        itemUrlFn={(item) => `/appInventory/reports/movement/AuditProduct/${item.id}`}
      />
    </Box>
  );
}

export default AuditHistory;