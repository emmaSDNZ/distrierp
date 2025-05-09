from rest_framework import generics, status
from rest_framework.response import Response
from apps.products.models.variantProductModel import VariantProduct
from apps.products.api.serializer.variantSerializer import VariantProductSerializer

class VariantProductCreateAPIView(generics.CreateAPIView):
    serializer_class =  VariantProductSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)       
        if serializer.is_valid():
            serializer.save()
            return Response(
                {
                    "success": True,
                    "message": "Variante creada correctamente.",
                    "data": serializer.data
                },
                status=status.HTTP_201_CREATED
            )
        return Response(
            {
                "success": False,
                "message": "Error al crear la variante.",
                "errors": serializer.errors
            },
            status=status.HTTP_400_BAD_REQUEST
        )
    

class VariantProductListAPIView(generics.ListAPIView):
    serializer_class = VariantProductSerializer

    def get(self, request, *args, **kwargs):
        queryset = VariantProduct.objects.all()

        if not queryset.exists():
            return Response(
                {"success": False, "message": "No se encontraron variantes."},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = self.get_serializer(queryset, many=True)
        return Response(
            {
                "success": True,
                "message": "Lista de variantes obtenida correctamente.",
                "data": serializer.data
            },
            status=status.HTTP_200_OK
        )
    
class VariantProductRetrieveAPIView(generics.RetrieveAPIView):
    queryset = VariantProduct.objects.all()
    serializer_class = VariantProductSerializer

    def get(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance)
            return Response(
                {
                    "success": True,
                    "message": "Detalle de la variante obtenido correctamente.",
                    "data": serializer.data
                },
                status=status.HTTP_200_OK
            )
        except VariantProduct.DoesNotExist:
            return Response(
                {
                    "success": False,
                    "message": "La variante no existe."
                },
                status=status.HTTP_404_NOT_FOUND
            )

class VariantProductUpdateAPIView(generics.UpdateAPIView):
    queryset = VariantProduct.objects.all()
    serializer_class = VariantProductSerializer

    def put(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(
                    {
                        "success": True,
                        "message": "Variante actualizada correctamente.",
                        "data": serializer.data
                    },
                    status=status.HTTP_200_OK
                )
            return Response(
                {
                    "success": False,
                    "message": "Error al actualizar la variante.",
                    "errors": serializer.errors
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        except VariantProduct.DoesNotExist:
            return Response(
                {
                    "success": False,
                    "message": "La variante no existe."
                },
                status=status.HTTP_404_NOT_FOUND
            )
        

class VariantProductDestroyAPIView(generics.DestroyAPIView):
    queryset = VariantProduct.objects.all()
    serializer_class = VariantProductSerializer

    def delete(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            instance.delete()
            return Response(
                {
                    "success": True,
                    "message": "Variante eliminada correctamente."
                },
                status=status.HTTP_204_NO_CONTENT
            )
        except VariantProduct.DoesNotExist:
            return Response(
                {
                    "success": False,
                    "message": "La variante no existe."
                },
                status=status.HTTP_404_NOT_FOUND
            )