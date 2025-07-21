from apps.products.models.producto._productoProveedor import ProductoProveedorModel
import pandas as pd

def obtener_df_sistema(id_proveedor):
    productos_qs = ProductoProveedorModel.objects.select_related('id_producto_producto', 'id_proveedor')\
                                                 .filter(id_proveedor=id_proveedor)

    if not productos_qs.exists():
        print("[DEBUG] No se encontraron productos del sistema para este proveedor.")
        return None  # <-- importante

    data = []
    for p in productos_qs:
        producto = p.id_producto_producto
        proveedor = p.id_proveedor
        precio_obj = producto.precio_compra.order_by("-_create_date").first()


        data.append({
            "id_producto": producto.id_producto_producto,
            "descripcion": producto.descripcion,
            "codigo_barras": producto.codigo_barras,
            "codigo_producto": producto.codigo_producto,
            "unidad_medida": producto.unidad_medida,
            "presentacion": producto.presentacion,
            "nombre_proveedor": proveedor.nombre_proveedor,
            "codigo_proveedor": p.codigo_proveedor,
            "precio_compra_unitario": precio_obj._precio_compra_unitario if precio_obj else None,
            "precio_compra_con_iva": precio_obj._precio_compra_con_iva if precio_obj else None,
            "precio_compra_sin_iva": precio_obj._precio_compra_sin_iva if precio_obj else None,
            "precio_sugerido": precio_obj._precio_compra_sugerido if precio_obj else None
        })

    df_sistema = pd.DataFrame(data)
    return df_sistema


def obtener_df_proveedor(json_proveedor):
    try:
        df_proveedor = pd.DataFrame(json_proveedor)

        return df_proveedor
    except Exception as e:

        raise ValueError(f"Error al convertir JSON a DataFrame: {str(e)}")
