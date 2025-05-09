from rest_framework import serializers
from apps.products.models.fileUploadProductModel import FileUploadProductModel

class FileUploadProductSerializer(serializers.ModelSerializer):
    file_product = serializers.FileField(write_only=True)
    file_name = serializers.CharField(read_only=True)

    class Meta:
        model = FileUploadProductModel
        fields = '__all__'


