from rest_framework import serializers
from apps.products.models.usuarios._usuarioModel import UsuarioModel
from apps.products.models.usuarios._proveedorModel import ProveedorModel
from apps.products.models.usuarios._usuarioProveedorModel import UsuarioProveedorModel


class ProveedorSerializer(serializers.ModelSerializer):
    id_proveedor = serializers.IntegerField(read_only=True)
    class Meta: 
        model = ProveedorModel
        fields = ['id_proveedor','nombre_proveedor']

class UsuarioSerializer(serializers.ModelSerializer):
    id_usuario = serializers.IntegerField(read_only=True)    
    class Meta:
        model = UsuarioModel
        fields = "__all__"

class UsuarioProveedorSerializer(serializers.ModelSerializer):
    id_usuario = serializers.PrimaryKeyRelatedField(queryset=UsuarioModel.objects.all())
    id_proveedor = serializers.PrimaryKeyRelatedField(queryset=ProveedorModel.objects.all())
    
    nombre_usuario = serializers.SerializerMethodField(read_only=True)
    nombre_proveedor = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = UsuarioProveedorModel
        fields = ['id_usuario', 'id_proveedor', 'nombre_usuario', 'nombre_proveedor']

    def get_nombre_usuario(self, obj):
        return obj.id_usuario.nombre_usuario if obj.id_usuario else None

    def get_nombre_proveedor(self, obj):
        return obj.id_proveedor.nombre_proveedor if obj.id_proveedor else None

    def to_representation(self, instance):
        # Fuerza refresco de relaciones para que estén disponibles
        instance = UsuarioProveedorModel.objects.select_related('id_usuario', 'id_proveedor').get(pk=instance.pk)
        return super().to_representation(instance)