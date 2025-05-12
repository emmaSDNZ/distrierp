from rest_framework import serializers
from apps.products.models.models import MeasureUnit
from apps.products.models.productModel import Product
from apps.products.models.typeProductModel import TypeProduct
from apps.products.models.categoryModel import Category
from apps.products.api.serializer.generalSerializer import MeasureUnitSerializer
from apps.products.api.serializer.generalSerializer import TypeProductSerializer
from apps.products.api.serializer.categorySerializer import CategorySerializer



class ProductSimpleFilterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product  # Asegurate de importar tu modelo
        fields = ["id",
                  'name', 
                  "description", 
                  "presentation", 
                  "niprod_code",
                  "bar_code" ,
                  "proveedor_code", 
                  "price", 
                  "price_sale", 
                  "price_cost"
                  ]


class ProductSerializer(serializers.ModelSerializer):
    measure_unit = MeasureUnitSerializer()
    type_product = TypeProductSerializer()
    categories = CategorySerializer(many=True, required=False)
    
    class Meta:
        model = Product 
        fields = '__all__'


class ProductWriteSerializer(serializers.ModelSerializer):
    measure_unit = serializers.PrimaryKeyRelatedField(
        queryset=MeasureUnit.objects.all(), required=False, allow_null=True
    )
    type_product = serializers.PrimaryKeyRelatedField(
        queryset=TypeProduct.objects.all(), required=False, allow_null=True
    )
    categories = serializers.ListField(
        child=serializers.DictField(), required=False, allow_empty=True
    )

    class Meta:
        model = Product
        fields = '__all__'

    def create(self, validated_data):
        categories_data = validated_data.pop('categories', [])
        
        if not validated_data.get('type_product'):
            validated_data['type_product'] = TypeProduct.get_default_type_product()
        
        product = super().create(validated_data)
        product.add_categories(categories_data)
        return product

    def update(self, instance, validated_data):
        categories_data = validated_data.pop('categories', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if categories_data is not None:
            instance.add_categories(categories_data)
        return instance

