from django.db import models
from .productoProductoModel import ProductoProductoModel
from ..usuarios._proveedorModel import ProveedorModel

class ProductoProveedorModel(models.Model):
    id_producto_proveedor = models.AutoField(primary_key=True)
    id_producto_producto = models.ForeignKey(
        ProductoProductoModel, 
        verbose_name="Producto producto", 
        on_delete=models.CASCADE, 
        null=False, 
        blank=False,
        related_name='proveedores'
    )

    id_proveedor = models.ForeignKey(
        ProveedorModel, 
        verbose_name="Proveedor",  # ✅ corregido el verbose_name
        on_delete=models.CASCADE, 
        null=False, 
        blank=False,
        related_name='productos'
    )

    codigo_proveedor = models.CharField(
        verbose_name="Código proveedor (régimen)",
        max_length=20, 
        null=True, 
        blank=True
    )


    def __str__(self):
        return f"{self.id_producto_producto} - {self.id_proveedor}"
