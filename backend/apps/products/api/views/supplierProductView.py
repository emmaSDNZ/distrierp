import pandas as pd
from rest_framework import generics, status
from rest_framework.response import Response
from apps.products.models.supplierPoductModel import SupplierProduct
from apps.products.api.serializer.supplierPoductSerializer import SupplierProductCreateSerializer, SupplierProductListSerializer
from dataAnalytics.services import get_supplier_product_df

class SupplierProductCreateAPIView(generics.CreateAPIView):
    serializer_class = SupplierProductCreateSerializer
    queryset = SupplierProduct.objects.all()

    def create(self, request, *args, **kwargs):
        # Validar y crear la relación entre producto y proveedor usando solo los IDs
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)  # Lanza una excepción si los datos no son válidos
        supplier_product = serializer.save()
        print(serializer.data)
        # Respuesta al cliente
        return Response({
            "success": True,
            "message": "Relación Producto-Proveedor creada correctamente.",
            "data": serializer.data
        }, status=status.HTTP_201_CREATED)

class SupplierProductListAPIView(generics.ListAPIView):
    serializer_class = SupplierProductListSerializer
    queryset = SupplierProduct.objects.all()

    def get(self, request, *args, **kwargs):
        # Listar todas las relaciones entre productos y proveedores
        supplier_products = self.get_queryset()
        serializer = self.get_serializer(supplier_products, many=True)
        return Response({
            "success": True,
            "message": "Lista de relaciones Producto-Proveedor obtenida correctamente.",
            "data": serializer.data
        }, status=status.HTTP_200_OK)
    

class SupplierProductRetrieveAPIView(generics.RetrieveAPIView):
    serializer_class = SupplierProductListSerializer
    queryset = SupplierProduct.objects.all()

    def get(self, request, *args, **kwargs):
        # Obtener una relación entre producto y proveedor por ID
        supplier_product = self.get_object()
        serializer = self.get_serializer(supplier_product)
        return Response({
            "success": True,
            "message": "Relación Producto-Proveedor obtenida correctamente.",
            "data": serializer.data
        }, status=status.HTTP_200_OK)

class SupplierProductUpdateAPIView(generics.UpdateAPIView):
    serializer_class = SupplierProductCreateSerializer
    queryset = SupplierProduct.objects.all()

    def update(self, request, *args, **kwargs):
        # Actualizar una relación entre producto y proveedor
        supplier_product = self.get_object()
        serializer = self.get_serializer(supplier_product, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        supplier_product = serializer.save()
        return Response({
            "success": True,
            "message": "Relación Producto-Proveedor actualizada correctamente.",
            "data": serializer.data
        }, status=status.HTTP_200_OK)

class SupplierProductDestroyAPIView(generics.DestroyAPIView):
    serializer_class = SupplierProductListSerializer
    queryset = SupplierProduct.objects.all()

    def destroy(self, request, *args, **kwargs):
        # Eliminar una relación entre producto y proveedor
        supplier_product = self.get_object()
        supplier_product.delete()
        return Response({
            "success": True,
            "message": "Relación Producto-Proveedor eliminada correctamente."
        }, status=status.HTTP_204_NO_CONTENT)

class SupplierProductFilterAPIView(generics.ListAPIView):
    serializer_class = SupplierProductListSerializer

    def get(self, request, *args, **kwargs):
        product_id = request.query_params.get('product_id')
        supplier_id = request.query_params.get('supplier_id')

        df, serializer = get_supplier_product_df(product_id, supplier_id)

        print(df.head())  # Debug si querés
        return Response({
            "success": True,
            "message": "Lista de relaciones FILTRO Producto-Proveedor obtenida correctamente.",
            "data": serializer.data
        }, status=status.HTTP_200_OK)