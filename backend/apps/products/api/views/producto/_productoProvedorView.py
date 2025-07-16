from rest_framework import generics
from rest_framework.response import Response
from ....models.producto._productoProveedor import ProductoProveedorModel
from ....models.usuarios._usuarioProveedorModel import ProveedorModel
from ...serializer.producto._productoProveedorSerialzador import ProductoProveedorSerializer


class ProductoProveedorListAPIView(generics.ListAPIView):
    serializer_class = ProductoProveedorSerializer

    def get_queryset(self):
        queryset = ProductoProveedorModel.objects.all().order_by("-id_producto_proveedor")
        
        id_proveedor = self.request.query_params.get('id_proveedor')
        if id_proveedor:
            queryset = queryset.filter(id_proveedor=id_proveedor)

        id_producto = self.request.query_params.get('id_producto_producto')
        if id_producto:
            queryset = queryset.filter(id_producto_producto=id_producto)

        return queryset

    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        return Response({
            "success": True,
            "message": "Listado de relaciones producto-proveedor obtenido correctamente.",
            "data": response.data
        })

    
class ProductoProveedorCreateAPIView(generics.CreateAPIView):
    queryset = ProductoProveedorModel.objects.all()
    serializer_class = ProductoProveedorSerializer

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        return Response({
            "success": True,
            "message": "Proveedor asignado correctamente al producto.",
            "data": response.data
        })
class ProductoProveedorDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ProductoProveedorModel.objects.all()
    serializer_class = ProductoProveedorSerializer
    lookup_field = 'id_producto_proveedor'

    def retrieve(self, request, *args, **kwargs):
        response = super().retrieve(request, *args, **kwargs)
        return Response({
            "success": True,
            "message": "Detalle del proveedor del producto obtenido correctamente.",
            "data": response.data
        })

    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        return Response({
            "success": True,
            "message": "Datos del proveedor del producto actualizados correctamente.",
            "data": response.data
        })

    def destroy(self, request, *args, **kwargs):
        super().destroy(request, *args, **kwargs)
        return Response({
            "success": True,
            "message": "Proveedor eliminado correctamente del producto."
        })

class ProductoProveedorByProveedorAPIView(generics.ListAPIView):
    serializer_class = ProductoProveedorSerializer

    def get_queryset(self):
        id_proveedor = self.kwargs.get("id_proveedor")
        return ProductoProveedorModel.objects.filter(id_proveedor=id_proveedor)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            "success": True,
            "message": f"Productos del proveedor {kwargs.get('id_proveedor')} listados correctamente.",
            "data": serializer.data
        })