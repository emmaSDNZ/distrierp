from rest_framework import serializers
from ....models.precio._precioBaseModel import PrecioBaseModel

class PrecioBaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = PrecioBaseModel
        fields = [
            '_id_precio_base',
            '_precio_unitario',
            '_create_date',
            'id_producto_producto',
        ]