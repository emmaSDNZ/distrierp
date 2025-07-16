# VIEWS: _precioBaseView.py
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView

from ....models.precio._precioBaseModel import PrecioBaseModel
from ...serializer.precio_serializer._precioBaseSerializer import PrecioBaseSerializer

class PrecioBaseListAPIView(generics.ListAPIView):
    queryset = PrecioBaseModel.objects.all()
    serializer_class = PrecioBaseSerializer

class PrecioBaseCreateView(generics.CreateAPIView):
    queryset = PrecioBaseModel.objects.all()
    serializer_class = PrecioBaseSerializer

class PrecioBaseRetrieveAPIView(generics.RetrieveAPIView):
    queryset = PrecioBaseModel.objects.all()
    serializer_class = PrecioBaseSerializer
    lookup_field = '_id_precio_base'

class PrecioBasePorProductoListAPIView(generics.ListAPIView):
    serializer_class = PrecioBaseSerializer

    def get_queryset(self):
        producto_id = self.kwargs['producto_id']
        return PrecioBaseModel.objects.filter(
            id_producto_producto=producto_id
        ).order_by('-_create_date')

class PrecioBaseVigenteProductoView(APIView):
    def get(self, request, producto_id):
        precio = PrecioBaseModel.objects.filter(
            id_producto_producto=producto_id
        ).order_by('-_create_date').first()

        if not precio:
            return Response({'detail': 'No hay precios base para este producto'}, status=status.HTTP_404_NOT_FOUND)

        serializer = PrecioBaseSerializer(precio)
        return Response(serializer.data)

