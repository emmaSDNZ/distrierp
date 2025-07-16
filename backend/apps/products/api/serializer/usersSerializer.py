from rest_framework import serializers
from apps.products.models.userProvider import UserProvider

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProvider
        fields = '__all__'

