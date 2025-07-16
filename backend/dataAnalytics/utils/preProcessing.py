import pandas as pd
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


def readFile(file):
    """
    Lee un archivo CSV o Excel y lo convierte en un DataFrame.
    Lanza ValueError si el tipo de archivo no es soportado.
    """
    try:
        if file.name.endswith('.csv'):
            return pd.read_csv(file)
        elif file.name.endswith(('.xls', '.xlsx')):
            return pd.read_excel(file)
        
        else:
            raise ValueError("Formato de archivo no soportado. Se requiere .csv o .xlsx")
    except Exception as e:
        raise IOError(f"Error al leer el archivo: {e}")
    

def normalizarNombreColumnas(df):
        
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

    # Copiamos el df
    df_user_proccess = df_user.copy()

    # Limpiar la columna 'price' (antes 'precio_base') para eliminar puntos de miles y comas
    df_user_proccess["price"] = df_user_proccess["price"].apply(
        lambda x: str(x).replace('.', '').replace(',', '.') if isinstance(x, str) else str(x)
    )

    # Asegurarse de que 'price' es una Serie antes de hacer cualquier transformación
    if isinstance(df_user_proccess["price"], pd.Series):
        # Convertir la columna 'price' a tipo float, manejando valores no numéricos
        df_user_proccess["price"] = pd.to_numeric(df_user_proccess["price"], errors='coerce')

        # Verificar si hay valores NaN en 'price' después de la conversión
        if df_user_proccess["price"].isnull().any():
            print("\nAdvertencia: Hay valores NaN en la columna 'price'.")
            df_user_proccess["price"].fillna(0, inplace=True)

        # Aumentar el valor de "price" en 10000
        df_user_proccess['price'] = df_user_proccess['price'] + 105420

    else:
        print("Error: 'price' no es una Serie.")

    # Agregar columna de prueba
    df_user_proccess['nueva_columna'] = 'procesado'

    return df_user_proccess



def proceso_columnas_obligatorias(df):
    columnas_obligatorias = ["name", "price"] 
    for col in columnas_obligatorias:
        if not col in df.columns:
            message = f"Falta columna {col}"
            return  message
    return df

def proceso_columna_precio(df, nameColumn):
    df = df.copy()


    # Elimina espacios
    df[nameColumn] = df[nameColumn].astype(str).str.strip()

    # Reemplaza puntos (separadores de miles)
    df[nameColumn] = df[nameColumn].str.replace('.', '', regex=False)

    # Reemplaza comas por punto decimal
    df[nameColumn] = df[nameColumn].str.replace(',', '.', regex=False)

    # Convierte a número
    df[nameColumn] = pd.to_numeric(df[nameColumn], errors='coerce')

    # Mostramos cuántos NaN hay
    print(f"[DEBUG] Total NaN en '{nameColumn}': {df[nameColumn].isna().sum()}")
    # Elimina filas NaN
    df = df.dropna(subset=[nameColumn])
    return df


def proceso_columna_name(df):

    df = df.dropna(subset=["name"])

    return df

def normalizar_nombres_columnas(df):
    """
    Normaliza los nombres de columnas:
    - Elimina espacios al inicio/final
    - Convierte a minúsculas
    - Elimina acentos y caracteres especiales
    """
    nuevas_columnas = []
    for col in df.columns:
        col_limpia = col.strip()       
        col_limpia = col_limpia.lower()
        col_limpia = unidecode(col_limpia)
        nuevas_columnas.append(col_limpia)
    df.columns = nuevas_columnas
    return df

def dfProcess(df):
    print("Se aplico proceso de Lectura de format .csv .xlsx")
    df = readFile(df)
    

    df = df.reset_index(drop=True)           
    df = df.dropna(how='all')
    df = df.dropna(axis=1, how='all')

    print("Previo a Normalización")
    print(df.columns)
    print(df.shape)
    print(df.dtypes)

    # Normalizar nombres de columnas ANTES de verificar columnas obligatorias
    print("Normalización de nombres de columnas")
    df = normalizar_nombres_columnas(df)
    print("Columnas normalizadas:", df.columns)

    # Verificar columnas obligatorias después de normalizar nombres
    print("Verificación de columnas obligatorias")
    resultado = proceso_columnas_obligatorias(df)
    if isinstance(resultado, str):
        return resultado  # Devuelve mensaje de error si falta alguna columna
    df = resultado  # si todo va bien, continúa con el DataFrame

    print("Procesamiento de la columna: name")
    df = proceso_columna_name(df)
    print("Total con procesamiento de nombre:", df.shape)

    return df