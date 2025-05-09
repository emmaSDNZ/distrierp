from rest_framework import serializers  
from apps.products.models.attributeModel import NameAttribute, ValueAttribute, ProductAttribute

class NameAttributeSerializer(serializers.ModelSerializer):
    class Meta: 
        model = NameAttribute
        fields = '__all__'

class ValueAttributeSerializer(serializers.ModelSerializer):
    attribute_name = serializers.CharField(source='attribute.name', read_only=True)
    class Meta: 
        model= ValueAttribute
        fields = '__all__'
        
class ProductAttributeSerializer(serializers.ModelSerializer):
    class Meta: 
        model: ProductAttribute
        fields = '__all__'