import pandas as pd
import numpy as np
from unidecode import unidecode
from io import BytesIO
def successColumns(df):
    # Normalizar nombres de columnas
    df.columns = [unidecode(col.strip().lower()) for col in df.columns]

    # Normalizar valores de texto
    for col in df.select_dtypes(include=['object']):
        df[col] = df[col].map(lambda x: unidecode(str(x).lower()) if isinstance(x, str) else x)

    # Eliminar filas y columnas completamente vacías
    df = df.dropna(how='all')
    df = df.dropna(axis=1, how='all')

    # Columnas requeridas
    columnas_obligatorias = ['cod_de_prod', 'niprod', 'descripcion', 'presentacion', 'cod_de_barra', 'precio_base']
    
    messages = []
    valido = True
    columnas_faltantes = []
    columnas_presentes = []

    for columna in columnas_obligatorias:
        if columna not in df.columns:
            columnas_faltantes.append(columna)
            valido = False
        else:
            
            columnas_presentes.append(columna)

    if columnas_faltantes:
        messages.append("Faltan las siguientes columnas: ")
        for col in columnas_faltantes:
            messages.append(f"{col}")
    else:
        messages.append(f"Todas las columnas obligatoorias estan presente. ")
        for col in columnas_presentes:
            messages.append(f"{col}")


    return df, messages, valido


def ConverToJsonDf(json):
   df = pd.DataFrame(json)
   return df



def dfProcessing(df_user, df_db):
    # Diccionario que mapea campos del usuario con los campos de la base de datos
    column_mapping = {
        'descripcion': 'description',
        'presentacion': 'presentation',
        'niprod': 'niprod_code',
        'cod_de_barra': 'bar_code',
        'cod_de_prod': 'proveedor_code',
        'precio_base': 'price',
    }

    # Copiamos el DataFrame original
    df_user_proccess = df_user.copy()

    # Eliminar espacios en blanco y convertir comas/puntos en 'price'
    df_user_proccess['price'] = (
        df_user_proccess['price']
        .astype(str)
        .str.strip()                                # eliminar espacios adelante/atrás
        .str.replace('.', '', regex=False)          # eliminar puntos (miles)
        .str.replace(',', '.', regex=False)         # cambiar coma decimal a punto
        .replace(['', 'nan', 'None', None], np.nan) # convertir strings vacíos y nulos explícitos a np.nan
    )

    # Convertir a numérico, forzando errores a NaN
    df_user_proccess['price'] = pd.to_numeric(df_user_proccess['price'], errors='coerce')

    # Advertir si aún hay NaN
    if df_user_proccess['price'].isnull().any():
        print("⚠️ Advertencia: Hay valores NaN en la columna 'price'. Serán reemplazados por 0.")

    # Reemplazar NaN por 0
    df_user_proccess['price'] = df_user_proccess['price'].fillna(0)

    # Aumentar el precio
    df_user_proccess['price'] = df_user_proccess['price'] + 105420

    # Agregar columna de prueba
    df_user_proccess['nueva_columna'] = 'procesado'

    return df_user_proccess