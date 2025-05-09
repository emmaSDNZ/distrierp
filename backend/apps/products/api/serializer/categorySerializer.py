from rest_framework import serializers
from apps.products.models.categoryModel import Category

class RecursiveCategorySerializer(serializers.ModelSerializer):
    children = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ('id', 'name', 'parent', 'children')

    def get_children(self, obj):
        # Obtener el parámetro de profundidad del contexto o asumir 0
        depth = self.context.get('depth', 0)

        # Establecer una profundidad máxima (por ejemplo, 3 niveles)
        if depth >= 3:
            return []

        children = obj.children.all()
        return RecursiveCategorySerializer(
            children,
            many=True,
            context={**self.context, 'depth': depth + 1}
        ).data
class CategorySerializer(serializers.ModelSerializer):
    children_ids = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
        required=False
    )
    children = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'parent', 'children_ids', 'children']

    def get_children(self, obj):
        children = obj.children.all()
        return RecursiveCategorySerializer(children, many=True, context=self.context).data

    def update(self, instance, validated_data):
        children_ids = validated_data.pop('children_ids', None)

        # Actualizamos nombre y parent
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if children_ids is not None:
            # Desvincular hijos actuales
            Category.objects.filter(parent=instance).update(parent=None)

            # Vincular nuevos hijos
            for child_id in children_ids:
                try:
                    child = Category.objects.get(id=child_id)
                    child.parent = instance
                    child.save()
                except Category.DoesNotExist:
                    pass  # ignoramos hijos inválidos

        return instance

class CategoryNestedSerializer(serializers.Serializer):
    id = serializers.IntegerField(required=False)
    name =  serializers.CharField(required=False)

    def validate(self, data):
        if not data.get("id") and data.get("name"):
            raise serializers.ValidationError("se debe proveer Id o Name para la categoria")
        return data