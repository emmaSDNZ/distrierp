from rest_framework import serializers
from apps.products.models.models import CategoryProduct,MeasureUnit
from apps.products.models.typeProductModel import TypeProduct

class MeasureUnitSerializer(serializers.ModelSerializer):
    class Meta:
        model = MeasureUnit 
        fields = ["id", "description"]

class CategoryProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = CategoryProduct 
        fields = '__all__'


class TypeProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = TypeProduct
        fields = ["id", "type_product"]