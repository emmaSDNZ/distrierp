from rest_framework import generics
from rest_framework.response import Response

from apps.products.models.usuarios._usuarioModel import UsuarioModel
from apps.products.models.usuarios._proveedorModel import ProveedorModel
from apps.products.models.usuarios._usuarioProveedorModel import UsuarioProveedorModel

from apps.products.api.serializer.serialier_usuarios._usuariosSerializer import (
    UsuarioSerializer, ProveedorSerializer, UsuarioProveedorSerializer
)

# ===========================
#           USUARIO
# ===========================

class UsuarioCreateAPIView(generics.CreateAPIView):
    queryset = UsuarioModel.objects.all()
    serializer_class = UsuarioSerializer

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        return Response({
            "success": True,
            "message": "Usuario creado correctamente.",
            "data": response.data
        }, status=response.status_code)

class UsuarioListAPIView(generics.ListAPIView):
    serializer_class = UsuarioSerializer

    def get_queryset(self):
        return UsuarioModel.objects.all()

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            "success": True,
            "message": "Lista de usuarios obtenida correctamente.",
            "data": serializer.data
        })

class UsuarioDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = UsuarioModel.objects.all()
    serializer_class = UsuarioSerializer
    lookup_field = 'id_usuario'  # Cambiar si usás otro campo

    def retrieve(self, request, *args, **kwargs):
        response = super().retrieve(request, *args, **kwargs)
        return Response({
            "success": True,
            "message": "Detalle del usuario obtenido correctamente.",
            "data": response.data
        })

    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        return Response({
            "success": True,
            "message": "Usuario actualizado correctamente.",
            "data": response.data
        })

    def destroy(self, request, *args, **kwargs):
        super().destroy(request, *args, **kwargs)
        return Response({
            "success": True,
            "message": "Usuario eliminado correctamente."
        }, status=204)

# ===========================
#          PROVEEDOR
# ===========================

class ProveedorCreateAPIView(generics.CreateAPIView):
    queryset = ProveedorModel.objects.all()
    serializer_class = ProveedorSerializer

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        return Response({
            "success": True,
            "message": "Proveedor creado correctamente.",
            "data": response.data
        }, status=response.status_code)

class ProveedorListAPIView(generics.ListAPIView):
    serializer_class = ProveedorSerializer

    def get_queryset(self):
        queryset = ProveedorModel.objects.all()
        nombre_proveedor = self.request.query_params.get('nombre_proveedor', None)
        if nombre_proveedor:
            # Filtro case-insensitive que contenga el texto en nombre_proveedor
            queryset = queryset.filter(nombre_proveedor__icontains=nombre_proveedor)
        return queryset

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            "success": True,
            "message": "Lista de proveedores obtenida correctamente.",
            "data": serializer.data
        })

class ProveedorDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ProveedorModel.objects.all()
    serializer_class = ProveedorSerializer
    lookup_field = 'id_proveedor'

    def retrieve(self, request, *args, **kwargs):
        response = super().retrieve(request, *args, **kwargs)
        return Response({
            "success": True,
            "message": "Detalle del proveedor obtenido correctamente.",
            "data": response.data
        })

    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        return Response({
            "success": True,
            "message": "Proveedor actualizado correctamente.",
            "data": response.data
        })

    def destroy(self, request, *args, **kwargs):
        super().destroy(request, *args, **kwargs)
        return Response({
            "success": True,
            "message": "Proveedor eliminado correctamente."
        }, status=204)

# ===========================
#      USUARIO - PROVEEDOR
# ===========================

class UsuarioProveedorCreateAPIView(generics.CreateAPIView):
    queryset = UsuarioProveedorModel.objects.all()
    serializer_class = UsuarioProveedorSerializer

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        return Response({
            "success": True,
            "message": "Relación Usuario-Proveedor creada correctamente.",
            "data": response.data
        }, status=response.status_code)

class UsuarioProveedorListAPIView(generics.ListAPIView):
    serializer_class = UsuarioProveedorSerializer

    def get_queryset(self):
        return UsuarioProveedorModel.objects.all()

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            "success": True,
            "message": "Lista de relaciones Usuario-Proveedor obtenida correctamente.",
            "data": serializer.data
        })

class UsuarioProveedorDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = UsuarioProveedorModel.objects.all()
    serializer_class = UsuarioProveedorSerializer
    lookup_field = 'id'

    def retrieve(self, request, *args, **kwargs):
        response = super().retrieve(request, *args, **kwargs)
        return Response({
            "success": True,
            "message": "Detalle de relación Usuario-Proveedor obtenido correctamente.",
            "data": response.data
        })

    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        return Response({
            "success": True,
            "message": "Relación Usuario-Proveedor actualizada correctamente.",
            "data": response.data
        })

    def destroy(self, request, *args, **kwargs):
        super().destroy(request, *args, **kwargs)
        return Response({
            "success": True,
            "message": "Relación Usuario-Proveedor eliminada correctamente."
        }, status=204)
