from dataAnalytics.utils.obtenerCoincidenciasColumnas import obtener_coincidencias_columnas
from apps.products.models.producto.productoProductoModel import ProductoProductoModel
from dataAnalytics.services.detectarCoincidenciasEtapas import detectar_coincidencias_por_etapas
import pandas as pd 

def coincidencias_codigo_df(dfs: dict):
    df_proveedor = dfs.get("proveedor")
    df_sistema = dfs.get("sistema")

    if df_proveedor is None or df_sistema is None:
        return {
            "coincidentes": pd.DataFrame(),
            "no_coincidentes": pd.DataFrame(),
            "actualizados": [],
            "logs": ["⚠️ Error: DataFrames proveedor o sistema faltan."]
        }

    coincidencias_columnas, no_coincidentes = obtener_coincidencias_columnas(ProductoProductoModel, df_proveedor)
    
    etapas, no_coincidentes_final = detectar_coincidencias_por_etapas(df_proveedor, df_sistema, coincidencias_columnas)

    df_total_coincidentes = []
    productos_actualizados = []
    logs = []

    for etapa in etapas:
        df_total_coincidentes.append(etapa["coincidentes"])
        productos_actualizados.extend(etapa["actualizados"])
        logs.extend(etapa["logs"])

    if df_total_coincidentes:
        df_resultado_final = pd.concat(df_total_coincidentes, ignore_index=True)
    else:
        df_resultado_final = pd.DataFrame()

    logs.append(f"✅ Coincidentes totales: {len(df_resultado_final)}")
    logs.append(f"❌ No coincidentes finales: {len(no_coincidentes_final)}")

    return {
        "coincidentes": df_resultado_final,
        "no_coincidentes": no_coincidentes_final,
        "actualizados": productos_actualizados,
        "logs": logs
    }
