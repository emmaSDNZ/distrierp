// src/shared/components/entityGeneral/EntityPagination.jsx
"use client";

import React from 'react';
import { Box } from '@mui/material';
import EntityButton from './EntityButton'; // Importamos el EntityButton refactorizado a MUI
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

/**
 * Componente de paginación para navegar entre resultados.
 *
 * @param {object} props - Las props del componente.
 * @param {string|null} props.nextUrl - URL para la próxima página (si existe).
 * @param {string|null} props.prevUrl - URL para la página anterior (si existe).
 * @param {function} props.onPageChange - Callback para cambiar de página, recibe la URL.
 */
export default function EntityPagination({ nextUrl, prevUrl, onPageChange }) {

  // La lógica de handlePagination y prevPagination se puede simplificar
  // ya que onPageChange se llama directamente con la URL.

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1, // Espacio entre botones
        flexShrink: 0, // Evita que se encoja
        minWidth: '200px', // min-w-[200px]
      }}
    >
      <EntityButton
        title="Anterior"
        onClick={() => onPageChange(prevUrl)}
        disabled={!prevUrl}
        icon={<NavigateBeforeIcon />} // Pasa el icono directamente
        size="mall" // Puedes ajustar el tamaño
        // Eliminar className y style si EntityButton ya maneja los estilos MUI
        // className="px-4 bg-blue-400 text-white rounded-md disabled:opacity-50 hover:bg-blue-500 active:bg-blue-400"
        // style={{ height: "38px", minWidth: "90px" }}
        color='info' // Si quieres que "Anterior" tenga un color diferente, como tu ejemplo original
      />
      <EntityButton
        title="Siguiente"
        onClick={() => onPageChange(nextUrl)}
        disabled={!nextUrl}
        icon={<NavigateNextIcon />} // Pasa el icono directamente
        size="mall" // Ajustar tamaño si es necesario
        // Eliminar className y style si EntityButton ya maneja los estilos MUI
        // className="px-4 bg-blue-400 text-white rounded-md disabled:opacity-50 hover:bg-blue-500 active:bg-blue-400"
        // style={{ height: "38px", minWidth: "90px" }}
        //color="info" // Si quieres que "Siguiente" tenga un color diferente, como tu ejemplo original
      />
    </Box>
  );
}