from django.db import models

class CategoriasModel(models.Model):
    id_categoria = models.AutoField(primary_key=True)
    nombre_categoria = models.CharField(
        max_length=100,
        unique=True,
        null=False,  
        blank=False 
    )
    descripcion = models.TextField(
        null=True, 
        blank=True 
    )

    class Meta:
        verbose_name = "Categoría"
        verbose_name_plural = "Categorías"
        ordering = ['nombre_categoria'] # Opcional: ordenar por defecto por nombre

    def __str__(self):
        return self.nombre_categoria
    
    