from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from apps.products.models.models import MeasureUnit, CategoryProduct
from apps.products.api.serializer.generalSerializer import MeasureUnitSerializer, CategoryProductSerializer


class MeasureUnitList(generics.ListAPIView):
    serializer_class= MeasureUnitSerializer

    def get_queryset(self):
        return MeasureUnit.objects.filter(state=True)

class MeasureUnitAPIView(APIView):
    #Lista de productos y crear un producto
    # Crear un producto
    def post(self, request):
        serializer = MeasureUnitSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CategoryProductAPIView(APIView):
    #Lista de productos y crear un producto
    # Crear un producto
    def post(self, request):
        serializer = MeasureUnitSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


