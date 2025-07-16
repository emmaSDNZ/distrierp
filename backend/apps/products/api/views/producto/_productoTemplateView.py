from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView
from ....models.producto.productoTemplateModel import ProductoTemplateModel
from ...serializer.producto._productoSerializer import (
    ProductoTemplateSerializer 
)

# ---- ProductoTemplate ----
class ProductoTemplateCreateAPIView(generics.CreateAPIView):
    queryset = ProductoTemplateModel.objects.all()
    serializer_class = ProductoTemplateSerializer

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        print(response.data)
        nombre_producto = response.data.get(
            "nombre_base_producto", 
            "ProductoTemplateModel"
            )
        return Response({
            "success": True,
            "message": f'Producto "{nombre_producto}" creado correctamente.',
            "data": response.data
        }, status=response.status_code)


class ProductoTemplateListAPIView(generics.ListAPIView):
    serializer_class = ProductoTemplateSerializer

    def get_queryset(self):
        queryset = ProductoTemplateModel.objects.all()
        nombre = self.request.query_params.get('nombre_base_producto', None)
        if nombre:
            queryset = queryset.filter(nombre_base_producto__icontains=nombre)
        return queryset

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()  # Usa el queryset ya filtrado
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            "success": True,
            "message": "Lista de productos obtenida correctamente.",
            "data": serializer.data
        })

class ProductoTemplateDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ProductoTemplateModel.objects.all()
    serializer_class = ProductoTemplateSerializer
    lookup_field = 'id_producto_template'
    
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
            "message": "Producto actualizado correctamente.",
            "data": response.data
        })

    def destroy(self, request, *args, **kwargs):
        super().destroy(request, *args, **kwargs)
        return Response({
            "success": True,
            "message": "Producto eliminado correctamente.",
        })



class ProductoTemplateSchemaAPIView(APIView):
    def get(self, request):
        serializer = ProductoTemplateSerializer()
        fields = serializer.get_fields()
        schema = {
            field_name: {
                "type": str(field.__class__.__name__),
                "required": field.required,
                "label": field.label,
                "help_text": field.help_text
            }
            for field_name, field in fields.items()
        }
        return Response(schema)
