from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from apps.products.models.typeProductModel import TypeProduct
from apps.products.api.serializer.generalSerializer import TypeProductSerializer


class TypeProductAPIView(APIView):
    # Lista de tipos de producto
    def get(self, request):
        type_product = TypeProduct.objects.all()
        serializer = TypeProductSerializer(type_product, many=True)
        return Response(serializer.data)


class TypeProductCreateAPIView(generics.CreateAPIView):
    queryset = TypeProduct.objects.all()
    serializer_class = TypeProductSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            return Response(
                {
                    "message": "Tipo de Producto creado correctamente",
                    "data": serializer.data
                },
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TypeProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = TypeProduct.objects.all()
    serializer_class = TypeProductSerializer

    def get(self, request, pk):
        type_product = self.get_object()
        serializer = TypeProductSerializer(type_product)
        return Response(serializer.data)

    def put(self, request, pk):
        type_product = self.get_object()
        serializer = TypeProductSerializer(type_product, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        type_product = self.get_object()
        type_product.delete()
        return Response({"message": "Producto Eliminado"}, status=status.HTTP_204_NO_CONTENT)
