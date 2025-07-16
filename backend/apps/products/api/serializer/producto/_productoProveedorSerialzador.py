from rest_framework import serializers
from ....models.producto.productoProductoModel import ProductoProductoModel
from ....models.producto._productoProveedor import ProductoProveedorModel
from ....models.usuarios._proveedorModel import ProveedorModel
from ._productoSerializer import ProductoProductoSerializer
from ..serialier_usuarios._usuariosSerializer import ProveedorSerializer

class ProductoProveedorSerializer(serializers.ModelSerializer):
    # Enviamos los IDs
    id_producto_producto = serializers.PrimaryKeyRelatedField(
        queryset=ProductoProductoModel.objects.all(),
        write_only=True
    )
    id_proveedor = serializers.PrimaryKeyRelatedField(
        queryset=ProveedorModel.objects.all(),
        write_only=True
    )

    # Mostramos los objetos completos en la respuesta
    producto = ProductoProductoSerializer(source='id_producto_producto', read_only=True)
    proveedor = ProveedorSerializer(source='id_proveedor', read_only=True)

    class Meta:
        model = ProductoProveedorModel
        fields = [
            'id_producto_proveedor',
            'id_producto_producto',  # write_only
            'id_proveedor',          # write_only
            'producto',              # read_only
            'proveedor',             # read_only
            'codigo_proveedor'
        ]
