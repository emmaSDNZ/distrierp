"use client";

import React, { use, useContext, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ApiProductContext } from "@/shared/context/ProductContext";
import ProductForm from "../../components/products/ProductForm";

export default function Id_Product() {
  const { id_product } = useParams();

  const {
    productoDetalle,
    producto: productoRawFromContext,
    apiProductoTemplateDetalle,
    apiProductoProductoDetalleByID,
  } = useContext(ApiProductContext);

  const [mode, setMode] = useState("view");

  async function fetchData() {
    try {

      await apiProductoTemplateDetalle(id_product);
      await apiProductoProductoDetalleByID(id_product);

    } catch (error) {
      console.error("❌ Error al cargar los datos del producto:", error);
    }
  }

  useEffect(() => {
    if (!id_product) {
      console.log("⚠️ No hay ID de producto");
      return;
    }

    fetchData();
  }, [id_product, apiProductoTemplateDetalle, apiProductoProductoDetalleByID]);

  const productoParaFormulario = productoRawFromContext?.data; 
  const formatoProducto = {
    producto_template: {
      create_date: productoParaFormulario?.create_date || "",
      id_producto_template: productoParaFormulario?.id_producto_template || "",
      nombre_base_producto: productoParaFormulario?.nombre_base_producto || "",
      principio_activo: productoParaFormulario?.principio_activo || "",
    },
    producto_productos: {
      codigo_barras: productoParaFormulario?.producto_productos[0].codigo_barras || "",
      codigo_interno: productoParaFormulario?.producto_productos[0].codigo_interno || "",
      codigo_ncm: productoParaFormulario?.producto_productos[0].codigo_ncm || "",
      codigo_niprod: productoParaFormulario?.producto_productos[0].codigo_niprod || "",
      codigo_producto: productoParaFormulario?.producto_productos[0].codigo_producto || "",
      codigo_referencia: productoParaFormulario?.producto_productos[0].codigo_referencia || "",
      descripcion: productoParaFormulario?.producto_productos[0].descripcion || "",      
    },
producto_precios: {
  create_date: productoParaFormulario?.producto_productos[0].precio_compra_actual?._create_date || "",
  precio_compra_con_iva: productoParaFormulario?.producto_productos[0].precio_compra_actual?._precio_compra_con_iva || "",
  precio_compra_sin_iva: productoParaFormulario?.producto_productos[0].precio_compra_actual?._precio_compra_sin_iva || "",
  precio_compra_sugerido: productoParaFormulario?.producto_productos[0].precio_compra_actual?._precio_compra_sugerido || "",
  precio_compra_unitario: productoParaFormulario?.producto_productos[0].precio_compra_actual?._precio_compra_unitario || "",
}

  }


  if (!productoDetalle || Object.keys(productoDetalle).length === 0) {
    return <p>Cargando detalle del producto...</p>;
  }

  return (
    <ProductForm
      productData={formatoProducto}
      mode={mode}
      setMode={setMode}
    />
  );
}
