from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status   
from rest_framework import viewsets, permissions

from creacion_y_gestion_de_productos.models.models_product import Producto
from creacion_y_gestion_de_productos.serializers_folder.product_serializer import ProductSerializer

class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = ProductSerializer

    def create(self, request, *args, **kwargs):
        print("Datos recibidos:", request.data)  # Para verificar los datos enviados
        return super().create(request, *args, **kwargs)
    
    @action(detail=True, methods=['post'])
    def done(self, request, pk=None):
        producto = self.get_object()
        producto.done = not producto.done
        producto.save()
        return Response({
            'status': 'producto marked as done' 
            if producto.done 
            else 'producto marked as not done'
        }, status.HTTP_200_OK)
    

