from rest_framework import serializers
from creacion_y_gestion_de_productos.models.models_price import     ProductoPrecio, \
                                                                    ProductoPrecioVenta, \
                                                                    ProductoPrecioCoste

class ProductoPrecioVentaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductoPrecioVenta
        fields = ("id", "precio_venta", "created_at")
        read_only_fields= ("id", "created_at")

class ProductoPrecioCosteSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductoPrecioCoste
        fields = ("id", "precio_coste", "created_at")
        read_only_fields= ("id", "created_at")

class ProductoPrecioSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductoPrecio
        fields = ("id", "precio", "created_at")
        read_only_fields= ("id", "created_at")