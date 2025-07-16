from django.db import models
from .productoTemplateModel import ProductoTemplateModel

# --- ARGUMENTOS MODULARIZADOS ---

# Este es tu 'constraint' original, usado para la mayoría de los códigos
STANDARD_CODE_ARGS = {
    "max_length": 50,
    "null": True,
    "blank": True,
    "default": None
}

# Argumentos para campos de texto con descripción (e.g., 'descripcion')
TEXT_FIELD_ARGS = {
    "default": "Sin descripción",
    "null": True,
    "blank": True,
}

# Argumentos para el campo 'presentacion'
PRESENTACION_FIELD_ARGS = {
    "default": "Sin presentación",
    "null": True,
    "max_length": 100, # Tiene un max_length diferente
}

# Argumentos para el campo 'unidad_medida'
UNIDAD_MEDIDA_FIELD_ARGS = {
    "default": "unidad",
    "max_length": 50,
    "null": True,
    "blank": True,
}

# --- MODELO LIMPIO Y MODULARIZADO ---

class ProductoProductoModel(models.Model):
    id_producto_producto = models.AutoField(primary_key=True)

    id_producto_template = models.ForeignKey(
        ProductoTemplateModel,
        verbose_name="Producto template",
        on_delete=models.CASCADE,
        null=False,
        blank=False,
        related_name='producto_productos'
    )

    create_date = models.DateTimeField(
        verbose_name="Fecha de creación",
        auto_now_add=True
    )

    # Identificación
    codigo_interno = models.CharField("Código Interno", **STANDARD_CODE_ARGS)
    sku = models.CharField("SKU", **STANDARD_CODE_ARGS)
    descripcion = models.TextField("Descripción", **TEXT_FIELD_ARGS)

    # Presentación
    presentacion = models.CharField("Presentación", **PRESENTACION_FIELD_ARGS)
    unidad_medida = models.CharField("Unidad de medida", **UNIDAD_MEDIDA_FIELD_ARGS)

    # Código producto proveedor 
    codigo_producto = models.CharField("Código Producto", **STANDARD_CODE_ARGS)

    # Códigos regulatorios
    codigo_ncm = models.CharField("Código NCM", **STANDARD_CODE_ARGS)
    codigo_niprod = models.CharField("Código NIPROD / ANMAT", **STANDARD_CODE_ARGS)

    # Inventario / Referencias
    codigo_referencia = models.CharField("Código de Referencia", **STANDARD_CODE_ARGS)
    codigo_barras = models.CharField("Código de Barras", **STANDARD_CODE_ARGS)

    class Meta:
        verbose_name = "Producto"
        verbose_name_plural = "Productos"
        ordering = ['descripcion', 'presentacion']

    def __str__(self):
        return f"ID_producto_producto: {self.id_producto_producto} -Nombre_template: {self.id_producto_template}"