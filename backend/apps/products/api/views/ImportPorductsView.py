from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
import pandas as pd
import numpy as np
from unidecode import unidecode
from dataAnalytics.utils.preProcessing import successColumns
from apps.products.api.serializer.productSerializer import ProductWriteSerializer, ProductSerializer
class ImportarProductosAPIView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        file_obj = request.FILES.get('file_product')

        if file_obj is None:
            return Response({"error": "No se recibió el archivo. Usa la clave 'file_product'."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Primero, verifica el tipo de archivo y luego carga el DataFrame
            if file_obj.name.endswith('.csv'):
                df = pd.read_csv(file_obj)
            elif file_obj.name.endswith('.xlsx'):
                df = pd.read_excel(file_obj)
            else:
                return Response({"error": "Formato de archivo no soportado. Usa .csv o .xlsx"}, status=status.HTTP_400_BAD_REQUEST)

            # Reseteamos el índice después de haber cargado el DataFrame
            df = df.reset_index(drop=True)

            # Normalización de nombres de columnas
            df.columns = [unidecode(col.strip().lower()) for col in df.columns]

            # Normalización de valores de texto
            for col in df.select_dtypes(include=['object']):
                df[col] = df[col].map(lambda x: unidecode(str(x).lower()) if isinstance(x, str) else x)

            # Eliminar filas y columnas completamente vacías
            
            # Eliminar filas y columnas completamente vacías
            df = df.dropna(how='all')
            df = df.dropna(axis=1, how='all')
            print(df.columns)

            # Verificar si las columnas obligatorias están presentes
            columnas_obligatorias = ['nombre', 'descripcion', 'precio']
            columnas_presentes = []

            # Recolectamos las columnas presentes
            for col in columnas_obligatorias:
                if col in df.columns:
                    columnas_presentes.append(col)

            # Si al menos una columna obligatoria está presente, procedemos
            if columnas_presentes:
                # Creamos un nuevo DataFrame con las columnas presentes
                df_nuevo = df[columnas_presentes].copy()

                # Reemplazar los "-" por NaN en la columna 'precio'
                df_nuevo['precio'] = df_nuevo['precio'].replace('-', np.nan)

                # Convertir a numérico (NaN quedará como null en el JSON)
                df_nuevo['precio'] = pd.to_numeric(df_nuevo['precio'], errors='coerce')
                # Ahora el DataFrame debería estar listo
                data_prueba = [{"nombre": "prueba1"}, {"nombre": "prueba2"}, {"nombre": "prueba3"}, {"nombre": "prueba4"}, {"nombre": "prueba5"}]
                df_prueba = pd.DataFrame(data_prueba)

                print(df_prueba.head())  # Verificación de los datos cargados

                productos_creados = []

                # Iteramos por cada fila en el DataFrame de prueba
                for _, fila in df_prueba.iterrows():
                    data = {
                        "name": fila["nombre"],  # Usamos la columna correcta (en este caso "nombre")
                    }
                    print(data)
                    serializer = ProductSerializer(data=data)
                    
                    if serializer.is_valid():
                        serializer.save()
                        productos_creados.append(serializer.data)
                    else:
                        print(f"Error con los datos: {serializer.errors}")  # Diagnóstico de los errores
                        continue

                # Si no hay columnas obligatorias faltantes
                return Response({
                    "mensaje": "Productos creados correctamente",
                    "productos_creados": productos_creados
                }, status=status.HTTP_200_OK)
            # Si el DataFrame es válido, lo puedes convertir a JSON
            # Devolvemos el DataFrame como JSON
            #print(df_nuevo.to_json(orient='records'))
            # Llamamos a la función successColumns y desestructuramos el resultado
            df, messages, valido = successColumns(df)

            # Verificamos si el archivo es válido
            if not valido:
                return Response({
                    "error": "El archivo no es válido.",
                    "mensajes": messages
                }, status=status.HTTP_400_BAD_REQUEST)

            print(df.shape)

            return Response({
                "mensaje": "Archivo leído correctamente",
                "columnas": df_prueba # Devolvemos el DataFrame como JSON
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": f"Error al leer el archivo: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
