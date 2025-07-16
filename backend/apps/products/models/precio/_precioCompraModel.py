# models/precio/precioBaseModel.py
from django.db import models
from ...models.producto.productoProductoModel import ProductoProductoModel

class PrecioCompraModel(models.Model):
    _id_precio_compra = models.AutoField(primary_key=True)
    _precio_compra_unitario = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        default=0.00
        )
    _precio_compra_con_iva = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        default=0.00
        )   
    _precio_compra_sin_iva = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        default=0.00
        )
    _precio_compra_sugerido= models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        default=0.00
        )
    _create_date = models.DateTimeField(auto_now_add=True)
    id_producto_producto = models.ForeignKey(
        ProductoProductoModel,
        on_delete=models.CASCADE,
        related_name='precio_compra'
    )
