from django.db import models
from apps.base.models import BaseModel


class MeasureUnit(BaseModel):
    description = models.CharField("Descripcion", max_length=50, blank=False, null=False, unique=True)
    class Meta:

        verbose_name="Unidad de Medida"
        verbose_name_plural="Unidades de Medidas"
    
    def __str__(self):
        return self.description
    
class CategoryProduct(BaseModel):
    category = models.CharField("Descripcion", max_length=50, blank=False, null=False, unique=True)
    class Meta:

        verbose_name="Categoria de Producto"
        verbose_name_plural="Categorias de Productos"
    
    def __str__(self):
        return self.category
