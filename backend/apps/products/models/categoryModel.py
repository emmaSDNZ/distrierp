from django.db import models
from apps.base.models import BaseModel

class Category(BaseModel):
    name = models.CharField(
        verbose_name="Nombre de la Categoría", max_length=100, unique=False, blank=True
    )
    parent = models.ForeignKey(
        'self', verbose_name="Padre de la Categoria", null=True, blank=True,
        on_delete=models.CASCADE, related_name='children'
    )

    class Meta:
        verbose_name = "Categoría de Producto"
        verbose_name_plural = "Categorías de Producto"

    def __str__(self):
        return self.name if self.name else "Sin nombre"
    
    def get_subcategories(self):
        # Retorna todas las subcategorías de la categoría actual
        return self.children.all()
    
    @classmethod
    def get_default_category(cls):
        # Si no existe una categoría llamada 'All', se crea una
        category, _ = cls.objects.get_or_create(name='All')
        return category
