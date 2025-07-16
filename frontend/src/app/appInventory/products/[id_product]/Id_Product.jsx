"use client";

import React, { useContext, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ApiProductContext } from "@/shared/context/ProductContext";
import ProductForm from "../../components/products/ProductForm";

export default function Id_Product() {
  const { id_product } = useParams();

  const {
    productoDetalle,
    producto,
    apiProductoTemplateDetalle,
    apiProductoProductoDetalleByID,
  } = useContext(ApiProductContext);

  const [mode, setMode] = useState("view");

  async function fetchData() {
    try {
      console.log("🔍 Obteniendo detalles para el producto ID:", id_product);
      const detalleTemplate = await apiProductoTemplateDetalle(id_product);
      const detalleProducto = await apiProductoProductoDetalleByID(id_product);

      console.log("📦 productoDetalle (template):", detalleTemplate);
      console.log("📦 producto (producto_productos):", detalleProducto);
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

  // 🔎 Debug antes del render
  useEffect(() => {
    console.log("🔄 Cambio en productoDetalle:", productoDetalle);
    console.log("🔄 Cambio en producto:", producto);
  }, [productoDetalle, producto]);

  if (!productoDetalle || Object.keys(productoDetalle).length === 0) {
    return <p>Cargando detalle del producto...</p>;
  }

  return (
    <ProductForm
      productData={producto}
      mode={mode}
      setMode={setMode}
    />
  );
}
