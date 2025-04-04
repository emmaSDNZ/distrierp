from django.db import models
from .models_price import ProductoPrecio, ProductoPrecioVenta, ProductoPrecioCoste
from .models_type import ProductoTipo
from .models_category import ProductCategory


class Producto(models.Model):
    nombre = models.CharField(max_length=100, null=False, blank=False)
    descripcion = models.TextField(default="Descripción no disponible", null=True)
    presentacion = models.CharField(max_length=200, null=True)
    done = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    categoria = models.ForeignKey(ProductCategory, on_delete=models.CASCADE, null=True, blank=False)
    precio = models.ForeignKey(ProductoPrecio, on_delete=models.SET_NULL, null=True, blank=True)
    precio_venta = models.ForeignKey(ProductoPrecioVenta, on_delete=models.SET_NULL, null=True, blank=True)
    precio_coste = models.ForeignKey(ProductoPrecioCoste, on_delete=models.SET_NULL, null=True, blank=True)
    tipo_producto = models.ForeignKey(ProductoTipo, on_delete=models.CASCADE, null=False, blank=False)
    referencia = models.CharField(max_length=100, null=True)
    cod_barras = models.CharField(max_length=100, null=True)
    cod_prod_interno = models.CharField(max_length=100, null=True)
    cod_prod_proveedor = models.CharField(max_length=100, null=True)
    cod_ncm = models.CharField(max_length=100, null=True)
    def __str__(self):
        return self.nombre