import React from 'react';
import Button from '@mui/material/Button';

export default function EntityButton({
  icon,
  className,
  type = 'button',
  title,
  variant = 'contained',
  color = 'primary',
  size = 'medium',
  onClick = () => {},
  disabled = false,
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
      className={className}
      style={style}
      {...rest}
    >
      {icon && <span style={{ marginRight: 8 }}>{icon}</span>}
      {title}
    </Button>
  );
}
