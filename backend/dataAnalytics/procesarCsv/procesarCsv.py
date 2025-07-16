from apps.products.models.producto._productoProveedor import ProductoProveedorModel
import pandas as pd
from dataAnalytics.procesos.coincidenciasDf import coincidencias_codigo_df

def obtener_df_sistema(id_proveedor):
    productos_qs = ProductoProveedorModel.objects.select_related('id_producto_producto', 'id_proveedor')\
                                                 .filter(id_proveedor=id_proveedor)

    if not productos_qs.exists():
        return pd.DataFrame()

    data = []
    for p in productos_qs:
        producto = p.id_producto_producto
        proveedor =  p.id_proveedor
        precio_obj =  producto.precio_compra.order_by("-_create_date").first()
        precios = producto.precio_compra.all()

        data.append({
            "id_producto" : producto.id_producto_producto,
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
    return pd.DataFrame(data)


def obtener_df_proveedor(json_proveedor):
    try: 
        return pd.DataFrame(json_proveedor)
    except Exception as e:
        raise ValueError(f"Error al convertir JSON a DataFrame: {str(e)}")

def procesar_csv(json_proveedor, id_proveedor):
    df_sistema = obtener_df_sistema(id_proveedor)
    df_proveedor = obtener_df_proveedor(json_proveedor)

    dfs = {
        "sistema": df_sistema,
        "proveedor": df_proveedor
    }

    resultado = coincidencias_codigo_df(dfs)
    print("procesar csv")
    print(resultado)

    return {
    "df_procesado":{
                "df_coincidente": resultado.get("coincidentes", pd.DataFrame()).to_dict(orient="records"),
                "df_no_coincidente": resultado.get("no_coincidentes", pd.DataFrame()).to_dict(orient="records"),
                # ⚠️ Acá corregí:
                "actualizados": resultado.get("actualizados", []),  
            },
        "sistema": {
            "data": df_sistema.head(3).to_dict(orient="records"),
            "columnas": df_sistema.columns.tolist(),
            "tamaño": df_sistema.shape
        },
        "proveedor": {
            "data": df_proveedor.head(3).to_dict(orient="records"),
            "columnas": df_proveedor.columns.tolist(),
            "tamaño": df_proveedor.shape
        }
    }