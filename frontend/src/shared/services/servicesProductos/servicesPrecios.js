import { apiPrecio } from '@/shared/api/apiPrecio';

async function crearPrecioProducto(idProducto, data, apiFn) {
  const formDataPrecio = {
    ...data,
    id_producto_producto: idProducto,
  };
  return await apiFn(formDataPrecio);
}
export async function crearPreciosParaProducto(productoId, formDataPrecio) {
  const resultadoPrecioBase = await crearPrecioProducto(
    productoId,
    { _precio_unitario: formDataPrecio["Precio"] },
    apiPrecio.createPrecioBase
  );

  const resultadoPrecioVenta = await crearPrecioProducto(
    productoId,
    { _precio_unitario: formDataPrecio["Precio de venta"] },
    apiPrecio.createPrecioVenta
  );

  const resultadoPrecioCompra = await crearPrecioProducto(
    productoId,
    {
      _precio_compra_unitario: formDataPrecio["Precio de compra unitario"],
      _precio_compra_con_iva: formDataPrecio["Precio de compra con IVA"],
      _precio_compra_sin_iva: formDataPrecio["Precio de compra sin IVA"],
      _precio_compra_sugerido: formDataPrecio["Precio de compra sugerido"],
    },
    apiPrecio.createPrecioCompra
  );

  return {
    resultadoPrecioBase,
    resultadoPrecioVenta,
    resultadoPrecioCompra
  };
}

