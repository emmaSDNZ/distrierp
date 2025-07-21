// src/app/appInventory/components/navbar/SearchBar.jsx
"use client";

import React, { useState } from "react";
import {
  TextField,
  InputAdornment,
} from '@mui/material';
import SearchIcon from "@mui/icons-material/Search";

const SearchBar = ({ onSearch }) => {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onSearch(inputValue);
    }
  };

  return (
    <TextField
      fullWidth
      variant="outlined"
      size="small"
      placeholder="Buscar..."
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      onKeyDown={handleKeyDown}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon sx={{ color: 'action.active' }} />
          </InputAdornment>
        ),
        sx: {
          borderRadius: 1, // Ligeramente redondeado
          // Estilos para el campo de entrada en diferentes estados
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'divider', // Color del borde en estado normal
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'primary.light', // Color del borde al pasar el ratón (más claro que el principal)
            // Puedes usar 'primary.main', 'secondary.main', o un color hexadecimal como '#90CAF9' para un azul claro
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'primary.main', // Color del borde cuando está enfocado (azul principal)
            // Asegura que este color coincida con tu tema principal
          },
          '&.Mui-focused .MuiInputAdornment-root .MuiSvgIcon-root': {
            color: 'primary.main', // Color del icono cuando está enfocado
          },
          // Si el fondo es blanco o claro, puedes oscurecer ligeramente el fondo en hover
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)', // Un gris muy sutil en hover
          },
        }
      }}
      sx={{
        // Aquí no se necesitan estilos de ancho/flex-grow, ya que el componente padre (HeaderList) los manejará
      }}
    />
  );
};

export default SearchBar;