# apps/products/serializers/auditoria.py
from rest_framework import serializers
from apps.products.models.recordAuditModel import RecordAuditModel

class RecordAuditSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecordAuditModel
        fields = '__all__'