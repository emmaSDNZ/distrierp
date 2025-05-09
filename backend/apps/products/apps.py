from django.apps import AppConfig


class ProductsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.products'

    def ready(self):
        print("✅ Señales de productos cargadas correctamente")  # este print es para verificar
        import apps.products.signals