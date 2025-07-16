import django_filters
from apps.products.models.recordAuditModel import RecordAuditModel

class RecordAuditFilter(django_filters.FilterSet):
    # Puedes agregar filtros para los campos que desees
    modelo = django_filters.CharFilter(field_name='modelo', lookup_expr='icontains', label='Modelo')
    registro_id = django_filters.NumberFilter(field_name='registro_id', lookup_expr='exact', label='ID Registro')
    accion = django_filters.CharFilter(field_name='accion', lookup_expr='icontains', label='Acción')
    fecha_hora__gte = django_filters.DateTimeFilter(field_name='fecha_hora', lookup_expr='gte', label='Desde (Fecha)')
    fecha_hora__lte = django_filters.DateTimeFilter(field_name='fecha_hora', lookup_expr='lte', label='Hasta (Fecha)')
    
    class Meta:
        model = RecordAuditModel
        fields = ['modelo', 'registro_id', 'accion', 'fecha_hora']