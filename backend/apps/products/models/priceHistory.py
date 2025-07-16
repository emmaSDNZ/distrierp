from django.db  import models
from apps.products.models.productModel import Product

class PriceHistoryModel(models.Model):
    PRICE_TYPE_CHOICE = [
        ("sale", "Venta"),
        ("purchase", "Compra"),
        ("price", "Precio General")
    ]

    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name="price_history",
        verbose_name="Producto"
    )

    price_value = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name="Valor del precio"    
                )
    price_type = models.CharField(
        max_length=10,
        choices=PRICE_TYPE_CHOICE, 
        verbose_name="Tipo de precio"    
                )
    source = models.CharField(
        max_length=100,
        verbose_name="Fuente del precio"    
                )
    timestamp = models.DateTimeField(
        auto_now_add=True, 
        verbose_name="Fecha de actualización"
    )

    def __str__(self):
        return f"{self.product.name} - {self.price_type} - {self.price_value}"

# Precio activo del producto (referencia actual)
class PriceModel(models.Model):
    product = models.ForeignKey(
        Product, 
        on_delete=models.CASCADE, 
        related_name='active_price', 
        verbose_name="Producto"
    )
    price_value = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        verbose_name="Precio actual"
    )
    price_type = models.CharField(
        max_length=10, 
        choices=[('sale', 'Venta'), ('purchase', 'Compra'), ("price", "Precio General")], 
        verbose_name="Tipo de precio"
    )

    class Meta:
        unique_together = ('product', 'price_type')
    def __str__(self):
        return f"{self.product.name} - {self.price_type} - {self.price_value}"