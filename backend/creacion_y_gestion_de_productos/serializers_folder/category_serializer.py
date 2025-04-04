from rest_framework import serializers

from creacion_y_gestion_de_productos.models.models_category import ProductCategory

class CategorySerializer(serializers.ModelSerializer):
    parent_name = serializers.CharField(source='parent.name', read_only=True)
    
    class Meta:
        model = ProductCategory
        fields = ('id', 'name', 'parent','parent_name', 'created_at')
        read_only_fields = ('id', 'created_at')
