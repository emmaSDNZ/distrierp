import pandas as pd
from dataAnalytics.services.detecarCoincidenciasEtapasIndividual import detectar_coincidencias_por_etapas_individual


def detectar_coincidencias_por_etapas(df_proveedor, df_sistema, coincidencias_columnas):
    resultados = []
    df_proveedor_restante = df_proveedor.copy()  # Copia de los datos iniciales

    for c in coincidencias_columnas:
        col_prov = c["columna_df"]
        col_sist = c["campo_modelo"]

        resultado_crudo = detectar_coincidencias_por_etapas_individual(
            df_proveedor_restante,
            df_sistema,
            col_proveedor=col_prov,
            col_sistema=col_sist
        )

        logs = []
        logs.append(f"🧩 Comparando '{col_prov}' (proveedor) con '{col_sist}' (sistema)")
        logs.append(f"✅ Coincidencias encontradas: {len(resultado_crudo['coincidentes'])}")
        logs.append(f"❌ No coincidencias: {len(resultado_crudo['no_coincidentes'])}")

        resultado_formateado = {
            "columna_df": col_prov,
            "campo_modelo": col_sist,
            "logs": logs,
            "coincidentes": resultado_crudo["coincidentes"],
            "no_coincidentes": resultado_crudo["no_coincidentes"],
            "actualizados": resultado_crudo["actualizados"],
        }

        resultados.append(resultado_formateado)

        # ACTUALIZAMOS df_proveedor_restante para la próxima etapa, que incluye solo no coincidentes
        df_proveedor_restante = resultado_crudo["no_coincidentes"]

    # Al final devolvemos los resultados y el dataframe final de no coincidentes que quedó sin procesar
    return resultados, df_proveedor_restante
