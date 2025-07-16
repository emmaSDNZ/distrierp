from rest_framework import serializers
from ....models.precio._precioCompraModel import PrecioCompraModel

class PrecioCompraSerializer(serializers.ModelSerializer):
    class Meta:
        model = PrecioCompraModel
        fields = [
            '_id_precio_compra',
            '_create_date',
            'id_producto_producto',
            '_precio_compra_unitario',
            "_precio_compra_con_iva",
            "_precio_compra_sin_iva",
            "_precio_compra_sugerido"

        ]