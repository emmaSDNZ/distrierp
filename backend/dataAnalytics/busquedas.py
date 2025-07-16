import pandas as pd

from dataAnalytics.utils.campos import encontrar_campo

CAMPOS_CLAVE = {
    "codigo": ["codigo", "código", "cod", "ean", "código_de_producto", "cod_prod"],
    "descripcion": ["descripcion", "descripción", "producto", "nombre"],
    "presentacion": ["presentacion", "presentación", "contenido", "formato"],
    "precio": ["precio", "precio_sin_iva", "precio_lista", "pc_lista", "pc_desc", "valor"]
}


def getBusquedaCabeceraColumna(dicc):
    print("ESTO ES DIC ")

    for table, df in dicc.items():
        print(df)
        print(f"ANALIZANDO TABLA: {table}")
        print(df.keys())
        for columna in df.keys():
            campo = encontrar_campo(columna,CAMPOS_CLAVE)
            print(f"COLUMNA: {columna}")
            if campo:
                print(f"🧪-> Coincidencia: '{columna}' se asocia con el campo clave '{campo}'")
            else:
                print(" -> No se encontró coincidencia representativa")
