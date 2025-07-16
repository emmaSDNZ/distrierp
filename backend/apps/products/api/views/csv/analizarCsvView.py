from rest_framework.parsers import MultiPartParser, JSONParser
from rest_framework.response import Response
from rest_framework import serializers, generics
import pandas as pd
from dataAnalytics.services.services import get_df_form_csv

class CSVUploadSerializer(serializers.Serializer):
    file = serializers.FileField(required=False)
    df = serializers.JSONField(required=False)

def obtener_resultado_json(entrada):
    resultado = {}
    for nombre_hoja, df in entrada.items():
        df = df.fillna("")
        try:
            datos = df.to_dict(orient="records")
        except Exception as e:
            raise ValueError(f"Error al convertir DataFrame a dict: {e}")

        resultado["df"] = {
            "columnas": df.columns.tolist(),  # convertir a lista para JSON
            "datos": datos
        }
    return resultado

class AnalizarCSVAPIView(generics.CreateAPIView):
    parser_classes = [MultiPartParser, JSONParser]  # aceptar ambos tipos

    serializer_class = CSVUploadSerializer

    def create(self, request, *args, **kwargs):
        archivo = request.FILES.get('file')
        json_df = request.data.get("df")

        if archivo:
            entrada = get_df_form_csv(archivo)
        elif json_df:
            entrada = {"df_editado": pd.DataFrame(json_df)}
        else:
            return Response({'error': 'No se recibió archivo ni datos'}, status=400)

        try:
            resultado = obtener_resultado_json(entrada)
            return Response({
                "success": True,
                "message": "Archivo procesado con éxito.",
                **resultado
            })
        except ValueError as e:
            return Response({
                "success": False,
                "message": str(e),
                "data": None
            }, status=400)
        except Exception as e:
            return Response({
                "success": False,
                "message": f"Error inesperado: {str(e)}",
                "data": None
            }, status=500)
