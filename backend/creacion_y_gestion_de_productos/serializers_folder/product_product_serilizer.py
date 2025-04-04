from rest_framework import serializers
from creacion_y_gestion_de_productos.models.models_product_product import ProductAttribute
from creacion_y_gestion_de_productos.models.models_product import Producto
from creacion_y_gestion_de_productos.models.models_attribute import AttributeNameValue
from .product_serializer import ProductSerializer
from .attribute_serializer import AttributeNameValueSerializer

class ProductAttributeSerializer(serializers.ModelSerializer):
    product = serializers.PrimaryKeyRelatedField(queryset=Producto.objects.all())
    attribute_values = serializers.PrimaryKeyRelatedField(queryset=AttributeNameValue.objects.all(),  many=True)

    class Meta:
        model = ProductAttribute
        fields = '__all__'

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['attribute_values'] = AttributeNameValueSerializer(instance.attribute_values, many=True).data
        representation['product'] = ProductSerializer(instance.product).data
        return representation