from django.db import models
from apps.base.models import BaseModel
from apps.products.models.models import MeasureUnit
from apps.products.models.typeProductModel import TypeProduct
from apps.products.models.categoryModel import Category

        
class Product(BaseModel):
    name = models.CharField(
        verbose_name="Nombre de Producto", max_length=150, blank=False, null=False
    )
    description = models.TextField(
        verbose_name="Descripción", default="Descripción no disponible", null=True, blank=True
    )
    presentation = models.TextField(
        verbose_name="Presentación", default="Presentación no disponible", null=True, blank=True
    )
    price = models.DecimalField(
        verbose_name="Precio", max_digits=10, decimal_places=2, default=0.0, blank=True
    )
    price_sale = models.DecimalField(
        verbose_name="Precio de Venta", max_digits=10, decimal_places=2, default=0.0, blank=True
    )
    price_cost = models.DecimalField(
        verbose_name="Precio de Costo", max_digits=10, decimal_places=2, default=0.0, blank=True
    )
    reference_code = models.CharField(
        verbose_name="Código de Referencia", max_length=100, null=True, blank=True
    )
    bar_code = models.CharField(
        verbose_name="Código de Barra", max_length=100, null=True, blank=True
    )
    internal_code = models.CharField(
        verbose_name="Código de Producto Interno", max_length=100, null=True, blank=True
    )
    proveedor_code = models.CharField(
        verbose_name="Código Producto del Proveedor", max_length=100, null=True, blank=True
    )
    ncm_code = models.CharField(
        verbose_name="Código NCM del Producto", max_length=100, null=True, blank=True
    )
    niprod_code = models.CharField(
        verbose_name="Niprod Carena", max_length=100, null=True, blank=True
    )
    measure_unit = models.ForeignKey(
        MeasureUnit, on_delete=models.CASCADE, verbose_name="Unidad de Medida", null=True, blank=True
    )
    type_product = models.ForeignKey(
        TypeProduct, on_delete=models.CASCADE, verbose_name="Tipo de Producto", null=True, blank=True
    )
    categories = models.ManyToManyField(
        Category, verbose_name="Categoría de Producto", blank=True
    )


    class Meta:
        verbose_name = "Producto"
        verbose_name_plural = "Productos"
    
