import pandas as pd
from rest_framework import status
from rest_framework.response import Response

def successUserFile (file, user=None): 
    if not file:
        return Response({
                "success": False,
                "message": "No se ha proporcionado ningún archivo.",
                "data": None
            }, status=status.HTTP_400_BAD_REQUEST)

        # Validar ID del proveedor
    if not user:
        return Response({
                "success": False,
                "message": "No se ha proporcionado un ID de proveedor.",
                "data": None
            }, status=status.HTTP_400_BAD_REQUEST)
    
    return file, user


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