// src/shared/components/enityList/HeaderList.jsx
"use client";

import React from 'react';
import {
  Box,
  Paper,
} from '@mui/material';

import EntityAuditHeader from '../entityAuditTrial/EntityAuditHeader';
import SearchBar from '@/app/appInventory/components/navbar/SearchBar';
import EntityPagination from '../entityGeneral/EntityPagination';

export default function HeaderList({ title, onSearch, nextUrl, prevUrl, onPageChange }) {
  return (
    <Paper
      elevation={3} // Sombra para dar profundidad
      sx={{
        mb: 3, // Margen inferior para separarlo de los filtros y la tabla
        p: { xs: 2, sm: 3 }, // Padding interno para espacio alrededor del contenido
        borderRadius: 2, // Bordes redondeados para el contenedor principal
        bgcolor: 'background.paper', // Fondo blanco o claro del tema Material-UI
        display: 'flex', // Usar flexbox para organizar el contenido interno
        flexDirection: 'column', // Los elementos irán uno debajo del otro
        gap: 2, // Espacio entre el título y la sección de búsqueda/paginación
      }}
    >
      {/* Sección del Título */}
      <EntityAuditHeader
        title={title}
      />

      {/* Contenedor para la barra de búsqueda y paginación */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap', // Permite que los elementos se envuelvan en pantallas pequeñas
          justifyContent: 'space-between', // CLAVE: Espacia la búsqueda y la paginación
          alignItems: 'center', // Alinea verticalmente al centro
          gap: { xs: 2, sm: 3 }, // Espacio entre los elementos cuando se envuelven
        }}
      >
        {/* Contenedor para SearchBar con ancho controlado */}
        <Box
          sx={{
            flexGrow: 1, // Permite que la barra de búsqueda crezca
            minWidth: '200px', // Ancho mínimo para que no se haga demasiado pequeña
            maxWidth: { xs: '100%', sm: '350px', md: '450px' }, // CLAVE: Ancho máximo de la SearchBar
            // Ajusta '350px' o '450px' si crees que aún es muy grande o muy pequeña.
          }}
        >
          <SearchBar
            onSearch={onSearch}
          />
        </Box>

        {/* Paginador */}
        <EntityPagination
          nextUrl={nextUrl}
          prevUrl={prevUrl}
          onPageChange={onPageChange}
        />
      </Box>
    </Paper>
  );
}