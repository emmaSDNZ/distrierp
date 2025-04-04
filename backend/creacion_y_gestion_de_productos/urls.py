from rest_framework import routers

from creacion_y_gestion_de_productos.api.category_api import CategoryViewSet
from creacion_y_gestion_de_productos.api.price_api import ProductoPrecioVentaViewSet, ProductoPrecioCosteViewSet, ProductoPrecioViewSet
from creacion_y_gestion_de_productos.api.type_api import ProductoTipoViewSet
from creacion_y_gestion_de_productos.api.product_api import ProductoViewSet
from creacion_y_gestion_de_productos.api.product_product_api import ProductoAttributeViewSet
from creacion_y_gestion_de_productos.api.attribute_api import(AttributeValueViewSet, AttributeNameViewSet, AttributeNameValueViewSet)
router = routers.DefaultRouter()


router.register('/productos', ProductoViewSet, 'Productos')
router.register('/tipo-producto', ProductoTipoViewSet, 'Tipo de Producto')
router.register('/precio', ProductoPrecioViewSet, 'Precio Producto')
router.register('/precio-coste', ProductoPrecioCosteViewSet, 'Precio Coste Producto')
router.register('/precio-venta', ProductoPrecioVentaViewSet, 'Precio Venta Producto')
router.register('/category', CategoryViewSet, 'Category')


router.register('/attribute-names', AttributeNameViewSet)
router.register('/attribute-values', AttributeValueViewSet)
router.register('/attribute-name-values', AttributeNameValueViewSet)

router.register('/product-attribute', ProductoAttributeViewSet)
urlpatterns = router.urls