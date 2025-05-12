from rest_framework import serializers
from apps.products.models.models import MeasureUnit
from apps.products.models.typeProductModel import TypeProduct
from apps.products.models.categoryModel import Category
from apps.products.models.productModel import Product

class MeasureUnitSerializer(serializers.ModelSerializer):
    class Meta:
        model = MeasureUnit
        fields = ["id", "description"]

class TypeProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = TypeProduct
        fields = ["id", "type_product"]

class CategorySerializer(serializers.ModelSerializer):
    subcategories = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ["id", "name", "parent", "subcategories"]

    def get_subcategories(self, obj):
        return CategorySerializer(obj.get_subcategories(), many=True).data

class ProductImportSerializer(serializers.ModelSerializer):
    # Para escritura
    measure_unit = serializers.PrimaryKeyRelatedField(queryset=MeasureUnit.objects.all(), write_only=True, required=False)
    type_product = serializers.PrimaryKeyRelatedField(queryset=TypeProduct.objects.all(), write_only=True, required=False)
    categories = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all(), many=True, write_only=True, required=False)

    # Para lectura
    measure_unit_detail = MeasureUnitSerializer(source='measure_unit', read_only=True)
    type_product_detail = TypeProductSerializer(source='type_product', read_only=True)
    categories_detail = CategorySerializer(source='categories', many=True, read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'description', 'presentation', 'price', 'price_sale', 'price_cost',
            'reference_code', 'bar_code', 'internal_code', 'proveedor_code', 'ncm_code', 'niprod_code',
            'measure_unit', 'measure_unit_detail',
            'type_product', 'type_product_detail',
            'categories', 'categories_detail'
        ]

    def create(self, validated_data):
        categories_data = validated_data.pop("categories", [])
        product = Product.objects.create(**validated_data)
        product.add_categories(categories_data)
        return product

    def update(self, instance, validated_data):
        categories_data = validated_data.pop("categories", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if categories_data is not None:
            instance.add_categories(categories_data)
        return instance