from collections import defaultdict
from difflib import SequenceMatcher
import unicodedata
import re
import pandas as pd
from dataAnalytics.utils.campos_claves import CAMPOS_CLAVE


def normalizar(texto):
    """
    Normaliza un texto para comparación:
    - Convierte a string y minúsculas.
    - Elimina acentos y caracteres especiales.
    - Reemplaza puntuación y guiones por espacios.
    - Elimina espacios duplicados.
    - Elimina caracteres no alfanuméricos (excepto espacios).
    - Elimina espacios al inicio y final.
    """
    texto = str(texto).lower()
    texto = unicodedata.normalize('NFD', texto)
    texto = texto.encode('ascii', 'ignore').decode('utf-8')
    texto = re.sub(r'[\.\_\-]', ' ', texto)   # Reemplaza puntos, guiones bajos y guiones por espacios
    texto = re.sub(r'\s+', ' ', texto)        # Elimina espacios duplicados
    texto = re.sub(r'[^a-z0-9 ]', '', texto)  # Elimina caracteres no alfanuméricos (excepto espacios)
    return texto.strip()


def similaridad(a, b):
    """Calcula la similitud entre dos cadenas usando SequenceMatcher."""
    return SequenceMatcher(None, a, b).ratio()


def encontrar_campo(valor, umbral_similitud=0.7, campos_clave=None):
    """
    Encuentra el campo estandarizado que mejor coincide con un valor dado (nombre de columna),
    usando coincidencias exactas y luego por tokens y similaridad.
    Prioriza coincidencias exactas y de tokens.
    """
    if campos_clave is None:
        campos_clave = CAMPOS_CLAVE  # Usa el diccionario global si no se pasa otro

    valor_norm = normalizar(valor)

    # Paso 1: Coincidencia exacta contra algún sinónimo normalizado
    # Esta es la prioridad más alta
    for clave, sinonimos in campos_clave.items():
        for sin in sinonimos:
            if normalizar(sin) == valor_norm:
                return clave
    
    # Paso 2: Comparar por tokens y similaridad (ponderado)
    # Se usa si no hay coincidencia exacta.
    tokens = valor_norm.split()
    votos = defaultdict(int)

    for token in tokens:
        for clave, sinonimos in campos_clave.items(): # Usar campos_clave pasado o global
            for sin in sinonimos:
                sin_norm = normalizar(sin)
                if token == sin_norm:
                    votos[clave] += 3  # Coincidencia exacta de token: alta prioridad
                elif token in sin_norm or sin_norm in token:
                    votos[clave] += 2  # Token contenido: prioridad media
                elif similaridad(token, sin_norm) >= umbral_similitud:
                    votos[clave] += 1  # Coincidencia difusa: prioridad baja
    
    if not votos:
        return None

    # Seleccionar campo con más votos
    max_clave = max(votos, key=votos.get)
    max_votos = votos[max_clave]

    # Verificar si es el único con ese máximo y si tiene un puntaje mínimo razonable.
    # El umbral de 2 asegura que al menos hubo una coincidencia de token contenido o 2 difusas.
    claves_con_mismo_voto = [k for k, v in votos.items() if v == max_votos]
    if len(claves_con_mismo_voto) == 1 and max_votos >= 2: 
        return max_clave

    return None

def detectar_fila_cabecera(df, max_filas=15, puntaje_minimo=6):
    """
    Detecta la fila de cabecera basada en un análisis ponderado:
    - Campos clave encontrados (usando nombres estandarizados)
    - Completitud de la fila
    - Presencia de campos críticos (como código y descripción)
    
    Retorna el índice de fila si la detección es suficientemente fuerte. De lo contrario, None.
    """

    def puntuar_fila(fila):
        valores_validos = [str(c).strip() for c in fila if pd.notna(c) and str(c).strip() != ""]
        total_columnas = len(fila)
        completitud = len(valores_validos) / total_columnas if total_columnas > 0 else 0

        campos_detectados = set()
        # Pesos para campos críticos en la detección de cabecera.
        # ¡Usar los nombres estandarizados de CAMPOS_CLAVE aquí!
        pesos = {
            "codigo_producto": 3,
            "codigo_barras": 3,
            "descripcion": 3,
            "precio_compra_unitario": 2, 
            "precio_compra_con_iva": 2,
            "precio_compra_sin_iva": 2,
            "precio_compra_sugerido": 1,
            "presentacion": 1,
            "stock": 1,
            "categoria": 1,
            "unidad_medida_producto": 1,
        }
        puntaje = 0

        for celda in valores_validos:
            campo = encontrar_campo(celda) # encontrar_campo ya usa CAMPOS_CLAVE globalmente
            if campo:
                campos_detectados.add(campo)
                puntaje += pesos.get(campo, 1) # Si el campo no tiene un peso específico, usa 1

        # Penalización si hay muy pocos campos no vacíos
        if completitud < 0.3:
            puntaje *= 0.5

        return puntaje, campos_detectados

    mejor_puntaje = 0
    mejor_idx = None
    detalle = []

    for i in range(min(len(df), max_filas)):
        fila = df.iloc[i]
        puntaje, campos_detectados = puntuar_fila(fila)
        detalle.append((i, puntaje, campos_detectados))

        if puntaje > mejor_puntaje:
            mejor_puntaje = puntaje
            mejor_idx = i

    if mejor_puntaje >= puntaje_minimo:
        print(f"✅ Fila {mejor_idx} seleccionada como cabecera con puntaje {mejor_puntaje:.2f}")
        return mejor_idx
    else:
        print("⚠️ No se encontró una fila con suficiente evidencia de ser cabecera.")
        return None
