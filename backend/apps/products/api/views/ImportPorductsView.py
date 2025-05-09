import pandas as pd
from rest_framework import generics, status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response

from apps.products.models.productModel import Product
from apps.products.models.categoryModel import Category
from apps.products.models.models import MeasureUnit
from apps.products.models.typeProductModel import TypeProduct
from apps.products.api.serializer.productSerializer import ProductSerializer


class ImportarProductosAPIView(generics.CreateAPIView):
    parser_classes = (MultiPartParser, FormParser)
    serializer_class = ProductSerializer

    def perform_create(self, serializer):
        archivo = self.request.FILES.get('file')
        if not archivo:
            raise ValueError("No se ha enviado ningún archivo")

        try:
            if archivo.name.endswith('.csv'):
                df = pd.read_csv(archivo)
            elif archivo.name.endswith('.xlsx'):
                df = pd.read_excel(archivo)
            else:
                raise ValueError("Formato de archivo no soportado. Solo CSV o XLSX.")
        except Exception as e:
            raise ValueError(f"Error al leer el archivo: {str(e)}")

        nuevos = 0
        for _, row in df.iterrows():
            try:
                # Verificar que el campo 'name' esté presente
                if pd.isna(row.get("nombre")):
                    raise ValueError("El campo 'nombre' es obligatorio en el archivo CSV.")

                producto = Product(
                    name=row["nombre"],  # Columna "nombre" en el CSV
                    description=row.get("descripcion", "Descripción no disponible"),
                    presentation=row.get("presentacion", "Presentación no disponible"),
                    price=row.get("precio", 0.0),
                    price_sale=row.get("precio_venta", 0.0),
                    price_cost=row.get("precio_costo", 0.0),
                    reference_code=row.get("codigo_referencia"),
                    bar_code=row.get("codigo_barra"),
                    internal_code=row.get("codigo_interno"),
                    proveedor_code=row.get("codigo_proveedor"),
                    ncm_code=row.get("codigo_ncm"),
                    niprod_code=row.get("niprod_code"),
                )

                # Asignar valores predeterminados
                # Verificar si existen o se crean los valores predeterminados
                measure_unit, created_measure_unit = MeasureUnit.objects.get_or_create(description="Unidad predeterminada")
                if created_measure_unit:
                    print(f"Se creó una nueva unidad de medida: {measure_unit.description}")
                producto.measure_unit = measure_unit

                type_product, created_type_product = TypeProduct.objects.get_or_create(type_product="consumible")
                if created_type_product:
                    print(f"Se creó un nuevo tipo de producto: {type_product.type_product}")
                producto.type_product = type_product

                category, created_category = Category.objects.get_or_create(category="general")
                if created_category:
                    print(f"Se creó una nueva categoría: {category.category}")
                producto.categories.add(category)

                producto.save()  # Guardar el producto
                nuevos += 1

            except KeyError as e:
                raise ValueError(f"Falta columna obligatoria: {str(e)}")
            except Exception as e:
                raise ValueError(f"Error al procesar producto: {str(e)}")

        return Response({"insertados": nuevos}, status=status.HTTP_201_CREATED)

    def handle_exception(self, exc):
        return Response({"error": str(exc)}, status=status.HTTP_400_BAD_REQUEST)
