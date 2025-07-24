"use client";

import React, { useState, useContext, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { apiPrecio } from "@/shared/api/apiPrecio";
import { crearPreciosParaProducto } from "@/shared/services/servicesProductos/servicesPrecios";
import { ApiProductContext } from "@/shared/context/ProductContext";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Button,
  Paper,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import UtilsFunctions from "@/shared/utils/utilsFunctions";

export default function GeneralInformationForm({
  productData,
  nameData,
  setNameData,
  mode,
  setMode,
}) {
  const {
    apiProductoTemplateCreate,
    apiProductoTemplateDetalle,
    apiProductoTemplateEliminar,
  } = useContext(ApiProductContext);

  const producto_producto = productData?.producto_productos|| {};
  const producto_precios_compra = productData?.producto_precios || {};

  const router = useRouter();

  const [formData, setFormData] = useState({
    Descripcion: "",
    Precio: 0,
    "Precio de compra unitario": 0,
    "Precio de compra con IVA": 0,
    "Precio de compra sin IVA": 0,
    "Precio de compra sugerido": 0,
    "Precio de venta": 0,
    "Codigo referencia": "",
    "Codigo barras": "",
    "Codigo interno": "",
    "Codigo NCM": "",
    "Codigo producto": "",
    NIPROD: "",
  });

  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);
  const moreBtnRef = useRef(null);

  useEffect(() => {
    if (productData) {
      setFormData({
        Descripcion: producto_producto.descripcion || "",
        Precio: producto_precios_compra.precio_compra_con_iva
          ? Number(producto_precios_compra.precio_compra_con_iva)
          : 0,
        "Precio de compra unitario": producto_precios_compra.precio_compra_unitario
          ? Number(producto_precios_compra.precio_compra_unitario)
          : 0,
        "Precio de compra con IVA": producto_precios_compra.precio_compra_con_iva
          ? Number(producto_precios_compra.precio_compra_con_iva)
          : 0,
        "Precio de compra sin IVA": producto_precios_compra.precio_compra_sin_iva
          ? Number(producto_precios_compra.precio_compra_sin_iva)
          : 0,
        "Precio de compra sugerido": producto_precios_compra.precio_compra_sugerido
          ? Number(producto_precios_compra.precio_compra_sugerido)
          : 0,
        "Precio de venta": 0,
        "Codigo referencia": producto_producto.codigo_referencia || "",
        "Codigo barras": producto_producto.codigo_barras || "",
        "Codigo interno": producto_producto.codigo_interno || "",
        "Codigo NCM": producto_producto.codigo_ncm || "",
        "Codigo producto": producto_producto.codigo_producto || "",
        NIPROD: producto_producto.codigo_niprod || "",
      });
    }
  }, [productData, mode]);

  const BASIC_FIELDS = [
    "Descripcion",
    "Precio",
    "Precio de compra unitario",
    "Precio de venta",
    "Codigo referencia",
    "Codigo barras",
    "Codigo interno",
    "Codigo NCM",
    "Codigo producto",
    "NIPROD",
  ];

  const ADVANCED_PRICE_FIELDS = [
    "Precio de compra unitario",
    "Precio de compra con IVA",
    "Precio de compra sin IVA",
    "Precio de compra sugerido",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name.startsWith("Precio") ? Number(value) || 0 : value,
    }));
  };

  const handleFocus = (e) => {
    if (e.target.value === "0" || e.target.value === 0) e.target.value = "";
  };

  const handleBlur = (e) => {
    if (e.target.value === "") {
      e.target.value = "0";
      handleChange({ target: { name: e.target.name, value: 0 } });
    }
  };

  const handleMoreClick = (event) => setAnchorEl(event.currentTarget);
  const handleMoreClose = () => setAnchorEl(null);

  async function crearPrecioProducto(idProducto, data, apiFn) {
    const formDataPrecio = {
      id_producto_producto: idProducto,
      ...data,
    };
    return await apiFn(formDataPrecio);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (mode === "edit") {
      const resultadoNombre = await apiProductoTemplateDetalle(
        productData.id_producto_template,
        { nombre_base_producto: nameData.nombre_base_producto }
      );

      const productoProductoId = producto_producto.id_producto_producto;

      if (!productoProductoId) {
        UtilsFunctions.showToastMessageSuccessError(
          false,
          "Producto sin ID para actualizar precios"
        );
        return;
      }

      await crearPrecioProducto(
        productoProductoId,
        { precio: formData["Precio"] },
        apiPrecio.createPrecioBase
      );
      await crearPrecioProducto(
        productoProductoId,
        { precio: formData["Precio de venta"] },
        apiPrecio.createPrecioVenta
      );
      await crearPrecioProducto(
        productoProductoId,
        { precio: formData["Precio de compra unitario"] },
        apiPrecio.createPrecioCompra
      );

      UtilsFunctions.showToastMessageSuccessError(resultadoNombre);

      const productoActualizado = await apiProductoTemplateDetalle(
        productData.id_producto_template
      );

      if (productoActualizado) {
        setNameData({
          nombre_base_producto: productoActualizado.nombre_base_producto,
        });
        setMode("view");
      }
      return;
    }

    if (mode === "create") {
      const formattedDataProductoTemplate = {
        nombre_base_producto: nameData.nombre_base_producto,
        descripcion: formData["Descripcion"],
        codigo_referencia: formData["Codigo referencia"],
        codigo_barras: formData["Codigo barras"],
        codigo_interno: formData["Codigo interno"],
        codigo_ncm: formData["Codigo NCM"],
        codigo_producto: formData["Codigo producto"],
        codigo_niprod: formData["NIPROD"],
      };

      const response = await apiProductoTemplateCreate(formattedDataProductoTemplate);
      const { success, message, data } = response;

      UtilsFunctions.showToastMessageSuccessError(success, message);
      if (!success) return;

      await crearPreciosParaProducto(data.id_producto_producto, formData);
      await apiProductoTemplateDetalle(data.id_producto_template);

      setFormData({
        Descripcion: "",
        Precio: 0,
        "Precio de compra unitario": 0,
        "Precio de compra con IVA": 0,
        "Precio de compra sin IVA": 0,
        "Precio de compra sugerido": 0,
        "Precio de venta": 0,
        "Codigo referencia": "",
        "Codigo barras": "",
        "Codigo interno": "",
        "Codigo NCM": "",
        "Codigo producto": "",
        NIPROD: "",
      });

      setNameData({ nombre_base_producto: "" });
    }
  }

  return (
    <Box>
      {mode === "view" && (
        <Box display="flex" justifyContent="flex-end" mb={2}>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => {
              if (!productData) return;
              UtilsFunctions.deleteClick(
                apiProductoTemplateEliminar,
                productData.id_producto_template,
                router,
                "/appInventory/products?view=new"
              );
            }}
          >
            Eliminar producto
          </Button>
        </Box>
      )}

      <form onSubmit={handleSubmit}>
        <Box
          sx={{
            display: "grid",

            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 2.5,
            justifyContent: "start",
            mx: "auto", 
            px: 3, 
            
          }}
        >
          {BASIC_FIELDS.map((key) => {
            if (key === "Precio de compra unitario") {
              return (
                <Box
                  key={key}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    position: "relative",
                    maxWidth: 280,
                    width: "100%",
                  }}
                >
                  <TextField
                    label={key}
                    type="number"
                    name={key}
                    value={formData[key]}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    InputProps={{ readOnly: mode === "view" }}
                    variant="standard"
                    fullWidth
                    size="small"
                    sx={{
                      "& .MuiInput-underline:before": {
                        borderBottomColor: "#ccc",
                      },
                      "& .MuiInput-underline:hover:before": {
                        borderBottomColor: "#1976d2",
                      },
                      "& .MuiInput-underline:after": {
                        borderBottomColor: "#1976d2",
                      },
                    }}
                  />
                  {(mode === "view" || mode === "edit" || mode === "create") && (
                    <>
                      <IconButton
                        aria-label="Precios avanzados"
                        onClick={handleMoreClick}
                        ref={moreBtnRef}
                        size="small"
                        sx={{ ml: 1 }}
                      >
                        <MoreVertIcon />
                      </IconButton>
                      {menuOpen && anchorEl === moreBtnRef.current && (
                        <Paper
                          elevation={3}
                          sx={{
                            position: "absolute",
                            top: "100%",
                            left: 0,
                            mt: 1,
                            p: 2,
                            width: 280,
                            zIndex: 10,
                            display: "flex",
                            flexDirection: "column",
                            gap: 1,
                          }}
                          onMouseLeave={handleMoreClose}
                        >
                          <Typography
                            variant="subtitle1"
                            sx={{ fontWeight: "600", textAlign: "center" }}
                          >
                            Precios de compra avanzados
                          </Typography>
                          {ADVANCED_PRICE_FIELDS.map((keyAdv) => (
                            <TextField
                              key={keyAdv}
                              label={keyAdv}
                              type="number"
                              name={keyAdv}
                              value={formData[keyAdv]}
                              onChange={handleChange}
                              onFocus={handleFocus}
                              onBlur={handleBlur}
                              InputProps={{ readOnly: mode === "view" }}
                              variant="standard"
                              size="small"
                              sx={{
                                "& .MuiInput-underline:before": {
                                  borderBottomColor: "#ccc",
                                },
                                "& .MuiInput-underline:hover:before": {
                                  borderBottomColor: "#1976d2",
                                },
                                "& .MuiInput-underline:after": {
                                  borderBottomColor: "#1976d2",
                                },
                              }}
                            />
                          ))}
                        </Paper>
                      )}
                    </>
                  )}
                </Box>
              );
            }

            return (
              <TextField
                key={key}
                label={key}
                type={typeof formData[key] === "number" ? "number" : "text"}
                name={key}
                value={formData[key]}
                onChange={handleChange}
                onFocus={typeof formData[key] === "number" ? handleFocus : undefined}
                onBlur={typeof formData[key] === "number" ? handleBlur : undefined}
                InputProps={{ readOnly: mode === "view" }}
                variant="standard"
                fullWidth
                size="small"
                sx={{
                  maxWidth: 280,
                  "& .MuiInput-underline:before": {
                    borderBottomColor: "#ccc",
                  },
                  "& .MuiInput-underline:hover:before": {
                    borderBottomColor: "#1976d2",
                  },
                  "& .MuiInput-underline:after": {
                    borderBottomColor: "#1976d2",
                  },
                }}
              />
            );
          })}
        </Box>

        {(mode === "create" || mode === "edit") && nameData.nombre_base_producto?.trim() && (
          <Box display="flex" justifyContent="flex-end" mt={2}>
            <Button variant="contained" type="submit" size="large">
              {mode === "edit" ? "Actualizar" : "Agregar"}
            </Button>
          </Box>
        )}
      </form>
    </Box>
  );
}
