// src/app/appInventory/components/internal/Id_AuditProduct.jsx
"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import {
  Box,
  Typography,
  Paper,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress, // Para el estado de carga
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'; // Icono para cambio
import HighlightOffIcon from '@mui/icons-material/HighlightOff'; // Icono para no cambio
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'; // Icono para no datos

// Asegúrate de que estas rutas sean correctas para tu proyecto
// Si no los usas o no los tienes, puedes eliminarlos.
import UtilsFunctions from '@/shared/utils/utilsFunctions';
import showToast from '@/shared/utils/ToastShow';

// Función auxiliar para formatear valores, adaptada de ProductAuditDetails
const formatValue = (value) => {
  if (value === null || value === undefined || value === "") {
    return "-";
  }
  if (typeof value === 'number') {
    // Evita formatear IDs o números enteros que no sean monetarios (ajusta umbral si es necesario)
    if (Number.isInteger(value) && value < 10000 && !String(value).includes('.')) { 
        return value.toString();
    }
    // Intenta formatear como moneda ARS si es un número y tiene sentido
    if (value % 1 !== 0 || value > 999) { // Considera si tiene decimales o es un número grande
        return value.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
  }
  // Truncar strings muy largos para la tabla
  if (typeof value === 'string' && value.length > 80) { // Aumentado para ver más texto
    return `${value.substring(0, 80)}...`; 
  }
  return String(value);
};


export default function Id_AuditProduct() {
  const params = useParams();
  const { id_auditproduct } = params;
  const [auditProductDetail, setAuditProductDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDetail = useCallback(async () => {
    if (!id_auditproduct) {
      setLoading(false);
      setError("ID de auditoría no proporcionado en la URL.");
      return;
    }

    setLoading(true);
    setError(null);
    let toastId;
    if (showToast && showToast.showLoadingToast) {
        toastId = showToast.showLoadingToast("Cargando detalles de auditoría...");
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api_distrimed_productos/audit/product/${id_auditproduct}/`
      );
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
      }
      const data = await response.json();
      console.log("Datos de la API:", data); // Para depuración

      if (!data.success) {
        throw new Error(data.message || "Fallo al obtener los datos de auditoría.");
      }

      setAuditProductDetail(data || {});
      if (UtilsFunctions && UtilsFunctions.showToastMessageSuccessError) {
        UtilsFunctions.showToastMessageSuccessError(data.success, data.message);
      }
    } catch (err) {
      console.error("Error en fetch de auditoría:", err.message);
      setError("Error al cargar los detalles de auditoría: " + err.message);
      if (UtilsFunctions && UtilsFunctions.showToastMessageSuccessError) {
        UtilsFunctions.showToastMessageSuccessError(false, "Error al cargar los detalles de auditoría.");
      }
    } finally {
      setLoading(false);
      if (showToast && showToast.hideLoadingToast && toastId) {
        showToast.hideLoadingToast(toastId);
      }
    }
  }, [id_auditproduct]); // Dependencia del ID de la auditoría

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]); // Dependencia de fetchDetail

  // --- Renderizado de estados ---
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress sx={{ color: 'primary.main' }} />
        <Typography variant="h6" color="text.secondary" sx={{ ml: 2 }}>Cargando detalles de auditoría...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <Typography color="error" variant="h6">{error}</Typography>
      </Box>
    );
  }

  // Si no hay datos o la propiedad 'data' es nula/indefinida
  if (!auditProductDetail || !auditProductDetail.data) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <InfoOutlinedIcon color="action" sx={{ mr: 1, fontSize: '2rem' }} />
        <Typography color="text.secondary" variant="h6">No hay detalles de auditoría para mostrar.</Typography>
      </Box>
    );
  }

  const detalle = auditProductDetail.data;
  const cambios = detalle.cambios || {};

  // Procesar los cambios para la tabla (similar a ProductAuditDetails)
  const processedChanges = Object.entries(cambios).map(([campo, valor]) => {
    if (typeof valor === "object" && valor !== null && ('antes' in valor || 'despues' in valor)) {
      const beforeValue = formatValue(valor.antes);
      const afterValue = formatValue(valor.despues);
      const hasChanged = beforeValue !== afterValue;
      return {
        field: campo,
        before: beforeValue,
        after: afterValue,
        changed: hasChanged,
      };
    } else {
      // Es un campo directo dentro de 'cambios'
      return {
        field: campo,
        before: "-",
        after: formatValue(valor),
        changed: true, // Consideramos que fue "establecido" o "cambiado" al existir
      };
    }
  });


  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto', mt: 4 }}>


      {/* Sección de Información General */}
      <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 2, color: 'primary.main', fontWeight: 'medium' }}>
          Información General
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
          <Typography variant="body2" color="text.secondary">
            <Typography component="span" fontWeight="bold" color="text.primary">ID de Auditoría:</Typography> {detalle.id}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <Typography component="span" fontWeight="bold" color="text.primary">Modelo:</Typography> {detalle.modelo}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <Typography component="span" fontWeight="bold" color="text.primary">Registro ID:</Typography> {detalle.registro_id}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <Typography component="span" fontWeight="bold" color="text.primary">Nombre del Registro:</Typography> {detalle.registro_nombre}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <Typography component="span" fontWeight="bold" color="text.primary">Acción:</Typography> {detalle.accion?.toUpperCase()}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <Typography component="span" fontWeight="bold" color="text.primary">Fecha y Hora:</Typography> {detalle.fecha_hora ? new Date(detalle.fecha_hora).toLocaleString('es-AR') : '-'}
          </Typography>
        </Box>
      </Paper>

      {/* Sección de Cambios Realizados */}
      <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 2, color: 'primary.main', fontWeight: 'medium' }}>
          Cambios Realizados
        </Typography>
        <Divider sx={{ mb: 2 }} />
        {processedChanges.length > 0 ? (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'text.primary' }}>Campo</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'text.primary' }}>Valor Anterior</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'text.primary' }}>Valor Nuevo</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'text.primary' }}>Cambio</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {processedChanges.map((change, index) => (
                  <TableRow key={change.field || index} sx={{ '&:nth-of-type(odd)': { backgroundColor: 'action.hover' } }}>
                    <TableCell sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>
                      {change.field.replace(/_/g, " ")}
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.8rem', color: change.changed ? 'error.main' : 'text.secondary' }}>
                      {change.before}
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.8rem', color: change.changed ? 'success.main' : 'text.secondary' }}>
                      {change.after}
                    </TableCell>
                    <TableCell align="center">
                      {change.changed ? (
                        <CheckCircleOutlineIcon sx={{ color: 'success.main', fontSize: '1.2rem' }} titleAccess="Hubo cambio" />
                      ) : (
                        <HighlightOffIcon sx={{ color: 'text.disabled', fontSize: '1.2rem' }} titleAccess="No hubo cambio" />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 2 }}>
            No se registraron cambios específicos en este movimiento.
          </Typography>
        )}
      </Paper>
    </Box>
  );
}