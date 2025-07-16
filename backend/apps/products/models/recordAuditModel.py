# models/auditoria.py
from django.db import models

class RecordAuditModel(models.Model):
    
    modelo = models.CharField(max_length=100)
    registro_id = models.IntegerField()
    registro_nombre = models.CharField(max_length=250)
    accion = models.CharField(max_length=10)  # create, update, delete
    cambios = models.JSONField(null=True, blank=True)
    fecha_hora = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.modelo} #{self.registro_id} - {self.accion}"