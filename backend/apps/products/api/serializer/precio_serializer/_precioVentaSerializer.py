from rest_framework import serializers
from ....models.precio._precioVentaModel import PrecioVentaModel

class PrecioVentaSerializer(serializers.ModelSerializer):
    class Meta:
        model = PrecioVentaModel
        fields = [
            '_id_precio_venta',
            '_precio_unitario',
            'id_producto_producto',
            '_create_date',
        ]
        read_only_fields = ['_id_precio_venta', '_create_date']