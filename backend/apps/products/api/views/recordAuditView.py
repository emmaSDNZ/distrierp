# apps/products/views/auditoria.py
from rest_framework import generics
from apps.products.models.recordAuditModel import RecordAuditModel
from apps.products.api.serializer.recordAuditSerializer import RecordAuditSerializer

class RecordAuditListAPIView(generics.ListAPIView):
    queryset = RecordAuditModel.objects.all().order_by('-fecha_hora')
    serializer_class = RecordAuditSerializer
    