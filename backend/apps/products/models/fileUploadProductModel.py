from django.db import models
from apps.base.models import BaseModel
from apps.products.models.userModel import User  

class FileUploadProductModel(BaseModel):
    name_supplier_id = models.ForeignKey(
        User, on_delete=models.CASCADE, verbose_name="Proveedor", blank=False
    )
    file_name = models.CharField(max_length=255)
    
    class Meta:
        verbose_name = "Relacion proveedor con Archivo csv"
    def __str__(self):
        return self.name_supplier_id
    