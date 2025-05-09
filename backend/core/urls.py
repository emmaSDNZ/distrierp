from django.contrib import admin
from django.urls import path, include

product = 'api_distrimed_productos/'

urlpatterns = [
    path('admin/', admin.site.urls),
    path(product, include('apps.products.api.urls')),
]
