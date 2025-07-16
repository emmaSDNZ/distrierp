
from django.db import models
from apps.base.models import BaseModel
from apps.products.models.providerProductModel import ProviderProduct

class ProductBatch(BaseModel):
    supplier_product = models.ForeignKey(ProviderProduct, on_delete=models.CASCADE, related_name='batches')
    batch_number = models.CharField(max_length=100)
    expiration_date = models.DateField()
    price_unit = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField()

    class Meta:
        unique_together = ('supplier_product', 'batch_number')
