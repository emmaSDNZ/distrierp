from django.db import models

class ProveedorModel(models.Model):
    id_proveedor = models.AutoField(primary_key=True)
    nombre_proveedor = models.CharField(max_length=255, blank=True, null=True)

    #class Meta:
    #    db_table = 'proveedores'
    #    managed = False

    def __str__(self):
        return self.nombre_proveedor
