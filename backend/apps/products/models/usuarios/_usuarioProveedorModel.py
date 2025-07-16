from django.db import models
from apps.products.models.usuarios._usuarioModel import UsuarioModel
from apps.products.models.usuarios._proveedorModel import ProveedorModel

class UsuarioProveedorModel(models.Model):
    id_usuario_proveedor = models.AutoField(primary_key=True)
    id_usuario = models.ForeignKey(UsuarioModel, on_delete=models.CASCADE, db_column='id_usuario')
    id_proveedor = models.ForeignKey(ProveedorModel, on_delete=models.CASCADE, db_column='id_proveedor')

    #class Meta:
    #    db_table = 'usuarios_proveedores'
    #    managed = False
    #    unique_together = (('id_usuario', 'id_proveedor'),)

    def __str__(self):
        return f"{self.id_usuario} - {self.id_proveedor}"