from django.db import models
from django.utils.timezone import now


class BaseModel(models.Model):
    id = models.AutoField(primary_key=True)
    state = models.BooleanField('Estado', default=True)
    create_date = models.DateTimeField("Fecha de Creación", auto_now_add=True)
    modified_date = models.DateTimeField("Fecha de Modificación", auto_now=True)
    deleted_date = models.DateField("Fecha de Eliminación", null=True, blank=True)

    class Meta:
        abstract = True
        verbose_name = "Modelo Base"
        verbose_name_plural = "Modelos Base"
