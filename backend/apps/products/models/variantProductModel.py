from django.db import models
from apps.base.models import BaseModel
from apps.products.models.attributeModel import NameAttribute, ValueAttribute
from apps.products.models.productModel import Product

class VariantProduct(BaseModel):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, verbose_name="Entidad Producto", blank=False)
    sku = models.CharField(max_length=100, unique=True)
    # Otros campos como precio, stock, imagen...
    class Meta:
        verbose_name = "Variante de producto"
        verbose_name_plural = "Variante de producto"


class VariantAttribute(BaseModel):
    variant = models.ForeignKey(VariantProduct, on_delete=models.CASCADE)
    attribute_name = models.ForeignKey(NameAttribute, on_delete=models.CASCADE)
    attribute_value = models.ForeignKey(ValueAttribute, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('variant', 'attribute_name')
    class Meta:
        verbose_name = "Variante y atributos"
        verbose_name_plural = "Variante y atributos"        