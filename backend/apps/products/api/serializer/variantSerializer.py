from rest_framework import serializers
from apps.products.models.variantProductModel import VariantAttribute, VariantProduct
from apps.products.models.attributeModel import NameAttribute, ValueAttribute

class VariantAttributeSerializer(serializers.ModelSerializer):
    attribute_name_id = serializers.PrimaryKeyRelatedField(
        source='attribute_name', queryset=NameAttribute.objects.all(), write_only=True
    )
    attribute_value_id = serializers.PrimaryKeyRelatedField(
        source='attribute_value', queryset=ValueAttribute.objects.all(), write_only=True
    )

    attribute_name = serializers.CharField(source='attribute_name.name', read_only=True)
    attribute_value = serializers.CharField(source='attribute_value.value', read_only=True)
    price_extra = serializers.DecimalField(source='attribute_value.price_extra', max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = VariantAttribute
        fields = [
            'attribute_name_id',
            'attribute_value_id',
            'attribute_name',
            'attribute_value',
            'price_extra'
        ]


class VariantProductSerializer(serializers.ModelSerializer):
    variant_attributes = VariantAttributeSerializer(many=True, write_only=True)
    attributes = serializers.SerializerMethodField(read_only=True)

    product_id = serializers.IntegerField(source='product.id', read_only=True)
    product_name = serializers.CharField(source='product.name', read_only=True)

    class Meta:
        model = VariantProduct
        fields = ['id', 'product', 'product_id', 'product_name', 'sku', 'variant_attributes', 'attributes']

    def create(self, validated_data):
        attributes_data = validated_data.pop('variant_attributes')
        variant = VariantProduct.objects.create(**validated_data)
        for attr in attributes_data:
            VariantAttribute.objects.create(
                variant=variant,
                attribute_name=attr['attribute_name'],
                attribute_value=attr['attribute_value']
            )
        return variant

    def get_attributes(self, obj):
        variant_attrs = VariantAttribute.objects.filter(variant=obj)
        return VariantAttributeSerializer(variant_attrs, many=True).data
 
"""

{
  "product": 1,
  "sku": "SKU-NEGRO-L-002",
  "variant_attributes": [
    {
      "attribute_name_id": 1,
      "attribute_value_id": 3
    },
    {
      "attribute_name_id": 2,
      "attribute_value_id": 5
    }
  ]
}

"""