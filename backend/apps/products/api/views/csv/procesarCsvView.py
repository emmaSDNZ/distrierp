from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import generics, serializers
from dataAnalytics.services.procesarCsv import procesar_csv

class CSVProcesarSerializer(serializers.Serializer):
    file = serializers.FileField()
    df = serializers.JSONField()
    id_proveedor = serializers.IntegerField()


class ProcesarCSVAPIView(generics.CreateAPIView):
    parser_classes = [MultiPartParser, FormParser]
    serializer_class = CSVProcesarSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            
            return Response({
                "success": False,
                "message": "Datos inválidos.",
                "errors": serializer.errors
            }, status=400)

        file = serializer.validated_data['file']
        json_proveedor = serializer.validated_data['df']
        id_proveedor = serializer.validated_data['id_proveedor']
        print(json_proveedor)
        resultado = procesar_csv(json_proveedor, id_proveedor)

        # Validamos que haya productos en la base del sistema
        if not resultado["sistema"]["data"]:
            return Response({
                "success": False,
                "message": "No hay productos en la base de datos para este proveedor.",
            }, status=404)

        return Response({
            "success": True,
            "message": "Archivo recibido y datos procesados correctamente.",
            "file_name": file.name,
            "id_proveedor": id_proveedor,
            "sample_proveedor": resultado["proveedor"]["data"][:3],  # muestra primeras 3 filas del proveedor
            "resultado": resultado
        })
