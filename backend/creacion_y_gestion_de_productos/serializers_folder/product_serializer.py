from rest_framework import serializers
from creacion_y_gestion_de_productos.models.models_product import Producto
from creacion_y_gestion_de_productos.models.models_type import ProductoTipo


from creacion_y_gestion_de_productos.models.models_category import ProductCategory
from creacion_y_gestion_de_productos.models.models_price import (
    ProductoPrecio, 
    ProductoPrecioVenta, 
    ProductoPrecioCoste)
from creacion_y_gestion_de_productos.serializers_folder.price_serializer import (
    ProductoPrecioSerializer, 
    ProductoPrecioVentaSerializer, 
    ProductoPrecioCosteSerializer
    )

from creacion_y_gestion_de_productos.serializers_folder.type_serializer import ProductTypeSerializer
from creacion_y_gestion_de_productos.serializers_folder.category_serializer import CategorySerializer


class ProductSerializer(serializers.ModelSerializer):
    precio = ProductoPrecioSerializer()
    precio_venta = ProductoPrecioVentaSerializer()
    precio_coste = ProductoPrecioCosteSerializer()
    
    tipo_producto = ProductTypeSerializer(read_only=True)
    tipo_producto_id = serializers.PrimaryKeyRelatedField(queryset=ProductoTipo.objects.all(),
        source='tipo_producto',
        write_only=True)

    categoria = CategorySerializer(read_only=True)
    categoria_id = serializers.PrimaryKeyRelatedField(queryset=ProductCategory.objects.all(),
        source='categoria',
        write_only=True)
    
    
    class Meta:
        model = Producto
        fields = (
            'id', 
            'nombre', 
            'descripcion', 
            'presentacion', 
            'done', 
            'created_at',
            'tipo_producto',  
            'tipo_producto_id', 
            'categoria', 
            'categoria_id', 
            'precio',
            'precio_venta',
            'precio_coste',
            'referencia',
            'cod_barras',
            'cod_prod_interno',
            'cod_prod_proveedor',
            'cod_ncm'
        )
        read_only_fields = ('id', 'created_at')

    def validate_categoria_id(self, value):
        """Si no se envía una categoría, asigna la categoría 'All' por defecto."""
        if not value:
            return ProductCategory.get_default_category()
        return value    

    def validate_tipo_producto(self, value):
        print(f"Valor recibido para tipo_producto: {value}")  # Depuración
        
        try:
            tipo_producto = ProductoTipo.objects.get(id=value.id)
            print(f"Tipo de producto encontrado: {tipo_producto}")  # Depuración
        except ProductoTipo.DoesNotExist:
            raise serializers.ValidationError('El tipo de producto no existe en la base de datos.')

        return tipo_producto
    
    def create(self, validated_data):
        #Extraemos los datos
        print(validated_data)
        precio_data = validated_data.pop('precio')
        precio_venta_data = validated_data.pop('precio_venta')
        precio_coste_data = validated_data.pop('precio_coste')

        #Creamos el objeto precio
        producto_precip = ProductoPrecio.objects.create(**precio_data)
        producto_precio_venta = ProductoPrecioVenta.objects.create(**precio_venta_data)
        producto_precio_coste = ProductoPrecioCoste.objects.create(**precio_coste_data)

        #Creamos el objeto producto
        producto = Producto.objects.create(precio=producto_precip,
                                             precio_venta=producto_precio_venta,
                                                precio_coste=producto_precio_coste, 
                                           **validated_data)


        return producto
    def update(self, instance, validated_data):
        # Extraemos los datos de los precios
        precio_data = validated_data.pop('precio', None)
        precio_venta_data = validated_data.pop('precio_venta', None)
        precio_coste_data = validated_data.pop('precio_coste', None)

        # Si se proporcionaron datos para 'precio', actualizamos o creamos el objeto Precio
        if precio_data:
            if instance.precio:
                for attr, value in precio_data.items():
                    setattr(instance.precio, attr, value)
                instance.precio.save()
            else:
                instance.precio = ProductoPrecio.objects.create(**precio_data)
        
        # Si se proporcionaron datos para 'precio_venta', actualizamos o creamos el objeto PrecioVenta
        if precio_venta_data:
            if instance.precio_venta:
                for attr, value in precio_venta_data.items():
                    setattr(instance.precio_venta, attr, value)
                instance.precio_venta.save()
            else:
                instance.precio_venta = ProductoPrecioVenta.objects.create(**precio_venta_data)
        
        # Si se proporcionaron datos para 'precio_coste', actualizamos o creamos el objeto PrecioCoste
        if precio_coste_data:
            if instance.precio_coste:
                for attr, value in precio_coste_data.items():
                    setattr(instance.precio_coste, attr, value)
                instance.precio_coste.save()
            else:
                instance.precio_coste = ProductoPrecioCoste.objects.create(**precio_coste_data)

        # Finalmente, actualizamos el objeto Producto con los demás datos
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        # Guardamos el objeto actualizado
        instance.save()

        return instance