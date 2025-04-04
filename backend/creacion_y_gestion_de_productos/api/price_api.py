from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status   
from rest_framework import viewsets, permissions

from creacion_y_gestion_de_productos.models.models_price import ProductoPrecio, ProductoPrecioVenta, ProductoPrecioCoste
from creacion_y_gestion_de_productos.serializers_folder.price_serializer import ProductoPrecioSerializer, ProductoPrecioCosteSerializer, ProductoPrecioVentaSerializer

class ProductoPrecioVentaViewSet(viewsets.ModelViewSet):
    queryset = ProductoPrecioVenta.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class= ProductoPrecioVentaSerializer

class ProductoPrecioCosteViewSet(viewsets.ModelViewSet):
    queryset = ProductoPrecioCoste.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class= ProductoPrecioCosteSerializer

class ProductoPrecioViewSet(viewsets.ModelViewSet):
    queryset = ProductoPrecio.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class= ProductoPrecioSerializer

