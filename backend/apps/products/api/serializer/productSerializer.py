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
        fields = ["id",'name', "description", "presentation", "niprod_code","bar_code" ,"proveedor_code", "price", "price_sale", "price_cost"]


class ProductSerializer(serializers.ModelSerializer):

    measure_unit = MeasureUnitSerializer()
    type_product = TypeProductSerializer()
    categories = CategorySerializer(many=True, required=False)
    
    class Meta:
        model = Product 
        fields = '__all__'


class ProductWriteSerializer(serializers.ModelSerializer):

    measure_unit = serializers.PrimaryKeyRelatedField(
        queryset=MeasureUnit.objects.all(),
        required=False,
        allow_null=True
    )
    type_product = serializers.PrimaryKeyRelatedField(
        queryset=TypeProduct.objects.all(),
        required=False,
        allow_null=True
    )
    categories = serializers.ListField(
        child=serializers.DictField(),
        required=False,
        allow_empty=True
    )
    class Meta:
        model = Product
        fields = '__all__'

    
    def _handle_categories(self, product, categories_data):
        if not categories_data:
            default_category = Category.get_default_category()
            product.categories.add(default_category)
            return

        for cat in categories_data:
            category = None
            if "id" in cat:
                category = Category.objects.filter(id=cat["id"]).first()
            elif "name" in cat:
                category, _ = Category.objects.get_or_create(name=cat["name"])
            if category:
                product.categories.add(category)

                
    def create(self, validated_data):

        # Verificamos y asignamos un type_product si no viene
        if not validated_data.get('type_product'):
            default_type, _ = TypeProduct.objects.get_or_create(type_product='consumible')
            validated_data['type_product'] = default_type

        # Extraemos las categorías si vienen
        categories_data = validated_data.pop('categories', [])

        # Creamos el producto
        product = super().create(validated_data)
        # Si no se mandaron categorías, asignamos la categoría por defecto 'All'
        self._handle_categories(product, categories_data)
        return product
    
    def update(self, instance, validated_data):
        categories_data = validated_data.pop('categories', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if categories_data is not None:
            # Limpiamos relaciones actuales
            instance.categories.clear()
            # Si no se mandaron categorías, asignamos la categoría por defecto 'All'
            self._handle_categories(instance, categories_data)
        return instance
    

