from rest_framework import serializers
from creacion_y_gestion_de_productos.models.models_type import ProductoTipo

class ProductTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductoTipo
        fields = ['id', 'tipo']