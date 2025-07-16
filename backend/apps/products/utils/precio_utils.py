def obtener_precio_vigente(queryset):
    ultimo = queryset.order_by('-_create_date').first()
    if ultimo:
        return {
            "id": getattr(ultimo, 'id', None),
            "precio_unitario": ultimo._precio_unitario,
            "create_date": ultimo._create_date
        }
    return None