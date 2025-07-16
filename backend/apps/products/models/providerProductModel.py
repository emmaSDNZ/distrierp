from django.db import models
from apps.base.models import BaseModel
from apps.products.models.productModel import Product
from apps.products.models.providerModel import ProviderModel 

class ProviderProductModel(BaseModel):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='supplier_links')
    supplier = models.ForeignKey(ProviderModel, on_delete=models.CASCADE)
    price_cost = models.DecimalField(max_digits=10, decimal_places=2)
    last_updated = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('product', 'supplier')
