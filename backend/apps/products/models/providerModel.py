from django.db import models
from apps.base.models import BaseModel

class ProviderModel(BaseModel):
    name = models.CharField(max_length=150)
    cuit = models.CharField(max_length=20, unique=True, null=True, blank=True)
    address = models.CharField(max_length=250, null=True, blank=True)
    phone = models.CharField(max_length=50, null=True, blank=True)
    email = models.EmailField(null=True, blank=True)
    
    def __str__(self):
        return self.name
