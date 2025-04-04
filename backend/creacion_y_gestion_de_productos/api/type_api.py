from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status   
from rest_framework import viewsets, permissions

from creacion_y_gestion_de_productos.models.models_type import ProductoTipo
from creacion_y_gestion_de_productos.serializers_folder.type_serializer import ProductTypeSerializer

class ProductoTipoViewSet(viewsets.ModelViewSet):
    queryset =  ProductoTipo.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = ProductTypeSerializer