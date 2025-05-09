from rest_framework import generics, status
from rest_framework.exceptions import NotFound
from rest_framework.response import Response 

from apps.products.models.attributeModel import ValueAttribute
from apps.products.api.serializer.attributeSerializer import ValueAttributeSerializer

class ValueAttributeAPIView(generics.ListAPIView):
    serializer_class = ValueAttributeSerializer

    def get(self, request):
        queryset = ValueAttribute.objects.all()
        
        if not queryset.exists():
            return Response(
                {"success": False, "message": "No se encontraron valores."},
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(
            {
                "success": True,
                "message": "Lista de valores obtenida correctamente.",
                "data": serializer.data
            },
            status=status.HTTP_200_OK
        )

class ValueAttributeCreateAPIView(generics.CreateAPIView):
    serializer_class= ValueAttributeSerializer

    def post (self, request):
        serializer = self.get_serializer(data=request.data)
        print(serializer)
        if serializer.is_valid():
            instance = serializer.save()
            return Response(
                {"success": True, "message": "Valor creado exitosamente.", "data": serializer.data},
                status=status.HTTP_201_CREATED
            )
        return Response(
            {"success": False, "message": "Error de validación.", "errors": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST
        )


class ValueAttributeRetrieveAPIView(generics.RetrieveAPIView):
    queryset = ValueAttribute.objects.all()
    serializer_class = ValueAttributeSerializer

    def retrieve(self, request, *args, **kwargs):  # Método correcto es retrieve
        try:
            instance = self.get_object()
        except NotFound:
            return Response(
                {"success": False, "message": "Nombre no encontrado."},
                status=status.HTTP_404_NOT_FOUND
            )
        serializer = self.get_serializer(instance)
        return Response(
            {"success": True, "message": "Nombre obtenido correctamente.", "data": serializer.data},
            status=status.HTTP_200_OK
        )


class ValueAttributeUpdateAPIView(generics.UpdateAPIView):
    queryset = ValueAttribute.objects.all()
    serializer_class = ValueAttributeSerializer

    def put(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
        except NotFound:
            return Response(
                {"success": False, "message": "Nombre no encontrado."},
                status=status.HTTP_404_NOT_FOUND
            )
        serializer = self.get_serializer(instance, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"success": True, "message": "Valor actualizado correctamente.", "data": serializer.data},
                status=status.HTTP_200_OK
            )
        return Response(
            {"success": False, "message": "Error de validación.", "errors": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST
        )


class ValueAttributeDestroyAPIView(generics.DestroyAPIView):
    queryset = ValueAttribute.objects.all()
    serializer_class = ValueAttributeSerializer

    def delete(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
        except NotFound:
            return Response(
                {"success": False, "message": "Nombre no encontrado."},
                status=status.HTTP_404_NOT_FOUND
            )
        instance.delete()
        return Response(
            {"success": True, "message": "Valor eliminado correctamente."},
            status=status.HTTP_204_NO_CONTENT
        )