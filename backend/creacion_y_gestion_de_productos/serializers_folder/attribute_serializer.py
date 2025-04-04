from rest_framework import serializers
from creacion_y_gestion_de_productos.models.models_attribute import AttributeName, AttributeValue, AttributeNameValue


# Serializador para AttributeValue
class AttributeValueSerializer(serializers.ModelSerializer):
    class Meta:
        model = AttributeValue
        fields = ['id', 'value','price_extra','free_text','created_at']

# Serializador para AttributeName
class AttributeNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = AttributeName
        fields = ['id', 'name_attr', 'created_at']

# Serializador para AttributeNameValue
# Serializador para AttributeNameValue
class AttributeNameValueSerializer(serializers.ModelSerializer):
    name_attr = serializers.PrimaryKeyRelatedField(queryset=AttributeName.objects.all())
    values = serializers.PrimaryKeyRelatedField(queryset=AttributeValue.objects.all(), many=True)

    class Meta:
        model = AttributeNameValue
        fields = ['id', 'name_attr', 'values', 'created_at']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['name_attr'] = AttributeNameSerializer(instance.name_attr).data
        representation['values'] = AttributeValueSerializer(instance.values.all(), many=True).data
        return representation