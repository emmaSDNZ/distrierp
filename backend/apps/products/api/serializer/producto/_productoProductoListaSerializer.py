from rest_framework import serializers
from ....models.producto.productoProductoModel import ProductoProductoModel
from ....models.producto.productoTemplateModel import ProductoTemplateModel


class ProductoProductoPreciosActualesSerializer(serializers.ModelSerializer):
    precio_venta_actual = serializers.SerializerMethodField()
    precio_compra_actual = serializers.SerializerMethodField()
    precio_base_actual = serializers.SerializerMethodField()

    class Meta:
        model = ProductoProductoModel
        fields = [
            'id_producto_producto',
            'descripcion',
            'id_producto_template',
            'codigo_interno',
            'sku',
            'presentacion',
            'unidad_medida',
            'codigo_producto',
            'codigo_ncm',
            'codigo_niprod',
            'codigo_referencia',
            'codigo_barras',
            'precio_venta_actual',
            'precio_compra_actual',
            'precio_base_actual',
        ]

    def get_precio_venta_actual(self, obj):
        ultimo = obj.precio_venta.order_by('-_create_date').first()
        if ultimo:
            return {
                "_id_precio_venta": ultimo._id_precio_venta,
                "_precio_unitario": ultimo._precio_unitario,
                "_create_date": ultimo._create_date
            }
        return None

    def get_precio_base_actual(self, obj):
        ultimo = obj.precio_base.order_by('-_create_date').first()
        if ultimo:
            return {
                "_id_precio_base": ultimo._id_precio_base,
                "_precio_base": float(ultimo._precio_unitario),
                "_create_date": ultimo._create_date
            }
        return None

    def get_precio_compra_actual(self, obj):
        ultimo = obj.precio_compra.order_by('-_create_date').first()
        if ultimo:
            return {
                "_id_precio_compra": ultimo._id_precio_compra,
                "_precio_compra_unitario": float(ultimo._precio_compra_unitario),
                "_precio_compra_con_iva": float(ultimo._precio_compra_con_iva),
                "_precio_compra_sin_iva": float(ultimo._precio_compra_sin_iva),
                "_precio_compra_sugerido": float(ultimo._precio_compra_sugerido),
                "_create_date": ultimo._create_date
            }
        return None


class ProductoTemplateConProductosSerializer(serializers.ModelSerializer):
    producto_productos = ProductoProductoPreciosActualesSerializer(many=True, read_only=True)

    class Meta:
        model = ProductoTemplateModel
        fields = [
            'id_producto_template',
            'nombre_base_producto',
            'principio_activo',
            'create_date',
            'producto_productos'
        ]


class ProductoProductoConDetallesSerializer(serializers.ModelSerializer):
    precio_venta_actual = serializers.SerializerMethodField()
    precio_compra_actual = serializers.SerializerMethodField()
    precio_base_actual = serializers.SerializerMethodField()

    class Meta:
        model = ProductoProductoModel
        fields = [
            'id_producto_producto',
            'codigo_interno',
            'sku',
            'descripcion',
            'presentacion',
            'unidad_medida',
            'codigo_producto',
            'codigo_ncm',
            'codigo_niprod',
            'codigo_referencia',
            'codigo_barras',
            'precio_venta_actual',
            'precio_compra_actual',
            'precio_base_actual',
        ]

    def get_precio_venta_actual(self, obj):
        ultimo = obj.precio_venta.order_by('-_create_date').first()
        if ultimo:
            return {
                "_id_precio_venta": ultimo._id_precio_venta,
                "_precio_unitario": ultimo._precio_unitario,
                "_create_date": ultimo._create_date
            }
        return None

    def get_precio_compra_actual(self, obj):
        ultimo = obj.precio_compra.order_by('-_create_date').first()
        if ultimo:
            return {
                "_id_precio_compra": ultimo._id_precio_compra,
                "_precio_compra_unitario": float(ultimo._precio_compra_unitario),
                "_precio_compra_con_iva": float(ultimo._precio_compra_con_iva),
                "_precio_compra_sin_iva": float(ultimo._precio_compra_sin_iva),
                "_precio_compra_sugerido": float(ultimo._precio_compra_sugerido),
                "_create_date": ultimo._create_date
            }
        return None

    def get_precio_base_actual(self, obj):
        ultimo = obj.precio_base.order_by('-_create_date').first()
        if ultimo:
            return {
                "_id_precio_base": ultimo._id_precio_base,
                "_precio_base": float(ultimo._precio_unitario),
                "_create_date": ultimo._create_date
            }
        return None
