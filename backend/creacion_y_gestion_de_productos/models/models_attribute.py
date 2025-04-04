from django.db import models

from .models_product import Producto


class AttributeName(models.Model):
    name_attr = models.CharField(max_length=100, unique=True)
    created_at = models.DateField(auto_now_add=True) 
    def __str__(self):
        return self.name_attr

class AttributeValue(models.Model):
    value = models.CharField(max_length=100, unique=True)
    created_at = models.DateField(auto_now_add=True)
    price_extra = models.DecimalField(max_digits=10,decimal_places=5,null=True, blank=True)
    free_text = models.TextField(null=True, blank=True)
    def __str__(self):
        return self.value

class AttributeNameValue(models.Model):
    name_attr = models.ForeignKey(AttributeName, on_delete=models.CASCADE, related_name="values" ) 
    values = models.ManyToManyField(AttributeValue)
    created_at = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.name_attr.name_attr}: {', '.join([value.value for value in self.values.all()])}"


