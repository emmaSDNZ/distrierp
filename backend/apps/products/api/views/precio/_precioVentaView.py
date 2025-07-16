
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework import generics
from ....models.precio._precioVentaModel import PrecioVentaModel
from ...serializer.precio_serializer._precioVentaSerializer import (
     PrecioVentaSerializer
)


# ----Precio Venta ----

# --Listar todos los precios(Historico)
class PrecioVentaListAPIView(generics.ListAPIView):
    queryset = PrecioVentaModel.objects.all().order_by('-_create_date')
    serializer_class = PrecioVentaSerializer


# --Crear un nuevo precio
class PrecioVentaCreateView(generics.CreateAPIView):
    queryset = PrecioVentaModel.objects.all()
    serializer_class = PrecioVentaSerializer


# --Detalle de un precio por ID
class PrecioVentaRetrieveAPIView(generics.RetrieveAPIView):
    queryset = PrecioVentaModel.objects.all()
    serializer_class = PrecioVentaSerializer
    lookup_field = '_id_precio_venta'


# --Lista de Precios por producto
class PrecioVentaPorProductoListAPIView(generics.ListAPIView):
    serializer_class = PrecioVentaSerializer

    def get_queryset(self):
        producto_id = self.kwargs['producto_id']
        return PrecioVentaModel.objects.filter(
            id_producto_producto=producto_id).order_by('-_create_date')


# --Precio vigente (ultimo por fecha)
class PrecioVigenteProductoView(APIView):
    def get(self, request, producto_id):
        precio = PrecioVentaModel.objects.filter(
            id_producto_producto=producto_id
        ).order_by('-_create_date').first()

        if not precio:
            return Response({'detail': 'No hay precios para este producto'}, status=status.HTTP_404_NOT_FOUND)

        serializer = PrecioVentaSerializer(precio)
        return Response(serializer.data)