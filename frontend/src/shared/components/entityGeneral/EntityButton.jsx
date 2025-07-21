// src/shared/components/entityGeneral/EntityButton.jsx
"use client";

import React from 'react';
import Button from '@mui/material/Button';
// No necesitamos 'alpha' directamente aquí si vamos a usar los props de Button y sx correctamente
// import { alpha } from '@mui/material/styles'; // REMOVER ESTA IMPORTACIÓN si no se usa

/**
 * Componente de botón genérico de Material-UI.
 *
 * @param {object} props - Las props del componente.
 * @param {React.ReactNode} [props.icon] - Un icono ReactNode para mostrar a la izquierda del texto.
 * @param {string} [props.type='button'] - El tipo del botón HTML.
 * @param {string} props.title - El texto principal del botón.
 * @param {'text'|'outlined'|'contained'} [props.variant='contained'] - La variante del botón de MUI.
 * @param {'inherit'|'primary'|'secondary'|'success'|'error'|'info'|'warning'} [props.color='primary'] - El color del botón según el tema de MUI.
 * @param {'small'|'medium'|'large'} [props.size='medium'] - El tamaño del botón.
 * @param {function} [props.onClick=() => {}] - Callback al hacer clic en el botón.
 * @param {boolean} [props.disabled=false] - Si el botón está deshabilitado.
 * @param {object} [props.sx={}] - Estilos adicionales de Material-UI.
 * @param {string} [props.className] - Clase CSS adicional para estilos personalizados (menos recomendado que sx).
 * @param {object} [props.style={}] - Estilos CSS inline adicionales (menos recomendado que sx).
 * @param {object} [props.rest] - Otras props pasadas al componente Button de MUI.
 */
export default function EntityButton({
  icon,
  type = 'button',
  title,
  variant = 'contained',
  color = 'primary',
  size = 'medium',
  onClick = () => {},
  disabled = false,
  sx = {}, // Usamos sx para estilos MUI
  className,
  style = {},
  ...rest
}) {
  return (
    <Button
      type={type}
      variant={variant}
      color={color}
      size={size}
      onClick={onClick}
      disabled={disabled}
      startIcon={icon}
      // Mantén className y style si los necesitas para casos muy específicos o retrocompatibilidad,
      // pero idealmente deberías migrarlos a `sx`.
      className={className}
      style={style}
      sx={{
        // Replicar los estilos de Tailwind como 'bg-blue-400', 'text-white', 'rounded-md'
        // Material-UI ya maneja los colores de sus paletas ('primary', 'secondary', 'info', etc.)
        // Si necesitas un color muy específico que no está en la paleta, usa un string de color:
        // Por ejemplo, si tu `className` incluye 'bg-blue-400', podrías hacer:
        // bgcolor: '#60A5FA', // El color hexadecimal para Tailwind blue-400
        // color: 'white',
        // borderRadius: 1, // Material-UI border radius por defecto

        // Para los estados de hover/active, los botones de Material-UI ya tienen un comportamiento
        // por defecto que oscurece/aclara el color del botón. Si quieres personalizarlo,
        // puedes usar los modificadores de estado:
        // '&:hover': {
        //   backgroundColor: (theme) => theme.palette[color].dark, // Ejemplo: usa la variante 'dark' del color elegido
        // },
        // '&:active': {
        //   backgroundColor: (theme) => theme.palette[color].main, // O el color original, o un shade específico
        // },

        // Si el `color` prop es 'info' (como en el botón "Siguiente" de paginación),
        // y quieres que el fondo sea siempre un color específico como "blue-400"
        // y el texto blanco, puedes anular `color` y `bgcolor` en `sx`.
        // Esto solo es necesario si `color="info"` no te da el tono que quieres.
        // Ejemplo para el className del botón Siguiente original:
        // if (className && className.includes('bg-blue-400')) {
        //   sx.bgcolor = '#60A5FA'; // Tailwind blue-400
        //   sx.color = 'white';
        //   sx.borderRadius = 1;
        //   sx['&:hover'] = {
        //     bgcolor: '#3B82F6', // Tailwind blue-500
        //   };
        //   sx['&:active'] = {
        //     bgcolor: '#60A5FA', // Tailwind blue-400
        //   };
        // }

        // Aquí solo mantenemos los estilos pasados directamente y el comportamiento por defecto de MUI
        ...sx // Aplica cualquier estilo sx pasado desde las props de EntityButton
      }}
      {...rest}
    >
      {title}
    </Button>
  );
}