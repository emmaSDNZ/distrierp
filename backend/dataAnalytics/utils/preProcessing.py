import pandas as pd
from unidecode import unidecode

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

    # Mostrar información inicial
    print("DataFrame del usuario:")
    print("Columnas del usuario:")
    print(df_user.columns)
    
    print("DataFrame de la base de datos:")
    print("Columnas de la base de datos:")
    print(df_db.columns)
    print("Tipos de datos")
    print(df_user.dtypes)

    # Copiamos el df 
    df_user_proccess = df_user.copy()

    # Ver los valores de 'precio_base' antes de hacer cualquier procesamiento
    print("\nValores de 'price' antes del procesamiento:")
    print(df_user['precio_base'].head())  # Solo los primeros 5 valores para revisión

    # Mapeamos las columnas del usuario para que coincidan con las de la base de datos
    df_user_proccess = df_user_proccess.rename(columns=column_mapping)
    
    print("df user_ después del mapeo de columnas:")
    print(df_user_proccess.columns)

    # Limpiar la columna 'price' (antes 'precio_base') para eliminar puntos de miles y comas
    df_user_proccess["price"] = df_user_proccess["price"].apply(lambda x: str(x).replace('.', '').replace(',', '.') if isinstance(x, str) else x)

    # Ver los valores de 'price' después de limpiar
    print("\nValores de 'price' después del procesamiento de comas y puntos:")
    print(df_user_proccess['price'].head())  # Solo los primeros 5 valores

    # Convertir la columna 'price' a tipo float
    try:
        df_user_proccess["price"] = df_user_proccess["price"].astype(float)
    except ValueError as e:
        print(f"Error al convertir 'price' a float: {e}")
        return None  # En caso de error en la conversión, devolvemos None

    # Aumentar el valor de "price" en 10000
    df_user_proccess['price'] = df_user_proccess['price'] + 105420

    # Agregar columna de prueba
    df_user_proccess['nueva_columna'] = 'procesado'

    return df_user_proccess