from django.db import models

class ProductoTipo(models.Model):
    tipo = models.CharField(max_length=100, choices=[
        ('almacenable', 'Almacenable'),
        ('consumible', 'Consumible'),
        ('servicio', 'Servicio')
    ], unique=True)
    
    def __str__(self):
        return self.tipo


