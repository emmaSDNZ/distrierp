from django.db import models

class ProductoTemplateModel(models.Model):
    id_producto_template = models.AutoField(
        primary_key=True
        )
    nombre_base_producto =  models.CharField(
        verbose_name="Nombre base del producto", 
        max_length=255, 
        null=False, 
        blank=False
    )
    principio_activo =  models.CharField(
        verbose_name="Principio activo", max_length=255, null=True, blank=True
    )
    create_date = models.DateTimeField(
        verbose_name="Fecha de creación", 
        auto_now_add=True
    )

    class Meta:
        verbose_name = "Producto"
        verbose_name_plural = "Productos"
    
    def __str__(self):
        return self.nombre_base_producto
