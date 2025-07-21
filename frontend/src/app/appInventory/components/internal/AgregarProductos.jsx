"use client";

import React, { useState, useEffect, useContext } from "react";
import { ApiProductContext } from "@/shared/context/ProductContext";
import UtilsFunctions from "@/shared/utils/utilsFunctions";
import {
  Box,
  Paper,
  Typography,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl
} from "@mui/material";

export default function AgregarProductos({
  onProductoCreado,
  dfNoCoincidentes,
  id_proveedor,
  onProductosAgregadosCompletamente
}) {
  const {
    apiProductoTemplateObtenerSchema,
    schemaFields,
    apiProductoTemplateCreate,
    apiProductoProveedorCreate,
    apiProductoProductoByID
  } = useContext(ApiProductContext);

  const [mostrarCampos, setMostrarCampos] = useState(false);
  const [mapeo, setMapeo] = useState({});

  const columnasDetectadas =
    dfNoCoincidentes.length > 0 ? Object.keys(dfNoCoincidentes[0]) : [];

  useEffect(() => {
    if (mostrarCampos && (!schemaFields || Object.keys(schemaFields).length === 0)) {
      const obtenerSchema = async () => {
        console.log("🔄 Llamando a apiProductoTemplateObtenerSchema...");
        await apiProductoTemplateObtenerSchema();
        console.log("✅ Schema obtenido:", schemaFields);
      };
      obtenerSchema();
    }
  }, [mostrarCampos, apiProductoTemplateObtenerSchema, schemaFields]);

  const handleSaveRelation = () => {
    console.log("🔘 Botón 'Agregar productos internos' presionado");
    setMostrarCampos((prev) => !prev);
  };

  const handleMappingChange = (field, selectedColumn) => {
    console.log(`🔁 Mapeo actualizado: '${field}' -> '${selectedColumn}'`);
    setMapeo((prev) => ({ ...prev, [field]: selectedColumn }));
  };

  const camposObligatorios = schemaFields
    ? Object.entries(schemaFields)
        .filter(([_, config]) => config.required)
        .map(([field]) => field)
    : [];

  const validarMapeo = () => {
    console.log("✅ Validando mapeo...");
    for (const campo of camposObligatorios) {
      if (!mapeo[campo]) {

        console.warn(`❌ Campo obligatorio no mapeado: ${campo}`);
        return false;
      }
    }
    console.log("✅ Todos los campos obligatorios mapeados");
    return true;
  };

  const handleCrearProductos = async () => {
    console.log("🚀 Iniciando creación de productos...");
    if (!id_proveedor) {
      alert("Proveedor no seleccionado");
      console.error("❌ Proveedor no seleccionado");
      return;
    }

    if (!validarMapeo()) return;

    for (const [index, fila] of dfNoCoincidentes.entries()) {
      try {
        console.log(`📦 Procesando fila ${index}:`, fila);

        const productoPayload = {};

        const camposDecimal = [
          "_precio_compra_unitario",
          "_precio_compra_con_iva",
          "_precio_compra_sin_iva",
          "_precio_compra_sugerido",
        ];

Object.entries(mapeo).forEach(([campoModelo, columnaDf]) => {
  let valorOriginal = fila[columnaDf];

  if (
    valorOriginal === "" ||
    valorOriginal === undefined ||
    valorOriginal === null
  ) {
    productoPayload[campoModelo] = null;
  } else if (camposDecimal.includes(campoModelo)) {
    const valorNum = Number(valorOriginal);
    productoPayload[campoModelo] = isNaN(valorNum) ? null : Number(valorNum.toFixed(2));
  } else {
    productoPayload[campoModelo] = valorOriginal;
  }
});

        console.log("📤 Payload para crear producto:", productoPayload);

        const resProducto = await apiProductoTemplateCreate(productoPayload);
        console.log("✅ Respuesta creación producto:", resProducto);

        UtilsFunctions.showToastMessageSuccessError(
          resProducto.success,
          resProducto.message
        );

        const idProductoProducto = resProducto.data?.id_producto_producto;
        if (!idProductoProducto) throw new Error("Falta ID del producto");

        const relPayload = {
          id_producto_producto: idProductoProducto,
          id_proveedor,
        };
        console.log(
          "🔗 Creando relación producto-proveedor con payload:",
          relPayload
        );

        await apiProductoProveedorCreate(relPayload);

        const mostrarProductoCreado = await apiProductoProductoByID(idProductoProducto);
        console.log("👁️ Producto creado (para mostrar):", mostrarProductoCreado);

        if (typeof onProductoCreado === "function") {
          console.log("📩 Llamando a onProductoCreado()");
          onProductoCreado(mostrarProductoCreado.data, index);
        }
      } catch (error) {
        let mensajeError = "Error desconocido";

        if (error.response && error.response.data) {
          mensajeError = JSON.stringify(error.response.data);
        } else if (error.message) {
          mensajeError = error.message;
        } else if (typeof error === "string") {
          mensajeError = error;
        }

        console.error("❌ Error en la creación del producto:", mensajeError);

      }
    }

    alert("✅ Proceso de creación de productos finalizado.");
    console.log("🎉 Todos los productos fueron procesados.");

    if (typeof onProductosAgregadosCompletamente === "function") {
      console.log("📩 Llamando a onProductosAgregadosCompletamente()");
      onProductosAgregadosCompletamente();
    }
  };

  return (
    <Box mt={4} maxWidth={480} mx="auto">
      <Typography variant="body1" gutterBottom>
        Podés agregarlos con el botón{" "}
        <em>
          <Button variant="text" onClick={handleSaveRelation}>
            Agregar productos internos
          </Button>
        </em>
        .
      </Typography>

      {mostrarCampos && schemaFields && Object.keys(schemaFields).length > 0 && (
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Mapeá las columnas del archivo a los campos del producto
          </Typography>

          {Object.entries(schemaFields).map(([field, config]) => (
            <FormControl fullWidth key={field} margin="normal" size="small">
              <InputLabel>
                {field} {config.required ? "*" : ""}
              </InputLabel>
              <Select
                value={mapeo[field] || ""}
                label={field}
                onChange={(e) => handleMappingChange(field, e.target.value)}
              >
                <MenuItem value="">-- Seleccionar columna --</MenuItem>
                {columnasDetectadas.map((col) => (
                  <MenuItem key={col} value={col}>
                    {col}
                  </MenuItem>
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
