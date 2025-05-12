from rest_framework.views import APIView

from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
import pandas as pd
import numpy as np
from unidecode import unidecode
from dataAnalytics.utils.preProcessing import successColumns
import math

from apps.products.api.serializer.importProductsSerializer import ProductImportSerializer

class ProductCreateImportAPIView(APIView):

    def post(self, request, *args, **kwargs):
        # Usamos el serializador para validar y crear el producto
        serializer = ProductImportSerializer(data=request.data)
        if serializer.is_valid():
            product = serializer.save()
            print("Producto ID:", product.id)
            print("Datos serializados:", ProductImportSerializer(product).data)
            return Response(
                ProductImportSerializer(product).data, 
                status=status.HTTP_201_CREATED
                )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

def clean_for_json(data):
    if isinstance(data, list):
        return [clean_for_json(d) for d in data]
    elif isinstance(data, dict):
        return {k: clean_for_json(v) for k, v in data.items()}
    elif isinstance(data, float) and (math.isnan(data) or math.isinf(data)):
        return None
    return data


class ImportarProductosAPIView(APIView):

    parser_classes = (MultiPartParser, FormParser)
    def post(self, request, *args, **kwargs):
        file_obj = request.FILES.get('file_product')
        if file_obj is None:
            return Response({
                "error": "No se recibió el archivo. Usa la clave 'file_product'."
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            if file_obj.name.endswith('.csv'):
                df = pd.read_csv(file_obj)
            elif file_obj.name.endswith('.xlsx'):
                df = pd.read_excel(file_obj)
            else:
                return Response({
                    "error": "Formato de archivo no soportado. Usa .csv o .xlsx"
                }, status=status.HTTP_400_BAD_REQUEST)

            df = df.reset_index(drop=True)
            df.columns = [unidecode(col.strip().lower()) for col in df.columns]

            for col in df.select_dtypes(include=['object']):
                df[col] = df[col].map(lambda x: unidecode(str(x).lower()) if isinstance(x, str) else x)

            df = df.dropna(how='all')
            df = df.dropna(axis=1, how='all')
            print("Columnas detectadas:", df.columns)

            columnas_obligatorias = ['name', 'price']
            columnas_presentes = [col for col in columnas_obligatorias if col in df.columns]

            if columnas_presentes:
                df_nuevo = df[columnas_presentes].copy()

                if 'price' in df_nuevo.columns:
                    # Reemplaza valores no numéricos explícitos
                    df_nuevo['price'] = df_nuevo['price'].replace('-', np.nan)
                    
                    # Convierte a numérico (int o float); si no se puede, queda como NaN
                    df_nuevo['price'] = pd.to_numeric(df_nuevo['price'], errors='coerce')
                    
                    # Opcional: elimina filas con price NaN (valores no numéricos)
                    df_nuevo = df_nuevo[~df_nuevo['price'].isna()]

                print("Preview JSON del dataframe:\n", df_nuevo.to_json(orient='records'))

                productos_creados = []
                for _, fila in df_nuevo.iterrows():
                    data = {}
                    if 'name' in fila:
                        data["name"] = fila["name"]
                    if 'price' in fila and not pd.isna(fila["price"]):
                        data["price"] = float(fila["price"])

                    print("Datos a validar:", data)
                    serializer = ProductImportSerializer(data=data)

                    if serializer.is_valid():
                        serializer.save()
                        productos_creados.append(serializer.data)
                    else:
                        print(f"Error con los datos: {serializer.errors}")
                        continue

                return Response({
                    "mensaje": "Productos creados correctamente",
                    "productos_creados": clean_for_json(productos_creados)
                }, status=status.HTTP_200_OK)

            return Response({
                "error": "Faltan columnas obligatorias: 'name' y/o 'price'"
            }, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({
                "error": f"Error al leer el archivo: {str(e)}"
            }, status=status.HTTP_400_BAD_REQUEST)