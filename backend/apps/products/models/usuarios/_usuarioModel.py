from django.db import models


class UsuarioModel(models.Model):
    
    id_usuario = models.AutoField(primary_key=True)  # coincidir con tabla existente
    nombre_usuario = models.CharField(max_length=255)
    activo = models.BooleanField(default=True)

    #class Meta:
    #    db_table = 'usuarios'
    #    managed = False  # No Django no manejará creación o alteración

    def __str__(self):
        return self.nombre_usuario

