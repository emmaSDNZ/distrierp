from django.db import models
from apps.products.models.producto.productoProductoModel import ProductoProductoModel

class  PrecioVentaModel(models.Model):
    _id_precio_venta = models.AutoField(primary_key=True)
    _precio_unitario = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        default=0.00
        )
    #fecha_inicio = models.DateField()
    #fecha_fin = models.DateField(null=True, blank=True)
    # 
    _create_date = models.DateTimeField(
        verbose_name="Fecha de creación", 
        auto_now_add=True
    )
    id_producto_producto = models.ForeignKey(
        ProductoProductoModel,
        on_delete=models.CASCADE,
        related_name='precio_venta'
    )

    class Meta:
        verbose_name = "Precio de Venta"
        verbose_name_plural = "Precios de Venta"
