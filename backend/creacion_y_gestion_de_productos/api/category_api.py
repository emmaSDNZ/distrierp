from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status   
from rest_framework import viewsets, permissions

from creacion_y_gestion_de_productos.models.models_category import ProductCategory
from creacion_y_gestion_de_productos.serializers_folder.category_serializer import CategorySerializer

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = ProductCategory.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = CategorySerializer
