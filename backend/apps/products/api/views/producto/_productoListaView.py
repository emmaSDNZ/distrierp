from rest_framework import generics
from rest_framework.response import Response
from ....models.producto.productoProductoModel import ProductoTemplateModel, ProductoProductoModel
from ...serializer.producto._productoProductoListaSerializer import  ProductoTemplateConProductosSerializer


class ProductoProductoListaListAPIView(generics.ListAPIView):
    queryset = ProductoTemplateModel.objects.all().order_by("-create_date")
    serializer_class = ProductoTemplateConProductosSerializer

    def get_queryset(self):
        queryset = ProductoTemplateModel.objects.all().order_by("-create_date")
        nombre = self.request.query_params.get('nombre_base_producto', None)
        if nombre:
            queryset = queryset.filter(nombre_base_producto__icontains=nombre)
        return queryset
    

class ProductoTemplateRetrieveAPIView(generics.RetrieveAPIView):
    queryset = ProductoTemplateModel.objects.all()
    serializer_class = ProductoTemplateConProductosSerializer
    lookup_field = 'id_producto_template'

    def retrieve(self, request, *args, **kwargs):
        response = super().retrieve(request, *args, **kwargs)
        return Response({
            "success": True,
            "message": "Detalle del producto obtenido correctamente.",
            "data": response.data
        })

class ProductoProductoRetrieveAPIView(generics.RetrieveAPIView):
    queryset = ProductoProductoModel.objects.all()
    serializer_class = ProductoTemplateConProductosSerializer
    lookup_field = 'id_producto_producto'

    def get_object(self):
        producto_producto = super().get_object()
        # Retornamos el objeto relacionado ProductoTemplate, porque el serializer trabaja con ProductoTemplateModel
        return producto_producto.id_producto_template

    def retrieve(self, request, *args, **kwargs):
        producto_template = self.get_object()
        serializer = self.get_serializer(producto_template)
        return Response({
            "success": True,
            "message": "Detalle del producto obtenido correctamente (por id_producto_producto).",
            "data": serializer.data
        })