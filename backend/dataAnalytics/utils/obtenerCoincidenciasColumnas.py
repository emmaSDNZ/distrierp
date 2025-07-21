import pandas as pd
from dataAnalytics.services.normalizarDf import normalizar_nombre


def obtener_coincidencias_columnas(modelo_django, df: pd.DataFrame):

    # Campos concretos (no relaciones) del modelo
    campos_modelo = [field.name for field in modelo_django._meta.get_fields() if field.concrete and not field.is_relation]

    # Diccionario normalizado -> original para campos modelo
    campos_normalizados = {normalizar_nombre(c): c for c in campos_modelo}

    # Columnas dataframe normalizadas -> originales
    columnas_normalizadas = {normalizar_nombre(c): c for c in df.columns}

    coincidencias = []
    no_coincidentes = []

    for col_norm, col_original in columnas_normalizadas.items():
        if col_norm in campos_normalizados:
            coincidencias.append({
                "columna_df": col_original,
                "campo_modelo": campos_normalizados[col_norm]
            })
        else:
            no_coincidentes.append(col_original)

    return coincidencias, no_coincidentes
