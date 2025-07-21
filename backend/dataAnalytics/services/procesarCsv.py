from dataAnalytics.procesos.coincidenciasDf import coincidencias_codigo_df
from dataAnalytics.services.obtenerDfs import obtener_df_sistema, obtener_df_proveedor
import pandas as pd


def procesar_csv(json_proveedor, id_proveedor):
    df_sistema = obtener_df_sistema(id_proveedor)
    print(df_sistema)
    df_proveedor = obtener_df_proveedor(json_proveedor)
    print(df_proveedor)

    dfs = {
        "sistema": df_sistema,
        "proveedor": df_proveedor
    }

    resultado = coincidencias_codigo_df(dfs)

    return {
    "df_procesado":{
                "df_coincidente": resultado.get("coincidentes", pd.DataFrame()).to_dict(orient="records"),
                "df_no_coincidente": resultado.get("no_coincidentes", pd.DataFrame()).to_dict(orient="records"),
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