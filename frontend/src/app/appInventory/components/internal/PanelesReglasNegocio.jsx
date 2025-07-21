import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Checkbox,
  ListItemText,
  OutlinedInput,
  useMediaQuery,
  useTheme,
} from "@mui/material";

export default function PanelesReglasNegocio({ open, onClose, columnas, productos, onAplicar }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [tipoRegla, setTipoRegla] = useState("aumento");
  const [columnaSeleccionada, setColumnaSeleccionada] = useState("");
  const [porcentaje, setPorcentaje] = useState("");
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);

  useEffect(() => {
    if (open) {
      setTipoRegla("aumento");
      setColumnaSeleccionada("");
      setPorcentaje("");
      setProductosSeleccionados([]);
    }
  }, [open]);

  const aplicar = () => {
    console.log("🚀 Aplicar regla:", {
      tipoRegla,
      columna: columnaSeleccionada,
      porcentaje: parseFloat(porcentaje),
      productos: productosSeleccionados,
    });

    onAplicar({
      tipoRegla,
      columna: columnaSeleccionada,
      porcentaje: parseFloat(porcentaje),
      productos: productosSeleccionados,
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" fullScreen={fullScreen}>
      <DialogTitle>Aplicar Reglas de Negocio</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          <FormControl fullWidth>
            <InputLabel>Tipo de Regla</InputLabel>
            <Select
              value={tipoRegla}
              label="Tipo de Regla"
              onChange={(e) => setTipoRegla(e.target.value)}
            >
              <MenuItem value="aumento">Aumento</MenuItem>
              <MenuItem value="descuento">Descuento</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Columna a modificar</InputLabel>
            <Select
              value={columnaSeleccionada}
              onChange={(e) => setColumnaSeleccionada(e.target.value)}
              input={<OutlinedInput label="Columna a modificar" />}
            >
              {columnas.map((col) => (
                <MenuItem key={col} value={col}>
                  {col}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            type="number"
            label="Porcentaje"
            value={porcentaje}
            onChange={(e) => setPorcentaje(e.target.value)}
            fullWidth
          />

          <FormControl fullWidth>
            <InputLabel>Productos</InputLabel>
            <Select
              multiple
              value={productosSeleccionados}
              onChange={(e) => setProductosSeleccionados(e.target.value)}
              input={<OutlinedInput label="Productos" />}
              renderValue={(selected) => selected.join(", ")}
            >
              {productos.map((prod) => (
                <MenuItem key={prod.id} value={prod.id}>
                  <Checkbox checked={productosSeleccionados.indexOf(prod.id) > -1} />
                  <ListItemText primary={prod.nombre} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={aplicar}>Aplicar</Button>
      </DialogActions>
    </Dialog>
  );
}
