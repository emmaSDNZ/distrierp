from django.db import models
from apps.products.models.categoria._categoriasModel import  CategoriasModel

class SubcategoriasModel(models.Model):
    id_subcategoria = models.AutoField(primary_key=True)
    
    id_categoria = models.ForeignKey(
        CategoriasModel,
        on_delete=models.RESTRICT,
        related_name='subcategorias',
        verbose_name="Categoría"
    )
    
    nombre_subcategoria = models.CharField(
        max_length=100, 
        null=False, 
        blank=False
    )
    
    descripcion = models.TextField(null=True, blank=True)

    class Meta:
        verbose_name = "Subcategoría"
        verbose_name_plural = "Subcategorías"
        ordering = ['nombre_subcategoria']
        unique_together = ('id_categoria', 'nombre_subcategoria')  # Clave compuesta

    def __str__(self):
        return f"{self.nombre_subcategoria} ({self.id_categoria.nombre_categoria})"
