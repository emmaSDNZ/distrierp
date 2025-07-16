from django.db import models
from apps.base.models import BaseModel  # BaseModel puede contener campos comunes como fecha de creación
from apps.products.models.productModel import Product  # Modelo de Producto
from apps.products.models.userProvider import UserProvider  # Modelo de Usuario (Proveedor)

class SupplierProduct(BaseModel):
    product_id = models.ForeignKey(
        Product, on_delete=models.CASCADE, verbose_name="Producto", blank=False
    )
    supplier_id = models.ForeignKey(
        UserProvider, on_delete=models.CASCADE, verbose_name="Proveedor", blank=False
    )

    class Meta:
        verbose_name = "Producto Proveedor"  # Singular
        verbose_name_plural = "Productos Proveedores"  # Plural

    def __str__(self):
        return f"{self.product} - {self.supplier}"