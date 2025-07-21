// src/shared/components/entityAuditTrial/EntityAuditHeader.jsx
import React from 'react';
import { Box, Typography } from '@mui/material';

export default function EntityAuditHeader({ title }) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        // mb: 2, // Este margen ahora lo gestionará el HeaderList padre
        pb: 1, // Un pequeño padding inferior si quieres una línea
        borderBottom: '1px solid', // Línea debajo del título
        borderColor: 'divider',
      }}
    >
      <Typography
        variant="h5" // Un tamaño de fuente adecuado para un sub-título de cabecera
        component="h2" // Semánticamente sigue siendo h2
        sx={{
          fontWeight: 'bold',
          color: 'text.primary',
          flexGrow: 1,
          textAlign: { xs: 'center', md: 'left' }
        }}
      >
        {title}
      </Typography>
    </Box>
  );
}