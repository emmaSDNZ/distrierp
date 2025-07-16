import pandas as pd
from dataAnalytics.services.encontrarCoincidenciasCodigo import obtener_df_coincidentes_y_no_coincidentes

def ejecutar_coincidencia_individual(df_proveedor, df_sistema, columna_df, campo_modelo, col_precio="precio compra"):
    logs = []
    logs.append(f"🧩 Comparando '{columna_df}' (proveedor) con '{campo_modelo}' (sistema)")

    resultado = obtener_df_coincidentes_y_no_coincidentes(
        df_proveedor,
        df_sistema,
        col_proveedor=columna_df,
        col_sistema=campo_modelo,
        col_precio=col_precio
    )

    logs.append(f"✅ Coincidencias encontradas: {len(resultado['coincidentes'])}")
    logs.append(f"❌ No coincidencias: {len(resultado['no_coincidentes'])}")

    return {
        "columna_df": columna_df,
        "campo_modelo": campo_modelo,
        "logs": logs,
        "coincidentes": resultado["coincidentes"],
        "no_coincidentes": resultado["no_coincidentes"],
        "actualizados": resultado["actualizados"],
    }

def detectar_coincidencias_por_etapas(df_proveedor, df_sistema, coincidencias_columnas, col_precio="precio compra"):

    resultados = []
    df_actual = df_proveedor.copy()
    print("detectar_coincidencias_por_etapas")
    print("coincidencias_columnas")

    print(coincidencias_columnas)
    for i, c in enumerate(coincidencias_columnas):
        col_prov = c["columna_df"]
        col_sist = c["campo_modelo"]

        resultado = ejecutar_coincidencia_individual(
            df_actual,
            df_sistema,
            columna_df=col_prov,
            campo_modelo=col_sist,
            col_precio=col_precio
        )

        resultados.append(resultado)

        # Actualizamos para siguiente coincidencia solo los no coincidentes
        df_actual = resultado["no_coincidentes"]
    print("detectar_coincidencias_por_etapas")
    print(resultado)
    return resultados
