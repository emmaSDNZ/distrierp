from django.db import models
from .models_product import Producto
from .models_attribute import AttributeNameValue


class ProductAttribute(models.Model):
    product = models.ForeignKey(Producto, on_delete=models.CASCADE, related_name="attribute_values" ) 
    attribute_values = models.ManyToManyField(AttributeNameValue) 
    created_at = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"Product {self.product.id} - Attributes: {', '.join(str(av) for av in self.attribute_values.all())}"