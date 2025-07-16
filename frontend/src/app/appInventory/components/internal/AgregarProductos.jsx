"use client";

import React, { useState, useEffect, useContext } from "react";
import { ApiProductContext } from "@/shared/context/ProductContext";
import UtilsFunctions from "@/shared/utils/utilsFunctions";
import { Box, Paper, Typography, Button, MenuItem, Select, InputLabel, FormControl } from "@mui/material";

export default function AgregarProductos({ onProductoCreado, dfNoCoincidentes, id_proveedor, onProductosAgregadosCompletamente }) {
  const {
    apiProductoTemplateObtenerSchema,
    schemaFields,
    apiProductoTemplateCreate,
    apiProductoProveedorCreate,
    apiProductoProductoByID
  } = useContext(ApiProductContext);

  const [mostrarCampos, setMostrarCampos] = useState(false);
  const [mapeo, setMapeo] = useState({});

  const columnasDetectadas = dfNoCoincidentes.length > 0 ? Object.keys(dfNoCoincidentes[0]) : [];

  useEffect(() => {
    if (mostrarCampos && (!schemaFields || Object.keys(schemaFields).length === 0)) {
      const obtenerSchema = async () => {
        await apiProductoTemplateObtenerSchema();
      };
      obtenerSchema();
    }
  }, [mostrarCampos, apiProductoTemplateObtenerSchema, schemaFields]);

  const handleSaveRelation = () => setMostrarCampos((prev) => !prev);

  const handleMappingChange = (field, selectedColumn) => {
    setMapeo((prev) => ({ ...prev, [field]: selectedColumn }));
  };

  const camposObligatorios = schemaFields
    ? Object.entries(schemaFields)
        .filter(([_, config]) => config.required)
        .map(([field]) => field)
    : [];

  const validarMapeo = () => {
    for (const campo of camposObligatorios) {
      if (!mapeo[campo]) {
        alert(`Debés mapear el campo obligatorio '${campo}'`);
        return false;
      }
    }
    return true;
  };

  const handleCrearProductos = async () => {
    if (!id_proveedor) {
      alert("Proveedor no seleccionado");
      return;
    }
    if (!validarMapeo()) return;

    for (const [index, fila] of dfNoCoincidentes.entries()) {
      try {
        const productoPayload = {};
        Object.entries(mapeo).forEach(([campoModelo, columnaDf]) => {
          productoPayload[campoModelo] = fila[columnaDf] || "";
        });

        const resProducto = await apiProductoTemplateCreate(productoPayload);
        UtilsFunctions.showToastMessageSuccessError(resProducto.success, resProducto.message);

        const idProductoProducto = resProducto.data?.id_producto_producto;
        if (!idProductoProducto) throw new Error("Falta ID del producto");

        const relPayload = { id_producto_producto: idProductoProducto, id_proveedor };
        await apiProductoProveedorCreate(relPayload);

        const mostrarProductoCreado = await apiProductoProductoByID(idProductoProducto);
        console.log("motrar producto creado: ", mostrarProductoCreado)
        if (typeof onProductoCreado === "function") {
          // Enviamos el producto creado y el índice para que el padre actualice el array visual
          onProductoCreado(mostrarProductoCreado.data, index);
        }

        // (Tu lógica para precios omitida por claridad, la podés mantener si la usas)

      } catch (error) {
        alert(`Error: ${error.message}`);
        console.error("Error general:", error);
      }
    }

    alert("✅ Proceso de creación de productos finalizado.");
    if (typeof onProductosAgregadosCompletamente === "function") onProductosAgregadosCompletamente();
  };

  return (
    <Box mt={4} maxWidth={480} mx="auto">
      <Typography variant="body1" gutterBottom>
        Podés agregarlos con el botón <em><Button variant="text" onClick={handleSaveRelation}>Agregar productos internos</Button></em>.
      </Typography>

      {mostrarCampos && schemaFields && Object.keys(schemaFields).length > 0 && (
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Mapeá las columnas del archivo a los campos del producto
          </Typography>

          {Object.entries(schemaFields).map(([field, config]) => (
            <FormControl fullWidth key={field} margin="normal" size="small">
              <InputLabel>{field} {config.required ? "*" : ""}</InputLabel>
              <Select
                value={mapeo[field] || ""}
                label={field}
                onChange={(e) => handleMappingChange(field, e.target.value)}
              >
                <MenuItem value="">-- Seleccionar columna --</MenuItem>
                {columnasDetectadas.map((col) => (
                  <MenuItem key={col} value={col}>{col}</MenuItem>
                ))}
              </Select>
            </FormControl>
          ))}

          <Button
            onClick={handleCrearProductos}
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Crear productos y relaciones
          </Button>
        </Paper>
      )}
    </Box>
  );
}
