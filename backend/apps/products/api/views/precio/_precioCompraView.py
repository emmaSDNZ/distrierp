from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework import generics

from ....models.precio._precioCompraModel import PrecioCompraModel
from ...serializer.precio_serializer._precioCompraSerializer import PrecioCompraSerializer


# -- Listar todos los precios (histórico)
class PrecioCompraListAPIView(generics.ListAPIView):
    queryset = PrecioCompraModel.objects.all()
    serializer_class = PrecioCompraSerializer


# -- Crear nuevo precio
class PrecioCompraCreateView(generics.CreateAPIView):
    queryset = PrecioCompraModel.objects.all()
    serializer_class = PrecioCompraSerializer


# -- Detalle por ID
class PrecioCompraRetrieveAPIView(generics.RetrieveAPIView):
    queryset = PrecioCompraModel.objects.all()
    serializer_class = PrecioCompraSerializer
    lookup_field = '_id_precio_compra'


# -- Precios por producto
class PrecioCompraPorProductoListAPIView(generics.ListAPIView):
    serializer_class = PrecioCompraSerializer

    def get_queryset(self):
        producto_id = self.kwargs['producto_id']
        return PrecioCompraModel.objects.filter(
            id_producto_producto=producto_id
        ).order_by('-_create_date')


# -- Precio vigente
class PrecioCompraVigenteProductoView(APIView):
    def get(self, request, producto_id):
        # Obtener todos los precios del producto
        precios = PrecioCompraModel.objects.filter(
            id_producto_producto=producto_id
        ).order_by('-_create_date')

        if not precios.exists():
            return Response({'detail': 'No hay precios para este producto'}, status=status.HTTP_404_NOT_FOUND)

        # Tomar el precio más reciente
        precio_mas_reciente = precios.first()

        # Armar un diccionario con los distintos precios
        data = {
            'id_producto': producto_id,
            'precio_unitario': precio_mas_reciente._precio_compra_unitario,
            'precio_con_iva': precio_mas_reciente._precio_compra_con_iva,
            'precio_sin_iva': precio_mas_reciente._precio_compra_sin_iva,
            'precio_sugerido': precio_mas_reciente._precio_compra_sugerido,
            'fecha': precio_mas_reciente._create_date,
        }

        return Response(data, status=status.HTTP_200_OK)
