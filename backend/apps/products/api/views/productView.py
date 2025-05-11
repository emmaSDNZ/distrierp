from rest_framework import generics
from rest_framework import status
from rest_framework.response import Response
from apps.products.models.productModel import Product

from apps.products.api.serializer.productSerializer import ProductSerializer, ProductWriteSerializer


class ProductCreateAPIView(generics.CreateAPIView):
    serializer_class = ProductWriteSerializer
    queryset = Product.objects.all()

    def create(self, request, *args, **kwargs):
        write_serializer = self.get_serializer(data=request.data)
        write_serializer.is_valid(raise_exception=True)
        product = write_serializer.save() 

        # Usamos el serializer de lectura para la respuesta
        read_serializer = ProductSerializer(product)

        return Response({
            "success": True,
            "message": "Producto creado correctamente",
            "data": read_serializer.data
        }, status=status.HTTP_201_CREATED)


class ProductListAPIView(generics.ListAPIView):
    serializer_class= ProductSerializer
    def get(self, request):
        queryset = Product.objects.all()

        if not queryset.exists():
            return Response({
                "success": False,
                "message": "No se encontraron productos.",
                "data": []  # Aseguramos que la respuesta sea coherente con la estructura
            }, status=status.HTTP_404_NOT_FOUND)

        serializer = self.get_serializer(queryset, many=True)
        return Response({
            "success": True,
            "message": "Lista de productos obtenida correctamente.",
            "data": serializer.data
        }, status=status.HTTP_200_OK)

class ProductRetrieveAPIView(generics.RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def get(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance)
            return Response({
            "success": True,
            "message": "Detalle del producto obtenido correctamente.",
            "data": serializer.data
        }, status=status.HTTP_200_OK)

        except Product.DoesNotExist:
            return Response({
            "success": False,
            "message": "El producto no existe.",
            "data": {}  # En caso de no encontrar el producto, devolvemos un objeto vacío
        }, status=status.HTTP_404_NOT_FOUND)
        
class ProductUpdateAPIView(generics.UpdateAPIView):

    queryset = Product.objects.all()
    serializer_class = ProductWriteSerializer

    def get(self, request, *args, **kwargs):
        """Devuelve los detalles del producto."""
        try:
            # Obtener el producto usando el id (pk) de la URL
            product = self.get_object()
            # Serializar los datos del producto para devolverlo
            serializer = ProductSerializer(product)
            return Response(
                {
                    "success": True,
                    "message": "Producto obtenido correctamente.",
                    "data": serializer.data
                },
                status=status.HTTP_200_OK
            )
        except Product.DoesNotExist:
            return Response(
                {
                    "success": False,
                    "message": "El producto no existe."
                },
                status=status.HTTP_404_NOT_FOUND
            )
    def put(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance, data=request.data)
            if serializer.is_valid():
                product = serializer.save()

                # Serializador de lectura para la respuesta
                read_serializer = ProductSerializer(product)
                return Response({
                "success": True,
                "message": "Producto actualizado correctamente.",
                "data": read_serializer.data
            }, status=status.HTTP_200_OK)
            return Response({
            "success": False,
            "message": "Error al actualizar el producto.",
            "data": serializer.errors  # En caso de error, devolvemos los errores en 'data'
        }, status=status.HTTP_400_BAD_REQUEST)

        except Product.DoesNotExist:
            return Response({
            "success": False,
            "message": "El producto no existe.",
            "data": {}  # Cuando el producto no existe, devolvemos un objeto vacío
        }, status=status.HTTP_404_NOT_FOUND)
            
class ProductDestroyAPIView(generics.DestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer  # opcional

    def delete(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            instance.delete()
            return Response({
                "success": True,
                "message": "Producto eliminado correctamente.",
                "data": {}
            }, status=status.HTTP_200_OK)  # ✅ cambia 204 -> 200

        except Product.DoesNotExist:
            return Response({
                "success": False,
                "message": "El producto no existe.",
                "data": {}
            }, status=status.HTTP_404_NOT_FOUND)

"""        
        {
  "name": "Nuevo nombre del producto",
  "description": "Descripción actualizada",
  "price": 150.75,
  "categories": [
    { "id": 1 },
    { "name": "All" }
  ]
}
"""