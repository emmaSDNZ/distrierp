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
    """Lee un archivo CSV o Excel y lo convierte en un DataFrame."""
    try:
        if file.name.endswith('.csv'):
            return pd.read_csv(file)
        elif file.name.endswith(('.xls', '.xlsx')):
            return pd.read_excel(file)
        else:
            return None
    except Exception as e:
        print(f"Error al leer archivo: {e}")
        return None
    