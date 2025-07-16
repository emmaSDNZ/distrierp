import pandas as pd
from dataAnalytics.utils.campos import detectar_fila_cabecera
from dataAnalytics.utils.utils import limpiar_columnas_vacias, eliminar_hojas_vacias, detectar_filas_anomalas_por_distribucion
from dataAnalytics.services.normalizarDf import normalizar_dataframe

def aplicar_cabecera(df: pd.DataFrame, max_filas: int = 15, puntaje_minimo: int = 6) -> pd.DataFrame | None:
    idx = detectar_fila_cabecera(df, max_filas=max_filas, puntaje_minimo=puntaje_minimo)

    if idx is None:
        print("❌ No se detectó una fila como cabecera.")
        return None

    # Obtener la fila seleccionada como cabecera
    cabecera = df.iloc[idx].astype(str)
    df = df.iloc[idx + 1:].reset_index(drop=True)

    # Limpiar nombre de columnas (quitar saltos de línea y espacios)
    df.columns = [str(col).replace("\n", " ").strip() for col in cabecera]
    df = limpiar_columnas_vacias(df)

    return df


def get_df_form_csv(archivo):
    nombre = archivo.name.lower()

    if nombre.endswith(".csv"):
        try:
            df = pd.read_csv(archivo, encoding='utf-8')
            df = aplicar_cabecera(df)
            if df is None:
                raise ValueError("❌ No se detectó cabecera válida en el CSV.")
            
            # 🔹 Filtramos filas anómalas
            df = detectar_filas_anomalas_por_distribucion(df)
            return {"tabla_unica": df}

        except UnicodeDecodeError:
            archivo.seek(0)
            df = pd.read_csv(archivo, encoding='latin1')
            df = aplicar_cabecera(df)
            if df is None:
                raise ValueError("❌ No se detectó cabecera válida en el CSV.")
            
            # 🔹 Filtramos filas anómalas
            df = detectar_filas_anomalas_por_distribucion(df)
            return {"tabla_unica": df}

        except pd.errors.EmptyDataError:
            raise ValueError("El archivo CSV está vacío o mal formado.")

    elif nombre.endswith((".xls", ".xlsx")):
        xls = pd.ExcelFile(archivo)

        if len(xls.sheet_names) == 1:
            nombre_hoja = xls.sheet_names[0]
            df = pd.read_excel(xls, sheet_name=0, header=None)
            df = df.dropna(how="all")
            df = aplicar_cabecera(df)
            df = normalizar_dataframe(df)
            if df is None:
                raise ValueError("❌ No se detectó cabecera válida en la única hoja.")

            # 🔹 Filtramos filas anómalas
            df = detectar_filas_anomalas_por_distribucion(df)
            return {nombre_hoja: df}

        hojas = pd.read_excel(xls, sheet_name=None, header=None)
        hojas = eliminar_hojas_vacias(hojas)

        if not hojas:
            raise ValueError("❌ Todas las hojas están vacías o mal formateadas.")

        hojas_resultado = {}

        for nombre_hoja, df in hojas.items():
            df = df.dropna(how="all")
            df_cabecera = aplicar_cabecera(df)

            if df_cabecera is not None:
                # 🔹 Filtramos filas anómalas
                df_cabecera = detectar_filas_anomalas_por_distribucion(df_cabecera)
                hojas_resultado[nombre_hoja] = df_cabecera
            else:
                print(f"⚠️ Hoja descartada por no tener cabecera: {nombre_hoja}")

        if not hojas_resultado:
            raise ValueError("❌ No se detectó cabecera válida en ninguna hoja.")

        return hojas_resultado

    else:
        raise ValueError("Formato de archivo no soportado.")

