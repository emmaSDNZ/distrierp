from django.db import models

class ProductoPrecio(models.Model): 
    precio = models.DecimalField(max_digits=100, decimal_places=4)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return  f"Precio: ${self.precio}"
    
    class Meta:
        verbose_name = "Precio"
        verbose_name_plural = "Precios"  

class ProductoPrecioVenta(models.Model): 
    precio_venta = models.DecimalField(max_digits=100, decimal_places=4)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return  f"Precio: ${self.precio_venta}"
    
    class Meta:
        verbose_name = "Precio venta"
        verbose_name_plural = "Precios ventas"  
        
class ProductoPrecioCoste(models.Model): 
    precio_coste = models.DecimalField(max_digits=100, decimal_places=4)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return  f"Precio: ${self.precio_coste}"
    
    class Meta:
        verbose_name = "Precio coste"
        verbose_name_plural = "Precios costes"