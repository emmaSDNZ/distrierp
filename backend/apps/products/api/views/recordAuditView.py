# apps/products/views/auditoria.py
from rest_framework import generics
from rest_framework import status
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend

from apps.products.models.recordAuditModel import RecordAuditModel
from apps.products.api.serializer.recordAuditSerializer import RecordAuditSerializer
from apps.products.utils.filter.auditFilter import RecordAuditFilter

class RecordAuditListAPIView(generics.ListAPIView):
    queryset = RecordAuditModel.objects.all().order_by('-fecha_hora')
    serializer_class = RecordAuditSerializer
    filter_backends = (DjangoFilterBackend,)
    filterset_class = RecordAuditFilter  

    def get_queryset(self):
        queryset = super().get_queryset()
        name = self.request.query_params.get('name', None)
        if name:
            queryset = queryset.filter(registro_nombre__icontains=name)  # Ajusta el campo según tu modelo
        return queryset
    
class RecordAuditDetailAPIView(generics.RetrieveAPIView):
    queryset = RecordAuditModel.objects.all()

    serializer_class = RecordAuditSerializer

    def get(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance)
            return Response({
            "success": True,
            "message": "Detalles de movimientos del producto obtenido correctamente.",
            "data": serializer.data
        }, status=status.HTTP_200_OK)

        except RecordAuditSerializer.DoesNotExist:
            return Response({
            "success": False,
            "message": "Los detalles para el producto no existe.",
            "data": {}  # En caso de no encontrar el producto, devolvemos un objeto vacío
        }, status=status.HTTP_404_NOT_FOUND)