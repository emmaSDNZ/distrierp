from django.urls import path
from apps.products.api.views.nameAttributeView import NameAttributeAPIView, NameAttributeCreateAPIView, NameAttributeRetrieveAPIView, NameAttributeUpdateAPIView, NameAttributeDestroyAPIView
from apps.products.api.views.valueAttributeView import ValueAttributeAPIView, ValueAttributeCreateAPIView, ValueAttributeRetrieveAPIView, ValueAttributeUpdateAPIView, ValueAttributeDestroyAPIView
from apps.products.api.views.variantProductView import VariantProductCreateAPIView, VariantProductListAPIView, VariantProductRetrieveAPIView, VariantProductUpdateAPIView, VariantProductDestroyAPIView
from apps.products.api.views.fileUploadProductView import FileUploeadProductCreateAPIView, FileUploeadProductListAPIView, FileUploeadProductVeryfyAPIView
from apps.products.api.views.recordAuditView import RecordAuditListAPIView,RecordAuditDetailAPIView



from ...products.api.views.producto._productoTemplateView import (
    ProductoTemplateCreateAPIView, 
    ProductoTemplateListAPIView,
    ProductoTemplateDetailAPIView, 
    ProductoTemplateSchemaAPIView
)


from ...products.api.views.producto._productoProductoView import (
    ProductoProductoCreateAPIView,
    ProductoProductoListAPIView,
    ProductoProductoDetailAPIView
)

from ...products.api.views.producto._productoListaView import (
    ProductoProductoListaListAPIView, 
    ProductoTemplateRetrieveAPIView,
    ProductoProductoRetrieveAPIView) 


from ...products.api.views.precio._precioVentaView import (
    PrecioVentaListAPIView,
    PrecioVentaCreateView,
    PrecioVentaRetrieveAPIView,
    PrecioVentaPorProductoListAPIView,
    PrecioVigenteProductoView
)

from ...products.api.views.precio._precioCompraView import (
    PrecioCompraListAPIView,
    PrecioCompraCreateView,
    PrecioCompraRetrieveAPIView,
    PrecioCompraPorProductoListAPIView,
    PrecioCompraVigenteProductoView
)
from ...products.api.views.precio._precioBaseView import (
    PrecioBaseListAPIView,
    PrecioBaseCreateView,
    PrecioBaseRetrieveAPIView,
    PrecioBasePorProductoListAPIView,
    PrecioBaseVigenteProductoView
)


from ...products.api.views.producto._productoProvedorView import (
    ProductoProveedorListAPIView,
    ProductoProveedorCreateAPIView,
    ProductoProveedorDetailAPIView,
    ProductoProveedorByProveedorAPIView
)

from ...products.api.views.usuario._usuariosView import (
    UsuarioCreateAPIView,
    UsuarioListAPIView, 
    UsuarioDetailAPIView,
    ProveedorCreateAPIView,
    ProveedorDetailAPIView,
    ProveedorListAPIView,
    UsuarioProveedorCreateAPIView,
    UsuarioProveedorDetailAPIView,
    UsuarioProveedorListAPIView
    )

