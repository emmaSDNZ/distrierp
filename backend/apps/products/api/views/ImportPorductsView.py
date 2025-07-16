from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from apps.products.api.serializer.importProductsSerializer import ProductImportSerializer
from apps.products.models.priceHistory import PriceHistoryModel, PriceModel
from apps.products.models.productModel import Product
from dataAnalytics.utils.preProcessing import dfProcess, proceso_columna_precio


class ProductCreateImportAPIView(APIView):
    def post(self, request, *args, **kwargs):
        # Usamos el serializador para validar y crear el producto
        serializer = ProductImportSerializer(data=request.data)
        if serializer.is_valid():
            product = serializer.save()
            print("Producto ID:", product.id)
            print("Datos serializados:", ProductImportSerializer(product).data)
            return Response(
                ProductImportSerializer(product).data, 
                status=status.HTTP_201_CREATED
                )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ImportarProductosAPIView(APIView):
    parser_classes = (MultiPartParser, FormParser)
    
    def post(self, request, *args, **kwargs):
        file_obj = request.FILES.get('file_product')

        if file_obj is None:
            return Response({
                "success": False,
                "error": "No se recibió el archivo. Usa la clave 'file_product'.",
                "data": []
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            name_column = "price"
            name_column1 = "psp"
            name_column2 = "psv"

            df = dfProcess(file_obj)  # Procesa archivo inicial (probablemente un Excel o CSV)

            # Normalización de columnas
            df = self.normalizar_columnas(df)

            # Procesamiento de la columna "price"
            df = proceso_columna_precio(df, name_column)
            print("DF PRICE", df)

            # Procesamiento de la columna "psp"
            df = proceso_columna_precio(df, name_column1)
            print("DF PSP", df["psp"])

            # Procesamiento de la columna "psv"
            df = proceso_columna_precio(df, name_column2)
            print("DF PSV", df["psv"])

            # Verificación de datos
            if isinstance(df, str):
                return Response({
                    "success": False,
                    "error": df
                }, status=status.HTTP_400_BAD_REQUEST)
            productos_creados = []
            precios_actualizados = []

            for _, fila in df.iterrows():
                name = fila["name"]
                price = fila.get("price")
                price_cost = fila.get("psp")
                price_sale = fila.get("psv")

                if not price or not price_cost or not price_sale:
                    print(f"Datos incompletos para el producto '{name}', se omite.")
                    continue

                product, created = Product.objects.get_or_create(name=name)
                if created:
                    print(f"Producto creado: {name}")
                else:
                    print(f"Producto existente: {name}")

                precio_obj = self.registrar_precio(product, price, 'price')
                costo_obj = self.registrar_precio(product, price_cost, 'purchase')
                venta_obj = self.registrar_precio(product, price_sale, 'sale')

                productos_creados.append(name)

                precios_actualizados.append({
                    "producto": name,
                    "precios": {
                        "price": precio_obj.price_value if precio_obj else None,
                        "purchase": costo_obj.price_value if costo_obj else None,
                        "sale": venta_obj.price_value if venta_obj else None,
                    }
                })

            return Response({
                "mensaje": "Productos creados correctamente",
                "precios_actualizados": precios_actualizados
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({
                "error": f"Error al leer el archivo: {str(e)}"
            }, status=status.HTTP_400_BAD_REQUEST)

    def normalizar_columnas(self, df):
        """Función para normalizar los nombres de las columnas"""
        df.columns = df.columns.str.lower().str.replace(' ', '_')
        return df

    def registrar_precio(self, product, valor, tipo):
        if valor is not None:
            # Registrar en historial
            PriceHistoryModel.objects.create(
                product=product,
                price_value=valor,
                price_type=tipo,
                source='importación'
            )
            # Actualizar precio activo y retornar el objeto
            price_obj, _ = PriceModel.objects.update_or_create(
                product=product,
                price_type=tipo,
                defaults={'price_value': valor}
            )
            return price_obj
        return None