import pandas as pd
import re
import unicodedata

# Función para normalizar un texto (cadena)
def normalizar_texto(texto):
    texto = str(texto).strip().lower()

    # 🔧 Eliminar acentos y caracteres especiales unicode
    texto = unicodedata.normalize('NFKD', texto).encode('ASCII', 'ignore').decode('utf-8')

    # Limpiezas generales
    texto = re.sub(r'\s+', ' ', texto)
    texto = re.sub(r'[^a-zA-Z0-9\s%]', '', texto)
    texto = re.sub(r'(\d)([a-zA-Z])', r'\1 \2', texto)
    texto = re.sub(r'([a-zA-Z])(\d)', r'\1 \2', texto)
    texto = re.sub(r'(?<=\d)x(?=\d)', r' x ', texto)
    texto = re.sub(r'\b([a-zA-Z]+)x\b', r'\1 x', texto)
    texto = re.sub(r'[-/]', ' ', texto)
    texto = re.sub(r'(\d+)\s*([a-zA-Z]+)', r'\1 \2', texto)
    texto = re.sub(r'\s+', ' ', texto).strip()

    combinaciones = {
        'anemido x': 'anemidox',
        'jgaprell': 'jeringa prellenada',
        'fle x': 'flex',
        'argeflo x': 'argeflox',
        'aropa x': 'aropax',
        'arolte x': 'aroltex',
        'atopi x': 'atopix',
        'atorma x': 'atormax',
        'comprec': 'comp recubierto',
        'soloft': 'solucion oftalmica',
        'g': 'gr',
        'cr': 'crema',
        'comp': 'comprimidos',
        'caps': 'capsulas',
        'jer.pre': 'jeringa prellenada',
        'mg': 'miligramos',
        'ml': 'mililitros',
        'mm': 'milimetros',
        'zyvo x': 'zyvox',
        'loc': 'locion',
        'gr': 'gramos',
        'jga': 'jeringa',
        'cm': 'centimetros',
        'u': 'unidad',
        'shamp': 'shampoo',
        'unid': 'unidad',
        'cep': 'cepillo dental',
        'emuls prot': 'emulsion protectora',
        'emulshidrat': 'emulsion hidratante',
        'emulshumect': 'emulsion humectante',
        'iny': 'inyeccion',
        'amp': 'ampolla',
        'inylioffa': 'inyeccion lioffa',
        'ds': 'dosis',
        'inyfa': 'inyeccion fa',
        'jbe': 'jarabe',
        'blist': 'blister',
        'sob': 'sobres',
        'fa': 'frasco ampolla',
        'jab': 'jabon',
        'cps': 'capsulas',
        'ivi x': 'ivix',
        'inya': 'inyectable',
        'inyjgaprell': 'iny jeringa prellenada',
        'mcg': 'microgramo',
        'gts': 'gotas',
        'mgml': 'miligramos por mililitro',
        'env': 'envase',
        'gtsoft': 'gotas oftalmicas',
        'compdisp': 'comprimidos disp',
        'comprecran': 'comprimidos recubiertos ranurados',
        'sol': 'solucion',
        'jgapre': 'jeringa prellenada',
        'fcocps': 'frasco capsulas',
        'fcogotero': 'frasco gotero',
        'fco': 'frasco',
        'solspray': 'solucion spray',
        'solpuas': 'sol puas',
        'cpsblandas': 'cps blandas',
        'tab': 'tableta',
        'sach': 'sachet',
        'mgvial': 'miligramos vial',
        'cpsbl': 'capsula blanda',
        'zyvali x': 'zyvalix',
        'x': 'por',
        'lapprell': 'lapicera prellenada',
        'complibprol': 'comp lib prolongada',
        'compcu': 'comp cu',
        'jerprell': 'jeringa prellenada',
        'prell': 'prellenada',
        'drenabprecortconv': 'drenable precorte conve',
        'drenabprecortopac': 'drenable precorte opac',
        'um': 'unidad de medida:'
    }

    for key, val in combinaciones.items():
        texto = re.sub(rf'\b{key}\b', val, texto)

    texto = re.sub(r'\s+', ' ', texto).strip()
    return texto



# Aplica la normalización solo a texto, sin tocar números ni NaNs
def normalizar_dataframe(df):
    # Normalizar nombres de columnas
    df.columns = [normalizar_texto(col) for col in df.columns]

    # Columnas que NO deben ser normalizadas (por nombre o patrón)
    columnas_excluidas = [
        "codigo barras", "codigo producto", "codigo proveedor", "cert",
        "precio", "precio compra", "precio con iva", "precio sin iva",
        "id_producto", "id producto", "cantidad", "presentacion", "unidad medida"
    ]
    
    columnas_excluidas = [col.lower().strip() for col in columnas_excluidas]
    columnas_df = df.columns.tolist()

    def normalizar_si_texto(valor):
        if isinstance(valor, str):
            return normalizar_texto(valor)
        return valor

    for col in columnas_df:
        if col.lower() not in columnas_excluidas:
            df[col] = df[col].apply(normalizar_si_texto)

    return df


def normalizar_nombre(s):
    s = str(s).strip().lower()
    # Eliminar acentos
    s = unicodedata.normalize('NFKD', s).encode('ASCII', 'ignore').decode('utf-8')
    # Eliminar espacios, guiones y guiones bajos
    s = s.replace("_", "").replace(" ", "").replace("-", "")
    return s

def limpiar_valores_para_comparacion(valor):
    """
    Normaliza levemente el valor para comparación exacta:
    - Quita espacios
    - Convierte a string
    - Quita saltos de línea
    """
    if pd.isna(valor):
        return ""
    return str(valor).strip().replace("\n", "").replace("\r", "")