from ...products.api.views.csv.analizarCsvView import AnalizarCSVAPIView
from ...products.api.views.csv.procesarCsvView import ProcesarCSVAPIView
urlpatterns = [

        # ───────────────  CSV  ───────────────
    path('csv/analizar/', AnalizarCSVAPIView.as_view(), name='analizar-csv'),
    path('csv/procesar/', ProcesarCSVAPIView.as_view(), name='procesar-csv'),

        # ───────────────  USUARIOS  ───────────────
    path('usuarios/usuario/', UsuarioListAPIView.as_view(), name='usuario-list'),
    path('usuarios/usuario/create/', UsuarioCreateAPIView.as_view(), name='usuario-create'),
    # Si tu lookup_field en la vista es id, el parámetro puede llamarse <int:id>
    path('usuarios/usuario/<int:id_usuario>/', UsuarioDetailAPIView.as_view(), name='usuario-detail'),

    # ──────────────  PROVEEDORES  ─────────────
    path('usuarios/proveedor/', ProveedorListAPIView.as_view(), name='proveedor-list'),
    path('usuarios/proveedor/create/', ProveedorCreateAPIView.as_view(), name='proveedor-create'),
    # Aquí el parámetro coincide con lookup_field='id_proveedor'
    path('usuarios/proveedor/<int:id_proveedor>/', ProveedorDetailAPIView.as_view(), name='proveedor-detail'),

    # ───────  USUARIO – PROVEEDOR (relación) ───────
    path('usuarios/usuarios-proveedores/', UsuarioProveedorListAPIView.as_view(), name='usuario-proveedor-list'),
    path('usuarios/usuarios-proveedores/create/', UsuarioProveedorCreateAPIView.as_view(), name='usuario-proveedor-create'),
    
    # lookup_field='id' en tu vista de detalle
    path('usuarios/usuarios-proveedores/<int:id>/', UsuarioProveedorDetailAPIView.as_view(), name='usuario-proveedor-detail'),


    # ───────  PRODUCTO – PROVEEDOR (relación) ───────
    path('producto/producto-proveedor/list/', ProductoProveedorListAPIView.as_view(), name='producto-proveedor-list'),
    path('producto/producto-proveedor/create/', ProductoProveedorCreateAPIView.as_view(), name='producto-proveedor-create'),
    path('producto/producto-proveedor/by-proveedor/<int:id_proveedor>/',ProductoProveedorByProveedorAPIView.as_view(),name='producto-proveedor-by-proveedor'),
    path('producto/producto-proveedor/<int:id_producto_proveedor>/', ProductoProveedorDetailAPIView.as_view(), name='producto-proveedor-detail'),

    # Endpoints Precio Base
    path('precio-base/', PrecioBaseListAPIView.as_view(), name='precio-base-list'),
    path('precio-base/create/', PrecioBaseCreateView.as_view(), name='precio-base-create'),
    path('precio-base/<int:_id_precio_base>/', PrecioBaseRetrieveAPIView.as_view(), name='precio-base-detail'),
    path('precio-base/producto/<int:producto_id>/', PrecioBasePorProductoListAPIView.as_view(), name='precio-base-por-producto'),
    path('precio-base/vigente/<int:producto_id>/', PrecioBaseVigenteProductoView.as_view(), name='precio-base-vigente'),


    # Endpoints Precio Compra
    path('precio-compra/', PrecioCompraListAPIView.as_view(), name='precio-compra-list'),
    path('precio-compra/create/', PrecioCompraCreateView.as_view(), name='precio-compra-create'),
    path('precio-compra/<int:_id_precio_compra>/', PrecioCompraRetrieveAPIView.as_view(), name='precio-compra-detail'),
    path('precio-compra/producto/<int:producto_id>/', PrecioCompraPorProductoListAPIView.as_view(), name='precio-compra-por-producto'),
    path('precio-compra/vigente/<int:producto_id>/', PrecioCompraVigenteProductoView.as_view(), name='precio-compra-vigente'),

    #Enpoint Precio Venta
    path('precio-venta/', PrecioVentaListAPIView.as_view(), name='precio-list'),
    path('precio-venta/create/', PrecioVentaCreateView.as_view(), name='precio-create'),
    path('precio-venta/<int:_id_precio_venta>/', PrecioVentaRetrieveAPIView.as_view(), name='precio-detail'),
    path('precio-venta/producto/<int:producto_id>/', PrecioVentaPorProductoListAPIView.as_view(), name='precio-por-producto'),
    path('precio-venta/vigente/<int:producto_id>/', PrecioVigenteProductoView.as_view(), name='precio-vigente'),

    #Enpoint ProductoProducto
    path('producto/producto-producto/create/', ProductoProductoCreateAPIView.as_view(), name='producto-producto-create'),
    path('producto/producto-producto/list/', ProductoProductoListAPIView.as_view(), name='producto-producto-list'),
    path('producto/producto-producto/<int:id_producto_producto>/', ProductoProductoDetailAPIView.as_view(), name='producto-producto-detail'),

    #Enpoint ProductoTemplate
    path('producto/producto-template/create/', ProductoTemplateCreateAPIView.as_view(), name='producto-template-create'),
    path('producto/producto-template/schema/', ProductoTemplateSchemaAPIView.as_view(), name='producto-template-schema'),
    path('producto/producto-template/list/', ProductoTemplateListAPIView.as_view(), name='producto-template-list'),
    path('producto/producto-template/<int:id_producto_template>/', ProductoTemplateDetailAPIView.as_view(), name='producto-template-detail'),

    

    path('producto/producto-producto-lista/list/', ProductoProductoListaListAPIView.as_view(), name='all- producto-product-list'),
    path('producto/producto-producto-lista/<int:id_producto_template>/', ProductoTemplateRetrieveAPIView.as_view(), name='detail producto-product-lista id'),
    path('producto/producto-producto-lista/id_producto_producto/<int:id_producto_producto>/',ProductoProductoRetrieveAPIView.as_view(),name='producto-producto-detail'),



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


    # Endpoint de Auditoria de productos
    path('audit/product/list/', RecordAuditListAPIView.as_view(), name='audit product list'),
    path('audit/product/<int:pk>/', RecordAuditDetailAPIView.as_view(), name='audit product detail'),

]