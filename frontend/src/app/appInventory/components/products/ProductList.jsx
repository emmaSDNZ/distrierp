"use client";

import React, { useContext, useEffect, useState } from "react";
import { ApiProductContext } from "@/shared/context/ProductContext";
import EntityList from "@/shared/components/entityAuditTrial/EntityList";
import HeaderList from "@/shared/components/enityList/HeaderList";

import {
  Box,
  Checkbox,
  FormControlLabel,
  Typography,
} from "@mui/material";

function formatCurrency(value) {
  if (value === "" || value === undefined || value === null) return "-";
  return `$ ${parseFloat(value).toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(fecha) {
  if (!fecha) return "-";
  return new Date(fecha).toLocaleDateString("es-AR");
}

const priceFields = [
  { key: "precio_venta_actual", label: "Precio Venta" },
  { key: "precio_compra_unitario", label: "Precio Compra Unitario" },
  { key: "precio_compra_con_iva", label: "Precio Compra con IVA" },
  { key: "precio_compra_sin_iva", label: "Precio Compra sin IVA" },
  { key: "precio_base", label: "Precio Base" },
];

const extraFields = [
  { key: "create_date", label: "Fecha de Creación" },
];

export default function ProductsList() {
  const {
    nextUrl,
    prevUrl,
    productosLista,
    apiListarProductos_All,
    apiAuditListaGeneralSearch,
  } = useContext(ApiProductContext);

  const [name, setName] = useState("");

  // columnas visibles, fecha oculta por defecto
  const [showColumns, setShowColumns] = useState({
    precio_venta_actual: true,
    precio_compra_unitario: true,
    precio_compra_con_iva: false,
    precio_compra_sin_iva: false,
    precio_base: true,
    create_date: false,
  });

  useEffect(() => {
    if (name === "") {
      apiListarProductos_All();
    } else {
      apiAuditListaGeneralSearch("nombre_base_producto", name);
    }
  }, [name]);

  const handleToggleColumn = (field) => {
    setShowColumns((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const processedProductos = productosLista.map((item) => {
    const producto = item.producto_productos?.[0] || {};

    return {
      ...item,
      precio_venta_actual: formatCurrency(producto.precio_venta_actual?._precio_unitario),
      precio_compra_unitario: formatCurrency(producto.precio_compra_actual?._precio_compra_unitario),
      precio_compra_con_iva: formatCurrency(producto.precio_compra_actual?._precio_compra_con_iva),
      precio_compra_sin_iva: formatCurrency(producto.precio_compra_actual?._precio_compra_sin_iva),
      precio_base: formatCurrency(producto.precio_base_actual?._precio_base),
      create_date: formatDate(item.create_date),
    };
  });

  // baseFields sin la fecha, que es opcional
  const baseFields = ["nombre_base_producto"];

  // columnas visibles según checkbox
  const fields = [
    ...baseFields,
    ...priceFields.filter(({ key }) => showColumns[key]).map(({ key }) => key),
    ...extraFields.filter(({ key }) => showColumns[key]).map(({ key }) => key),
  ];

  const fieldLabels = {
    nombre_base_producto: "Nombre del Producto",
    create_date: "Fecha de Creación",
    precio_venta_actual: "Precio Venta",
    precio_compra_unitario: "Precio Compra Unitario",
    precio_compra_con_iva: "Precio Compra con IVA",
    precio_compra_sin_iva: "Precio Compra sin IVA",
    precio_base: "Precio Base",
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 4 }}>
      <HeaderList
        title="Lista de Productos"
        onSearch={setName}
        nextUrl={nextUrl}
        prevUrl={prevUrl}
        onPageChange={apiListarProductos_All}
      />

      {/* Filtros visibles en línea, minimalistas */}
      <Box
        sx={{
          mt: 3,
          display: "flex",
          alignItems: "center",
          gap: 1.6,
          flexWrap: "wrap",
          bgcolor: "background.paper",
          p: 1,
          borderRadius: 1,
          boxShadow: 1,
          userSelect: "none",
        }}
      >
        <Typography
          fontWeight={600}
          sx={{ whiteSpace: "nowrap", fontSize: "1rem", mr: 1 }}
        >
          Mostrar columnas:
        </Typography>

        {[...priceFields, ...extraFields].map(({ key, label }) => (
          <FormControlLabel
            key={key}
            control={
              <Checkbox
                checked={!!showColumns[key]}
                onChange={() => handleToggleColumn(key)}
                color="primary"
                size="small"
                sx={{
                  padding: 0.5,
                  marginRight: 0.5,
                  "& svg": { fontSize: 18 },
                }}
              />
            }
            label={
              <Typography sx={{ fontSize: "0.85rem", userSelect: "none" }}>
                {label}
              </Typography>
            }
            sx={{
              marginRight: 1,
              marginLeft: 0,
              userSelect: "none",
              "& .MuiFormControlLabel-label": { lineHeight: 1.2 },
            }}
          />
        ))}
      </Box>

      <EntityList
        lista={processedProductos}
        fields={fields}
        fieldLabels={fieldLabels}
        itemUrlFn={(item) => `/appInventory/products/${item.id_producto_template}`}
        sx={{ mt: 3 }}
      />
    </Box>
  );
}
