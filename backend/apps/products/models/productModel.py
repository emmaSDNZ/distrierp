from django.db import models
from apps.base.models import BaseModel
from apps.products.models.models import MeasureUnit
from apps.products.models.typeProductModel import TypeProduct
from apps.products.models.categoryModel import Category

        
class Product(BaseModel):
    name = models.CharField(
        verbose_name="Nombre de Producto", max_length=150, blank=False, null=False
    )
    description = models.TextField(
        verbose_name="Descripción", default="Descripción no disponible", null=True, blank=True
    )
    presentation = models.TextField(
        verbose_name="Presentación", default="Presentación no disponible", null=True, blank=True
    )
    price = models.DecimalField(
        verbose_name="Precio", max_digits=10, decimal_places=2, default=0.0, blank=True
    )
    price_sale = models.DecimalField(
        verbose_name="Precio de Venta", max_digits=10, decimal_places=2, default=0.0, blank=True
    )
    price_cost = models.DecimalField(
        verbose_name="Precio de Costo", max_digits=10, decimal_places=2, default=0.0, blank=True
    )
    reference_code = models.CharField(
        verbose_name="Código de Referencia", max_length=100, null=True, blank=True
    )
    bar_code = models.CharField(
        verbose_name="Código de Barra", max_length=100, null=True, blank=True
    )
    internal_code = models.CharField(
        verbose_name="Código de Producto Interno", max_length=100, null=True, blank=True
    )
    proveedor_code = models.CharField(
        verbose_name="Código Producto del Proveedor", max_length=100, null=True, blank=True
    )
    ncm_code = models.CharField(
        verbose_name="Código NCM del Producto", max_length=100, null=True, blank=True
    )
    niprod_code = models.CharField(
        verbose_name="Niprod Carena", max_length=100, null=True, blank=True
    )
    measure_unit = models.ForeignKey(
        MeasureUnit, on_delete=models.CASCADE, verbose_name="Unidad de Medida", null=True, blank=True
    )
    type_product = models.ForeignKey(
        TypeProduct, on_delete=models.CASCADE, verbose_name="Tipo de Producto", null=True, blank=True
    )
    categories = models.ManyToManyField(
        Category, verbose_name="Categoría de Producto", blank=True
    )


    class Meta:
        verbose_name = "Producto"
        verbose_name_plural = "Productos"
    

    def save(self, *args, **kwargs):
        #Asignar tipo de producto por defecto si no esta definico
        if not self.type_product:
            self.type_product = TypeProduct.get_default_type_product()
        super().save(*args, **kwargs)
        
    @classmethod
    def handle_categories(cls, categories_data):
        """
        Maneja las categorías. Si no se pasan, asigna la categoría por defecto.
        Si se pasan IDs, las agrega. Si se pasan nombres, las crea y agrega.
        """
        categories = []

        if not categories_data:
            # Si no hay categorías, se asigna una categoría predeterminada.
            default_category, _ = Category.objects.get_or_create(name='All')
            categories.append(default_category)
        else:
            for cat in categories_data:
                category = None
                if "id" in cat:
                    # Si pasa un ID, buscamos la categoría correspondiente.
                    category = Category.objects.filter(id=cat["id"]).first()
                elif "name" in cat:
                    # Si pasa un nombre, se crea o busca la categoría.
                    category, _ = Category.objects.get_or_create(name=cat["name"])
                if category:
                    categories.append(category)

        return categories

    def add_categories(self, categories_data):
        """
        Agrega categorías al producto.
        """
        categories = self.handle_categories(categories_data)
        self.categories.set(categories)  # Usa set() para agregar las categorías de manera eficiente.
        self.save()

