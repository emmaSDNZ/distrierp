from rest_framework import viewsets, permissions, filters
from creacion_y_gestion_de_productos.serializers_folder.product_product_serilizer import ProductAttributeSerializer
from creacion_y_gestion_de_productos.models.models_product_product import ProductAttribute


class ProductoAttributeViewSet(viewsets.ModelViewSet):
    queryset = ProductAttribute.objects.all().prefetch_related('attribute_values').select_related('product')
    serializer_class = ProductAttributeSerializer
    permission_classes = [permissions.AllowAny]
    

