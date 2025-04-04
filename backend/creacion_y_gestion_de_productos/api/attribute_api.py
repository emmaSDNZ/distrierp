from rest_framework import viewsets, permissions, filters

from creacion_y_gestion_de_productos.models.models_attribute import AttributeName, AttributeValue, AttributeNameValue
from creacion_y_gestion_de_productos.serializers_folder.attribute_serializer import AttributeNameSerializer, AttributeValueSerializer, AttributeNameValueSerializer

# ViewSet para AttributeName
class AttributeNameViewSet(viewsets.ModelViewSet):
    queryset = AttributeName.objects.all()
    serializer_class = AttributeNameSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [filters.SearchFilter]
    search_fields = ["name_attr"]

# ViewSet para AttributeValue
class AttributeValueViewSet(viewsets.ModelViewSet):
    queryset = AttributeValue.objects.all()
    serializer_class = AttributeValueSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [filters.SearchFilter]
    search_fields = ["value"]


# ViewSet para AttributeNameValue

class AttributeNameValueViewSet(viewsets.ModelViewSet):
    queryset = AttributeNameValue.objects.all().prefetch_related('values').select_related('name_attr')
    serializer_class = AttributeNameValueSerializer
    permission_classes = [permissions.AllowAny]