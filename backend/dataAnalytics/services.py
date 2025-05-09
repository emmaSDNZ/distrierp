import pandas as pd
from apps.products.models.supplierPoductModel import SupplierProduct
from apps.products.api.serializer.supplierPoductSerializer import SupplierProductListSerializer


def get_supplier_product_df(product_id=None, supplier_id=None):
    """
    Retorna un DataFrame con los product_id asociados a un supplier.

    Parámetros:
        - product_id (str): ID del producto (opcional).
        - supplier_id (str): ID del proveedor (opcional).

    Retorna:
        - df (DataFrame): DataFrame con los product_id de las relaciones.
        - serializer_data (list): Datos serializados completos (opcional para vistas).
    """

    queryset = SupplierProduct.objects.all()

    if product_id:
        queryset = queryset.filter(product_id=product_id)
    if supplier_id:
        queryset = queryset.filter(supplier_id=supplier_id)
    
    serializer = SupplierProductListSerializer(queryset, many=True)

    products = [item["product_id"] for item in serializer.data]
    df = pd.DataFrame(products)

    return df, serializer


