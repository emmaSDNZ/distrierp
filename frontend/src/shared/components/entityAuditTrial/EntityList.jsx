// src/shared/components/entityAuditTrial/EntityList.jsx
"use client";

import React from "react";
import { useRouter } from 'next/navigation'; // Importamos useRouter
import {
  Box,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from '@mui/material';

// Función auxiliar para obtener valores anidados
function getNestedValue(obj, path) {
  return path
    .replace(/\[(\d+)\]/g, ".$1")
    .split(".")
    .reduce((acc, part) => acc?.[part], obj);
}

// Función auxiliar para formatear valores
const formatValue = (value) => {
  if (value === null || value === undefined || value === "") {
    return "—";
  }
  if (typeof value === 'boolean') {
      return value ? 'Sí' : 'No';
  }
  if (typeof value === 'number') {
      if (Number.isInteger(value) && value.toString().length < 5) {
          return value.toString();
      }
      return value.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  }
  if (typeof value === 'string' && value.length > 50) {
    return `${value.substring(0, 50)}...`; 
  }
  return String(value);
};


export default function EntityList({ lista, fields, fieldLabels, itemUrlFn }) {
  const router = useRouter(); // Inicializamos el hook useRouter

  if (!lista || lista.length === 0) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '200px',
        color: 'text.secondary',
        fontSize: '1.1rem'
      }}>
        No hay elementos para mostrar.
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        px: 2,
        pt: 2,
        overflow: 'hidden',
      }}
    >
      <TableContainer component={Paper} sx={{ flex: 1, overflowY: 'auto', border: '1px solid', borderColor: 'divider' }}>
        <Table stickyHeader size="small">
          {/* Encabezado de la tabla (columnas) */}
          <TableHead>
            <TableRow>
              {fields.map((field) => (
                <TableCell
                  key={field}
                  sx={{
                    fontWeight: 'bold',
                    fontSize: '0.85rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    color: 'text.primary',
                    minWidth: '120px',
                    width: `${100 / fields.length}%`,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    px: 1,
                    py: 1,
                  }}
                >
                  {fieldLabels[field] || field.replace(/_/g, ' ')}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          {/* Cuerpo de la tabla (lista de items) */}
          <TableBody>
            {lista.map((item) => {
              const url = itemUrlFn ? itemUrlFn(item) : "#";
              const rowKey = item.id || item.id_producto_template || JSON.stringify(item);

              return (
                <TableRow
                  key={rowKey}
                  // *** ESTO ES CRÍTICO: ELIMINA CUALQUIER PROP 'component' o 'href' RELACIONADA CON Next/Link AQUÍ ***
                  // Si ves "component={Link}" o "href={url}", BORRALOS.
                  onClick={() => router.push(url)} // Usamos onClick para navegar programáticamente
                  sx={{
                    '&:hover': {
                      backgroundColor: 'action.hover',
                      cursor: 'pointer',
                    },
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  {fields.map((field) => (
                    <TableCell
                      key={`${rowKey}-${field}`}
                      sx={{
                        fontSize: '0.8rem',
                        color: 'text.secondary',
                        minWidth: '120px',
                        px: 1,
                        py: 0.5,
                        height: '48px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {formatValue(getNestedValue(item, field))}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}