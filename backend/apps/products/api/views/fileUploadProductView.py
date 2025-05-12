import io
import pandas as pd
from rest_framework import generics, status
from django.http import HttpResponse
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
import pandas as pd
import json
from io import BytesIO
from apps.products.api.serializer.fileUploadProductSerializer import FileUploadProductSerializer
from apps.products.models.fileUploadProductModel import FileUploadProductModel
from apps.products.models.userModel import User 
from apps.products.utils.services import successUserFile, readFile
from dataAnalytics.utils.preProcessing import successColumns, dfProcessing
from  dataAnalytics.services import get_supplier_product_df

class FileUploeadProductListAPIView(generics.ListAPIView):
    serializer_class = FileUploadProductSerializer
    queryset = FileUploadProductModel.objects.all()

    def get(self, request, *args, **kwargs):
        upload_file_product = self.get_queryset()
        serializer = self.get_serializer(upload_file_product, many=True)
        return Response({
            "success": True,
            "message": "Lista de relaciones File Producto-Proveedor obtenida correctamente.",
            "data": serializer.data
        }, status=status.HTTP_200_OK)



class FileUploeadProductVeryfyAPIView(generics.CreateAPIView):
    parser_classes = (MultiPartParser, FormParser)
    serializer_class = FileUploadProductSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        file_obj = request.FILES.get('file_product')
        user_id = request.data.get('name_supplier_id')

        file_obj, user_id = successUserFile(file_obj, user_id)

        try:
            if file_obj.name.endswith('.csv'):
                df = pd.read_csv(file_obj)
            elif file_obj.name.endswith(('.xls', '.xlsx')):
                df = pd.read_excel(file_obj)
            else:
                return Response({
                    "success": False,
                    "message": "Formato de archivo no soportado.",
                    "data": None
                }, status=status.HTTP_400_BAD_REQUEST)

            df, messages, valido = successColumns(df)
            if not valido:
                return Response({
                    "success": False,
                    "message": messages,
                    "data": None
                }, status=status.HTTP_400_BAD_REQUEST)

        except User.DoesNotExist:
            return Response({
                "success": False,
                "message": f"No existe un usuario con ID {user_id}",
                "data": None
            }, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({
                "success": False,
                "message": f"Error al procesar el archivo: {str(e)}",
                "data": None
            }, status=status.HTTP_400_BAD_REQUEST)

        return Response({
            "success": True,
            "message": "Validación correcta del archivo.",
            "data": {
                "name_supplier_id": user_id,
                "file": file_obj.name
            },
        }, status=status.HTTP_201_CREATED)


class FileUploeadProductCreateAPIView(generics.CreateAPIView):
    parser_classes = (MultiPartParser, FormParser)
    serializer_class = FileUploadProductSerializer

    def post(self, request):
        # 1. Validar datos del request
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # 2. Obtener archivo y proveedor
        file_obj = request.FILES.get('file_product')
        user_id = request.data.get('name_supplier_id')

        file_obj, user_id = successUserFile(file_obj, user_id)

        try:
            # 3. Verificar existencia del usuario
            name_supplier = User.objects.get(id=user_id)

            # 4. Leer archivo original a DataFrame
            df = readFile(file_obj)
            if df is None:
                return Response({
                    "success": False,
                    "message": "Formato de archivo no soportado.",
                    "data": None
                }, status=status.HTTP_400_BAD_REQUEST)

            df = df.reset_index(drop=True)

            # 5. Validar columnas
            df, messages, valido = successColumns(df)
            if not valido:
                return Response({
                    "success": False,
                    "message": messages,
                    "data": None
                }, status=status.HTTP_400_BAD_REQUEST)

            # 6. Obtener el DataFrame de la base de datos
            df_db, _ = get_supplier_product_df(supplier_id=name_supplier)

            # 7. Procesar el DataFrame
            df_processing = dfProcessing(df, df_db)

            # Verificar si df_processing contiene datos
            if df_processing.empty:
                return Response({
                    "success": False,
                    "message": "El DataFrame procesado está vacío.",
                    "data": None
                }, status=status.HTTP_400_BAD_REQUEST)

            # 8. Generar el archivo Excel para descarga
            output = BytesIO()
            with pd.ExcelWriter(output, engine='xlsxwriter') as writer:
                df_processing.to_excel(writer, index=False)
            output.seek(0)

            # Crear la respuesta para la descarga
            response = HttpResponse(
                output,
                content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            )
            response['Content-Disposition'] = 'attachment; filename=archivo_procesado.xlsx'

            return response

        except User.DoesNotExist:
            return Response({
                "success": False,
                "message": f"No existe un usuario con ID {user_id}",
                "data": None
            }, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({
                "success": False,
                "message": f"Error al procesar el archivo: {str(e)}",
                "data": None
            }, status=status.HTTP_400_BAD_REQUEST)