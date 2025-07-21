// components/entityAuditTrial/EntityFilterAccion.jsx
"use client";

import React from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from '@mui/material';

export default function EntityFilterAccion({ accion, setAccion }) {
  const actionOptions = [
    { value: "", label: "Todos" },
    { value: "create", label: "Create" },
    { value: "update", label: "Update" },
    { value: "delete", label: "Delete" },
  ];

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        minWidth: { xs: 'auto', sm: '200px' },
        flexShrink: 0,
        gap: 2,
        // mb: 2, // Considera eliminar este mb aquí y manejar el espaciado en AuditHistory
        justifyContent: { xs: 'flex-start', sm: 'flex-start' } // Asegurar alineación
      }}
    >
      <Typography
        variant="body2"
        component="label"
        htmlFor="accion-select"
        sx={{
          fontWeight: 'medium',
          whiteSpace: 'nowrap',
          color: 'text.primary',
        }}
      >
        Filtrar por acción:
      </Typography>

      <FormControl
        variant="outlined"
        size="small"
        sx={{
          minWidth: '140px',
          flexGrow: 1,
        }}
      >
        <Select
          id="accion-select"
          value={accion}
          onChange={(e) => setAccion(e.target.value)}
          displayEmpty
          inputProps={{ 'aria-label': 'Filtrar por acción' }}
        >
          {actionOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              <Typography variant="body2" sx={{ color: option.value === "" ? 'text.secondary' : 'text.primary' }}>
                {option.label}
              </Typography>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}