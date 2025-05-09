from rest_framework import serializers
from apps.products.models.supplierPoductModel import SupplierProduct
from apps.products.models.userModel import User
from apps.products.models.productModel import Product
from apps.products.api.serializer.usersSerializer import UserSerializer, User
from apps.products.api.serializer.productSerializer import ProductSimpleFilterSerializer

class SupplierSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = User  # Asegurate de importar tu modelo
        fields = ['id', 'name']
        
class SupplierProductCreateSerializer(serializers.ModelSerializer):
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(),
        required=True
    )
    supplier_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        required=True
    )

    class Meta:
        model = SupplierProduct
        fields = '__all__'


class SupplierProductListSerializer(serializers.ModelSerializer):
    product_id = ProductSimpleFilterSerializer()  # Serializa el producto completo
    supplier_id = UserSerializer()   # Serializa el proveedor completo

    class Meta:
        model = SupplierProduct
        fields = '__all__'  # Incluir todos los campos, incluyendo los detalles del producto y proveedor


