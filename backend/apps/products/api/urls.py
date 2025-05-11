from django.urls import path
from apps.products.api.views.generalView import MeasureUnitList, MeasureUnitAPIView
from apps.products.api.views.productView import ProductRetrieveAPIView, ProductCreateAPIView, ProductListAPIView, ProductUpdateAPIView,ProductDestroyAPIView
from apps.products.api.views.typeProductView import TypeProductAPIView, TypeProductCreateAPIView, TypeProductDetailView
from apps.products.api.views.categoryView import CategoryListAPIView, CategoryCreateAPIView, CategoryDetailView
from apps.products.api.views.nameAttributeView import NameAttributeAPIView, NameAttributeCreateAPIView, NameAttributeRetrieveAPIView, NameAttributeUpdateAPIView, NameAttributeDestroyAPIView
from apps.products.api.views.valueAttributeView import ValueAttributeAPIView, ValueAttributeCreateAPIView, ValueAttributeRetrieveAPIView, ValueAttributeUpdateAPIView, ValueAttributeDestroyAPIView
from apps.products.api.views.variantProductView import VariantProductCreateAPIView, VariantProductListAPIView, VariantProductRetrieveAPIView, VariantProductUpdateAPIView, VariantProductDestroyAPIView
from apps.products.api.views.usersView import  UserListAPIView,UserCreateAPIView, UserRetrieveAPIView, UserUpdateAPIView, UserDeleteAPIView, UserSearchAPIView
from apps.products.api.views.supplierProductView import SupplierProductCreateAPIView, SupplierProductListAPIView, SupplierProductRetrieveAPIView, SupplierProductUpdateAPIView, SupplierProductDestroyAPIView, SupplierProductFilterAPIView, SupplierProductByProductIdView
from apps.products.api.views.fileUploadProductView import FileUploeadProductCreateAPIView, FileUploeadProductListAPIView, FileUploeadProductVeryfyAPIView
from apps.products.api.views.recordAuditView import RecordAuditListAPIView
from apps.products.api.views.ImportPorductsView import ImportarProductosAPIView
urlpatterns = [
    # Endpoints de atributos:Nombre 
    path('variant/product/create/', VariantProductCreateAPIView.as_view(), name='variant_product_create'),
    path('variant/product/list/', VariantProductListAPIView.as_view(), name='variant_product_list'),
    path('variant/product/<int:pk>/', VariantProductRetrieveAPIView.as_view(), name='variant_product_detail'),
    path('variant/product/update/<int:pk>/', VariantProductUpdateAPIView.as_view(), name='variant_product_update'),
    path('variant/product/delete/<int:pk>/', VariantProductDestroyAPIView.as_view(), name='variant_product_delete'),

    # Endpoints de atributos:Nombre
    path('attribute/name/list/', NameAttributeAPIView.as_view(), name='name_attribute_list'),
    path('attribute/name/create/', NameAttributeCreateAPIView.as_view(), name='name_attribute_create'),
    path('attribute/name/<int:pk>/', NameAttributeRetrieveAPIView.as_view(), name='detail_name_attribute_id'),  
    path('attribute/name/update/<int:pk>/', NameAttributeUpdateAPIView.as_view(), name='update_name_attribute_update'),  
    path('attribute/name/delete/<int:pk>/', NameAttributeDestroyAPIView.as_view(), name='delet_name_attribute_delete'),
    
    # Endpoints de atributos: Valores
    path('attribute/value/list/', ValueAttributeAPIView.as_view(), name='value_attribute_list'),
    path('attribute/value/create/', ValueAttributeCreateAPIView.as_view(), name='value_attribute_create'),
    path('attribute/value/<int:pk>/', ValueAttributeRetrieveAPIView.as_view(), name='detail_value_attribute_id'),  
    path('attribute/value/update/<int:pk>/', ValueAttributeUpdateAPIView.as_view(), name='update_value_attribute_update'),  
    path('attribute/value/delete/<int:pk>/', ValueAttributeDestroyAPIView.as_view(), name='delete_value_attribute_delete'),

    # Endpoints de type
    path('products/type/list/', TypeProductAPIView.as_view(), name='type_product'),
    path('products/type/create/', TypeProductCreateAPIView.as_view(), name='type_product'),
    path('products/type/<int:pk>/', TypeProductDetailView.as_view(), name='type_product_detail'),


    # Endpoints de productos
    path('products/list/', ProductListAPIView.as_view(), name='product_list'),
    path('products/create/', ProductCreateAPIView.as_view(), name='product_create'),
    path('products/<int:pk>/', ProductRetrieveAPIView.as_view(), name='product_detail'),
    path('products/update/<int:pk>/', ProductUpdateAPIView.as_view(), name='product_update'),
    path('products/delete/<int:pk>/', ProductDestroyAPIView.as_view(), name='product_delete'),

    # Endpoints de unidades de medidaéxito
    path('measure_unit/', MeasureUnitList.as_view(), name='measure_unit_list'),
    path('measure_unit/create/', MeasureUnitAPIView.as_view(), name='measure_unit_create'),   

    # Endpoints de categorias productos
    path('categories/list/', CategoryListAPIView.as_view(), name='category_list'),
    path('categories/create/', CategoryCreateAPIView.as_view(), name='category_create'),
    path('categories/<int:pk>/', CategoryDetailView.as_view(), name='category_detail'),

    #Enpoint Users
    path('users/list/', UserListAPIView.as_view(), name='user_list'), 
    path('users/search/', UserSearchAPIView.as_view(), name='user_search'), 
    path('users/create/', UserCreateAPIView.as_view(), name='user_create'), 
    path('users/<int:pk>/', UserRetrieveAPIView.as_view(), name='user_detail'),  
    path('users/update/<int:pk>/', UserUpdateAPIView.as_view(), name='user_update'), 
    path('users/delete/<int:pk>/', UserDeleteAPIView.as_view(), name='user_delete'),

    #Endpoint de productos proveedores
    path('supplier/product/create/', SupplierProductCreateAPIView.as_view(), name='supplier_product_create'),
    path('supplier/product/list/', SupplierProductListAPIView.as_view(), name='supplier_product_list'),
    path('supplier/product/<int:pk>/', SupplierProductRetrieveAPIView.as_view(), name='supplier_product_detail'),
    path('supplier/product/update/<int:pk>/', SupplierProductUpdateAPIView.as_view(), name='supplier_product_update'),
    path('supplier/product/delete/<int:pk>/', SupplierProductDestroyAPIView.as_view(), name='supplier_product_delete'),
    path('supplier/product/filter/', SupplierProductFilterAPIView.as_view(), name='supplier_product_filter'),
    path('supplier/product/by-product/', SupplierProductByProductIdView.as_view(), name='supplier-product-by-product-id'),
    
    # Endpoint de carga de productos
    path('products/upload/veryfy/', FileUploeadProductVeryfyAPIView.as_view(), name='upload_product verydy'),
    path('products/upload/create/', FileUploeadProductCreateAPIView.as_view(), name='upload_product create'),  
    path('products/upload/list/', FileUploeadProductListAPIView.as_view(), name='upload_product list'),  
    
    # Endpoint de carga de productos
    path('audit/product/list/', RecordAuditListAPIView.as_view(), name='audit product list'),

    path('importar-productos/', ImportarProductosAPIView.as_view(), name='importar_productos'),
]