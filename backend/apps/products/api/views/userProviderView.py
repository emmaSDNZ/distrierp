from rest_framework import generics, status, filters
from rest_framework.response import Response

from apps.products.models.userProvider import UserProvider
from apps.products.api.serializer.usersSerializer import UserSerializer

class UserListAPIView(generics.ListAPIView):
    serializer_class = UserSerializer
    queryset = UserProvider.objects.all()

    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        if not queryset.exists():
            return Response({
                "success": False,
                "message": "No se encontraron usuarios.",
                "data": []
            }, status=status.HTTP_404_NOT_FOUND)

        serializer = self.get_serializer(queryset, many=True)
        return Response({
            "success": True,
            "message": "Lista de usuarios obtenida correctamente.",
            "data": serializer.data
        }, status=status.HTTP_200_OK)
    


class UserCreateAPIView(generics.CreateAPIView):
    serializer_class = UserSerializer
    queryset = UserProvider.objects.all()

    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            user = serializer.save()
            return Response({
                "success": True,
                "message": "Usuario creado correctamente",
                "data": serializer.data
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({
                "success": False,
                "message": str(e),
                "data": None
            }, status=status.HTTP_400_BAD_REQUEST)


class UserRetrieveAPIView(generics.RetrieveAPIView):
    queryset = UserProvider.objects.all()
    serializer_class = UserSerializer

    def get(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance)
            return Response({
                "success": True,
                "message": "Detalle del usuario obtenido correctamente.",
                "data": serializer.data
            }, status=status.HTTP_200_OK)

        except UserProvider.DoesNotExist:
            return Response({
                "success": False,
                "message": "Usuario no encontrado.",
                "data": None
            }, status=status.HTTP_404_NOT_FOUND)
        
class UserUpdateAPIView(generics.UpdateAPIView):
    queryset = UserProvider.objects.all()
    serializer_class = UserSerializer

    def update(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            user = serializer.save()
            return Response({
                "success": True,
                "message": "Usuario actualizado correctamente",
                "data": serializer.data
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({
                "success": False,
                "message": str(e),
                "data": None
            }, status=status.HTTP_400_BAD_REQUEST)
        
class UserDeleteAPIView(generics.DestroyAPIView):
    queryset = UserProvider.objects.all()
    serializer_class = UserSerializer

    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            instance.delete()
            return Response({
                "success": True,
                "message": "Usuario eliminado correctamente",
                "data": None
            }, status=status.HTTP_204_NO_CONTENT)

        except UserProvider.DoesNotExist:
            return Response({
                "success": False,
                "message": "Usuario no encontrado.",
                "data": None
            }, status=status.HTTP_404_NOT_FOUND)
        

class UserSearchAPIView(generics.ListAPIView):
    queryset = UserProvider.objects.all()
    serializer_class = UserSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']

    def get(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        if not queryset.exists():
            return Response({
                "success": True,
                "message": "No se encontraron usuarios.",
                "data": []  # <- array vacío
            }, status=status.HTTP_200_OK)  # <- respuesta válida, aunque sin resultados

        serializer = self.get_serializer(queryset, many=True)
        return Response({
            "success": True,
            "message": "Usuarios filtrados correctamente.",
            "data": serializer.data
        }, status=status.HTTP_200_OK)