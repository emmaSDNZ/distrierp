"use client"
import React, { useState, useContext, useRef } from "react";
import { useRouter } from "next/navigation";
import { apiPrecio } from "@/shared/api/apiPrecio";
import { crearPreciosParaProducto } from "@/shared/services/servicesProductos/servicesPrecios";
import { ApiProductContext } from "@/shared/context/ProductContext";
import EntityButton from "@/shared/components/entityGeneral/EntityButton";
import DeleteIcon from "@mui/icons-material/Delete";
import FormInput from "@/shared/components/entityForm/FormInput";
import UtilsFunctions from "@/shared/utils/utilsFunctions";
import { Box, IconButton, Typography } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

export default function GeneralInformationForm({
  productoProductoData,
  setProductoPrecios,
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

  const handleChange = UtilsFunctions.createHandleChange(setFormData);

  // ✅ UX: limpiar input si es 0 y restaurar si queda vacío
  const handleFocus = (e) => {
    if (e.target.value === "0" || e.target.value === 0) {
      e.target.value = "";
    }
  };

  const handleBlur = (e) => {
    if (e.target.value === "") {
      e.target.value = "0";
      handleChange({ target: { name: e.target.name, value: 0 } });
    }
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);
  const moreBtnRef = useRef(null);

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
        productoProductoData.id_producto_template,
        { nombre_base_producto: nameData.nombre_base_producto }
      );

      const productoProductoId =
        productoProductoData?.producto_productos?.[0]?.id_producto_producto;

      if (!productoProductoId) {
        UtilsFunctions.showToastMessageSuccessError(false, "Producto sin ID para actualizar precios");
        return;
      }

      await crearPrecioProducto(productoProductoId, formData["Precio"], apiPrecio.createPrecioBase);
      await crearPrecioProducto(productoProductoId, formData["Precio de venta"], apiPrecio.createPrecioVenta);
      await crearPrecioProducto(productoProductoId, formData["Precio de compra unitario"], apiPrecio.createPrecioCompra);

      UtilsFunctions.showToastMessageSuccessError(resultadoNombre);

      const productoActualizado = await apiProductoTemplateDetalle(
        productoProductoData.id_producto_template
      );

      if (productoActualizado) {
        setNameData({ nombre_base_producto: productoActualizado.nombre_base_producto });
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

  function renderFormInputs() {
    const basicFields = [
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

    return basicFields.map((key) => {
      if (key === "Precio de compra unitario") {
        return (
          <div key={key} className="flex items-center space-x-2">
            <FormInput
              label={key}
              type="number"
              id={key}
              name={key}
              value={formData[key]}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              readOnly={mode === "view"}
              className="flex-grow"
            />
            {mode !== "view" && (
              <IconButton
                aria-label="Precios avanzados"
                onClick={handleMoreClick}
                ref={moreBtnRef}
                size="small"
                sx={{ ml: 1 }}
              >
                <MoreVertIcon />
              </IconButton>
            )}

            {menuOpen && anchorEl === moreBtnRef.current && (
              <Box
                sx={{
                  position: "absolute",
                  mt: 1,
                  p: 1,
                  bgcolor: "background.paper",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                  borderRadius: 1,
                  zIndex: 10,
                  width: 220,
                  fontSize: 13,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
                onMouseLeave={handleMoreClose}
              >
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  sx={{
                    fontWeight: "600",
                    textAlign: "center",
                    mb: 1,
                    fontSize: 14,
                    width: "100%",
                  }}
                >
                  Precios de compra avanzados
                </Typography>

                {[
                  "Precio de compra unitario",
                  "Precio de compra con IVA",
                  "Precio de compra sin IVA",
                  "Precio de compra sugerido",
                ].map((key) => (
                  <div
                    key={key}
                    style={{
                      marginBottom: 6,
                      whiteSpace: "nowrap",
                      width: "100%",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <FormInput
                      label={key}
                      type="number"
                      id={key}
                      name={key}
                      value={formData[key]}
                      onChange={handleChange}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                      readOnly={mode === "view"}
                      className="text-sm"
                      style={{ width: 130, margin: 0, padding: "4px 6px" }}
                    />
                  </div>
                ))}
              </Box>
            )}
          </div>
        );
      }

      const inputType = typeof formData[key] === "number" ? "number" : "text";
      return (
        <FormInput
          key={key}
          label={key}
          type={inputType}
          id={key}
          name={key}
          value={formData[key]}
          onChange={handleChange}
          onFocus={inputType === "number" ? handleFocus : undefined}
          onBlur={inputType === "number" ? handleBlur : undefined}
          readOnly={mode === "view"}
        />
      );
    });
  }

  function renderEliminarButton() {
    if (mode === "view") {
      return (
        <div className="flex justify-end pt-4">
          <EntityButton
            title="Eliminar producto"
            onClick={() => {
              if (!productoProductoData) return;
              UtilsFunctions.deleteClick(
                apiProductoTemplateEliminar,
                productoProductoData.id_producto_template,
                router,
                "/appInventory/products?view=new"
              );
            }}
            startIcon={<DeleteIcon />}
          />
        </div>
      );
    }
    return null;
  }

  function renderSubmitButton() {
    if (
      (mode === "create" || mode === "edit") &&
      nameData.nombre_base_producto?.trim()
    ) {
      const title = mode === "edit" ? "Actualizar" : "Agregar";
      return (
        <div className="flex justify-end pt-4">
          <EntityButton type="submit" size="large" title={title} />
        </div>
      );
    }
    return null;
  }

  return (
    <div>
      {renderEliminarButton()}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{renderFormInputs()}</div>
        {renderSubmitButton()}
      </form>
    </div>
  );
}  