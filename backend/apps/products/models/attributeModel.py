from django.db import models
from apps.base.models import BaseModel

class NameAttribute(BaseModel):
    name = models.CharField(
        verbose_name="Nombre del atributo", max_length=100, unique=False, blank=False
    )

    def __str__(self):
        return self.name
    class Meta:
        verbose_name = "Nombre atributo"
        verbose_name_plural = "Nombre atributo"


class ValueAttribute(BaseModel):
    attribute = models.ForeignKey(
        NameAttribute, on_delete=models.CASCADE
        )
    value = models.CharField(
        verbose_name="Valor del atributo", max_length=100, unique=False, blank=False
        )
    price_extra = models.DecimalField(
        verbose_name="Precio Extra", max_digits=10, decimal_places=2, default=0.0,  blank=True
        )
    free_text = models.TextField(null=True, blank=True)

    class Meta:
        verbose_name = "Valor atributo"
        verbose_name_plural = "Valor atributo"


class AttributeNameValue(BaseModel):
    name = models.ForeignKey(
        NameAttribute, on_delete=models.CASCADE, verbose_name="Nombre del Atributo", blank=False
    )
    values = models.ManyToManyField(
        ValueAttribute, verbose_name="Valores de Atributo", blank=False
    )
    class Meta:
        verbose_name = "Nombre y valor del atributo"
        verbose_name_plural = "Nombre y valor del atributo"



class ProductAttribute(BaseModel):
    product = models.ForeignKey(
        'Product', on_delete=models.CASCADE
        )
    attribute = models.ForeignKey(
        NameAttribute, on_delete=models.CASCADE
        )
    