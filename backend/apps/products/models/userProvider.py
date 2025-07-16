from django.db import models
from apps.base.models import BaseModel

class UserProvider(BaseModel):
    name = models.CharField(
        verbose_name="Nombre del usuario", max_length=100, unique=False, blank=False
    )
    
