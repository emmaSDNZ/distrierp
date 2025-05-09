from rest_framework import generics, status
from rest_framework.exceptions import NotFound
from rest_framework.response import Response

from apps.products.models.attributeModel import NameAttribute
from apps.products.api.serializer.attributeSerializer import NameAttributeSerializer

class NameAttributeAPIView(generics.ListAPIView):
    serializer_class = NameAttributeSerializer

    def get(self, request):
        queryset = NameAttribute.objects.all()
        
        if not queryset.exists():
            return Response(
                {"success": False, "message": "No se encontraron nombres."},
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(
            {
                "success": True,
                "message": "Lista de nombres obtenida correctamente.",
                "data": serializer.data
            },
            status=status.HTTP_200_OK
        )

class NameAttributeCreateAPIView(generics.CreateAPIView):
    serializer_class= NameAttributeSerializer

    def post (self, request):
        serializer = self.get_serializer(data=request.data)
        print(serializer)
        if serializer.is_valid():
            instance = serializer.save()
            return Response(
                {"success": True, "message": "Nombre creado exitosamente.", "data": serializer.data},
                status=status.HTTP_201_CREATED
            )
        return Response(
            {"success": False, "message": "Error de validación.", "errors": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST
        )


class NameAttributeRetrieveAPIView(generics.RetrieveAPIView):
    queryset = NameAttribute.objects.all()
    serializer_class = NameAttributeSerializer

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


class NameAttributeUpdateAPIView(generics.UpdateAPIView):
    queryset = NameAttribute.objects.all()
    serializer_class = NameAttributeSerializer

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
                {"success": True, "message": "Nombre actualizado correctamente.", "data": serializer.data},
                status=status.HTTP_200_OK
            )
        return Response(
            {"success": False, "message": "Error de validación.", "errors": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST
        )


class NameAttributeDestroyAPIView(generics.DestroyAPIView):
    queryset = NameAttribute.objects.all()
    serializer_class = NameAttributeSerializer

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
            {"success": True, "message": "Nombre eliminado correctamente."},
            status=status.HTTP_204_NO_CONTENT
        )