from rest_framework import generics
from rest_framework.response import Response
from ....models.producto.productoProductoModel import ProductoProductoModel
from ...serializer.producto._productoSerializer import ProductoProductoSerializer


class ProductoProductoCreateAPIView(generics.CreateAPIView):
    queryset = ProductoProductoModel.objects.all()
    serializer_class = ProductoProductoSerializer

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        return Response({
            "success": True,
            "message": "Producto creado correctamente.",
            "data": response.data
        })


class ProductoProductoListAPIView(generics.ListAPIView):
    queryset = ProductoProductoModel.objects.all()
    serializer_class = ProductoProductoSerializer

    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        return Response({
            "success": True,
            "message": "Listado de productos obtenido correctamente.",
            "data": response.data
        })


class ProductoProductoDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ProductoProductoModel.objects.all()
    serializer_class = ProductoProductoSerializer
    lookup_field = 'id_producto_producto'

    def retrieve(self, request, *args, **kwargs):
        response = super().retrieve(request, *args, **kwargs)
        return Response({
            "success": True,
            "message": "Detalle del producto obtenido correctamente.",
            "data": response.data
        })

    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        return Response({
            "success": True,
            "message": "Datos del producto actualizados correctamente.",
            "data": response.data
        })

    def destroy(self, request, *args, **kwargs):
        super().destroy(request, *args, **kwargs)
        return Response({
            "success": True,
            "message": "Producto eliminado correctamente."
        })
