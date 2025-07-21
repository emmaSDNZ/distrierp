from rest_framework import serializers
from ....models.producto.productoTemplateModel import ProductoTemplateModel
from ....models.producto.productoProductoModel import ProductoProductoModel
from ....models.precio._precioCompraModel import PrecioCompraModel
columnasProductoProducto = [
    "id_producto_template",
    "id_producto_producto",
    # Identificación
    "codigo_interno",
    "sku", # Coma agregada
    "descripcion",
    "codigo_barras", # Coma agregada
    #Presentacion
    "unidad_medida",
    "presentacion", # Coma agregada
    # Código producto proveedor
    "codigo_producto",
    # Códigos regulatorios
    "codigo_ncm",
    "codigo_niprod", # Coma agregada
    #Inventario/ Referencias
    "codigo_referencia"
]

class ProductoProductoSerializer(serializers.ModelSerializer):
    id_producto_template = serializers.PrimaryKeyRelatedField(
        queryset=ProductoTemplateModel.objects.all()
    )

    class Meta:
        model = ProductoProductoModel
        fields = columnasProductoProducto


class ProductoTemplateSerializer(serializers.ModelSerializer):
    id_producto_producto = serializers.SerializerMethodField()

    # Campos del producto
    descripcion = serializers.CharField(required=False, allow_blank=True)
    codigo_referencia = serializers.CharField(required=False, allow_blank=True)
    codigo_barras = serializers.CharField(required=False, allow_blank=True)
    codigo_interno = serializers.CharField(required=False, allow_blank=True)
    codigo_ncm = serializers.CharField(required=False, allow_blank=True)
    codigo_producto = serializers.CharField(required=False, allow_blank=True)
    codigo_niprod = serializers.CharField(required=False, allow_blank=True)

    # Campos de precios
    _precio_compra_unitario = serializers.DecimalField(required=False, allow_null=True, max_digits=10, decimal_places=2)
    _precio_compra_con_iva = serializers.DecimalField(required=False, allow_null=True, max_digits=10, decimal_places=2)
    _precio_compra_sin_iva = serializers.DecimalField(required=False, allow_null=True, max_digits=10, decimal_places=2)
    _precio_compra_sugerido = serializers.DecimalField(required=False, allow_null=True, max_digits=10, decimal_places=2)

    class Meta:
        model = ProductoTemplateModel
        fields = [
            'id_producto_template',
            'nombre_base_producto',
            'principio_activo',
            'create_date',
            'id_producto_producto',
            'descripcion',
            'codigo_referencia',
            'codigo_barras',
            'codigo_interno',
            'codigo_ncm',
            'codigo_producto',
            'codigo_niprod',
            '_precio_compra_unitario',
            '_precio_compra_con_iva',
            '_precio_compra_sin_iva',
            '_precio_compra_sugerido',
        ]

    def create(self, validated_data):
        # Extraer datos del producto
        descripcion = validated_data.pop('descripcion', 'Sin descripción')
        codigo_referencia = validated_data.pop('codigo_referencia', '')
        codigo_barras = validated_data.pop('codigo_barras', '')
        codigo_interno = validated_data.pop('codigo_interno', '')
        codigo_ncm = validated_data.pop('codigo_ncm', '')
        codigo_producto = validated_data.pop('codigo_producto', '')
        codigo_niprod = validated_data.pop('codigo_niprod', '')


        # Extraer precios
        precio_unitario = validated_data.pop('_precio_compra_unitario', None)
        precio_con_iva = validated_data.pop('_precio_compra_con_iva', None)
        precio_sin_iva = validated_data.pop('_precio_compra_sin_iva', None)
        precio_sugerido = validated_data.pop('_precio_compra_sugerido', None)

        # Crear ProductoTemplate
        producto_template = super().create(validated_data)

        # Crear ProductoProducto
        producto_producto = ProductoProductoModel.objects.create(
            id_producto_template=producto_template,
            descripcion=descripcion,
            codigo_referencia=codigo_referencia,
            codigo_barras=codigo_barras,
            codigo_interno=codigo_interno,
            codigo_ncm=codigo_ncm,
            codigo_producto=codigo_producto,
            codigo_niprod=codigo_niprod
        )

        self._producto_producto = producto_producto

        # Crear precio si alguno fue enviado
        if any([precio_unitario, precio_con_iva, precio_sin_iva, precio_sugerido]):
            PrecioCompraModel.objects.create(
                id_producto_producto=producto_producto,
                _precio_compra_unitario=precio_unitario or 0,
                _precio_compra_con_iva=precio_con_iva or 0,
                _precio_compra_sin_iva=precio_sin_iva or 0,
                _precio_compra_sugerido=precio_sugerido or 0
            )

        return producto_template

    def get_id_producto_producto(self, obj):
        producto_producto = getattr(self, '_producto_producto', None)
        if producto_producto and producto_producto.id_producto_template == obj:
            return producto_producto.id_producto_producto
        try:
            return ProductoProductoModel.objects.get(id_producto_template=obj).id_producto_producto
        except ProductoProductoModel.DoesNotExist:
            return None
