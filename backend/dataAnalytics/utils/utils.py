import pandas as pd

def limpiar_columnas_vacias(df: pd.DataFrame) -> pd.DataFrame:
    """
    Elimina columnas sin nombre (NaN) y columnas totalmente vacías del DataFrame.
    """
    df = df.loc[:, df.columns.notna()]
    df = df.dropna(axis=1, how='all')
    return df



def eliminar_hojas_vacias(entrada):

    def hoja_tiene_datos_exhaustivo(df: pd.DataFrame) -> bool:

        df_str = df.astype(str).apply(lambda col: col.str.strip())
        for val in df_str.values.flatten():
            if val and val.lower() not in ['nan', 'none', 'null', '']:
                return True
        return False

    if isinstance(entrada, pd.DataFrame):
        if hoja_tiene_datos_exhaustivo(entrada):
            return {"Hoja1": entrada}
        else:
            return {}

    elif isinstance(entrada, dict):
        hojas_con_datos = {
            nombre_hoja: df
            for nombre_hoja, df in entrada.items()
            if hoja_tiene_datos_exhaustivo(df)
        }
        return hojas_con_datos

    else:
        raise TypeError("⚠️ Se esperaba un DataFrame o dict de DataFrames.")


def detectar_filas_anomalas_por_distribucion(df: pd.DataFrame, umbral_anomalia: float = 0.7) -> pd.DataFrame:
    """
    Elimina filas que tienen una distribución de valores no nulos muy diferente
    al comportamiento general del DataFrame (anomalía estructural).
    
    - umbral_anomalia: proporción de celdas que están vacías donde deberían no estarlo.
    """
    # Paso 1: Completitud por columna
    completitud_col = df.notna().mean()  # % de filas con dato por columna

    # Paso 2: Matriz de confiabilidad por celda
    # Si una columna tiene 95% de completitud, pero una celda está vacía, es sospechosa
    matriz_confiabilidad = df.notna().astype(float).multiply(completitud_col, axis=1)

    # Paso 3: Puntaje de anomalía por fila (1 - score promedio de confiabilidad)
    score_filas = 1 - matriz_confiabilidad.sum(axis=1) / completitud_col.sum()

    # Paso 4: Eliminar filas anómalas (por encima del umbral)
    df_filtrado = df[score_filas < umbral_anomalia].reset_index(drop=True)
    return df_filtrado
