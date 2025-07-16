from apps.products.models.precio._precioCompraModel import PrecioCompraModel
from apps.products.models.producto.productoProductoModel import ProductoProductoModel
from decimal import Decimal

def actualizar_precio_compra(
    id_producto_producto,
    precio_unitario=None,
    precio_con_iva=None,
    precio_sin_iva=None,
    precio_sugerido=None
):
    try:
        id_int = int(id_producto_producto)
    except (TypeError, ValueError):
        return None

    try:
        # Usamos select_related para evitar consultas adicionales al acceder a id_producto_template
        producto = ProductoProductoModel.objects.select_related('id_producto_template').get(pk=id_int)
    except ProductoProductoModel.DoesNotExist:
        return None

    def parse_precio(value):
        try:
            value = Decimal(str(value))
            return value if value > 0 else None
        except:
            return None

    precios = {}
    if precio_unitario is not None:
        valor = parse_precio(precio_unitario)
        if valor is not None:
            precios["_precio_compra_unitario"] = valor

    if precio_con_iva is not None:
        valor = parse_precio(precio_con_iva)
        if valor is not None:
            precios["_precio_compra_con_iva"] = valor

    if precio_sin_iva is not None:
        valor = parse_precio(precio_sin_iva)
        if valor is not None:
            precios["_precio_compra_sin_iva"] = valor

    if precio_sugerido is not None:
        valor = parse_precio(precio_sugerido)
        if valor is not None:
            precios["_precio_compra_sugerido"] = valor

    if not precios:
        return None

    ultimo = PrecioCompraModel.objects.filter(
        id_producto_producto=producto
    ).order_by("-_create_date").first()

    if ultimo:
        coinciden = all(
            getattr(ultimo, key, None) == valor
            for key, valor in precios.items()
        )
        if coinciden:
            return None  # No cambia nada

    try:
        nuevo = PrecioCompraModel.objects.create(
            id_producto_producto=producto,
            **precios
        )
        # Aquí accedemos al nombre base del producto a través de la relación
        nombre_producto = producto.id_producto_template.nombre_base_producto if producto.id_producto_template else None

        return {
            "id_producto": producto.pk,
            "nombre_producto": nombre_producto,
            "precios_nuevos": precios
        }
    except Exception:
        return None
