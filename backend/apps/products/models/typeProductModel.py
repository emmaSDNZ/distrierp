from django.db import models
from apps.base.models import BaseModel

class TypeProduct(BaseModel):
    TIPO_CHOICES = [
        ('almacenable', 'Almacenable'),
        ('consumible', 'Consumible'),
        ('servicio', 'Servicio'),
    ]

    type_product = models.CharField(
        max_length=100,
        choices=TIPO_CHOICES,
        unique=True,
        verbose_name="Tipo de producto"
    )

    def __str__(self):
        return self.get_type_product_display()

    class Meta:
        verbose_name = "Tipo de Producto"
        verbose_name_plural = "Tipos de Producto"
        ordering = ['type_product']

    @classmethod
    def get_default_type_product(cls):
        # Si no existe un tipo de producto llamado 'consumible', se crea uno
        type_product, _ = cls.objects.get_or_create(type_product='consumible')
        return type_product
