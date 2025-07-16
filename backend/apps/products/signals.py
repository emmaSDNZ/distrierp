import datetime
from decimal import Decimal
from django.db.models.signals import pre_save, post_save, post_delete
from django.dispatch import receiver

from apps.products.models.recordAuditModel import RecordAuditModel
from apps.products.models.producto.productoTemplateModel import ProductoTemplateModel
from apps.products.models.producto.productoProductoModel import ProductoProductoModel
from apps.products.models.precio._precioBaseModel import PrecioBaseModel
from apps.products.models.precio._precioCompraModel import PrecioCompraModel
from apps.products.models.precio._precioVentaModel import PrecioVentaModel

# Modelos a auditar normalmente
MODELOS_A_AUDITAR = [ProductoTemplateModel, ProductoProductoModel]
# Modelo PrecioBase solo auditoría creación con último precio como "antes"
MODELOS_PRECIO = [PrecioBaseModel]

_originales = {}

def convert_decimals(obj):
    if isinstance(obj, dict):
        return {k: convert_decimals(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [convert_decimals(i) for i in obj]
    elif isinstance(obj, Decimal):
        return float(obj)
    return obj

def safe_json(obj):
    if isinstance(obj, datetime.datetime):
        return obj.isoformat()
    elif isinstance(obj, dict):
        return {k: safe_json(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [safe_json(i) for i in obj]
    return obj

def modelo_a_auditar(sender, modelos):
    return sender in modelos

def recordAuditCreate(model_class, modelo_nombre, instance, accion, cambios=None):
    registro_nombre = getattr(instance, 'name', None)
    if not registro_nombre:
        registro_nombre = getattr(instance, 'nombre_base_producto', None) or str(instance.pk)

    if accion == 'delete':
        cambios = None

    return model_class.objects.create(
        modelo=modelo_nombre,
        registro_id=instance.pk,
        registro_nombre=registro_nombre,
        accion=accion,
        cambios=cambios
    )

@receiver(pre_save)
def guardar_original(sender, instance, **kwargs):
    if modelo_a_auditar(sender, MODELOS_A_AUDITAR + MODELOS_PRECIO):
        if instance.pk:
            try:
                _originales[(sender, instance.pk)] = sender.objects.get(pk=instance.pk)
            except sender.DoesNotExist:
                _originales[(sender, instance.pk)] = None

def detectar_cambios(instancia_vieja, instancia_nueva):
    cambios = {}
    if instancia_vieja is None:
        return None

    for campo in instancia_vieja._meta.fields:
        nombre_campo = campo.name
        if nombre_campo == 'id':
            continue

        valor_viejo = getattr(instancia_vieja, nombre_campo)
        valor_nuevo = getattr(instancia_nueva, nombre_campo)

        if isinstance(valor_viejo, datetime.datetime):
            valor_viejo = valor_viejo.isoformat()
        if isinstance(valor_nuevo, datetime.datetime):
            valor_nuevo = valor_nuevo.isoformat()

        if isinstance(valor_viejo, Decimal):
            valor_viejo = float(valor_viejo)
        if isinstance(valor_nuevo, Decimal):
            valor_nuevo = float(valor_nuevo)

        if valor_viejo != valor_nuevo:
            cambios[nombre_campo] = {
                "antes": valor_viejo,
                "despues": valor_nuevo
            }

    return cambios if cambios else None

@receiver(post_save)
def registrar_creacion_o_actualizacion(sender, instance, created, **kwargs):
    if sender in MODELOS_A_AUDITAR:
        modelo_nombre = sender.__name__
        registro_nombre = getattr(instance, 'name', None) or getattr(instance, 'nombre_base_producto', None) or str(instance.pk)

        id_producto_producto = None
        id_producto_template = None
        nombre_base_producto = None

        if hasattr(instance, 'id_producto_producto') and instance.id_producto_producto:
            if hasattr(instance.id_producto_producto, 'pk'):
                id_producto_producto = instance.id_producto_producto.pk
                producto_template = getattr(instance.id_producto_producto, 'id_producto_template', None)
                if producto_template:
                    id_producto_template = producto_template.pk
                    nombre_base_producto = getattr(producto_template, 'nombre_base_producto', None)
            else:
                id_producto_producto = instance.id_producto_producto
        elif hasattr(instance, 'id_producto_template'):
            if hasattr(instance.id_producto_template, 'pk'):
                id_producto_template = instance.id_producto_template.pk
            else:
                id_producto_template = instance.id_producto_template
            nombre_base_producto = getattr(instance, 'nombre_base_producto', None)

        if created:
            recordAuditCreate(RecordAuditModel, modelo_nombre, instance, 'create')
        else:
            original = _originales.pop((sender, instance.pk), None)
            cambios = detectar_cambios(original, instance) if original else None

            if cambios is not None:
                cambios['id_producto_producto'] = id_producto_producto
                cambios['id_producto_template'] = id_producto_template
                cambios['nombre_base_producto'] = nombre_base_producto

                cambios = convert_decimals(cambios)
                cambios = safe_json(cambios)
                recordAuditCreate(RecordAuditModel, modelo_nombre, instance, 'update', cambios=cambios)

    elif sender == PrecioCompraModel and created:
        modelo_nombre = sender.__name__
        producto = getattr(instance, 'id_producto_producto', None)
        producto_template = getattr(producto, 'id_producto_template', None) if producto else None

        ultimo_registro = (
            sender.objects
            .filter(id_producto_producto=producto)
            .exclude(pk=instance.pk)
            .order_by('-_create_date')
            .first()
        )

        cambios = {
            "precio_compra_unitario": {
                "antes": float(ultimo_registro._precio_compra_unitario) if ultimo_registro else 0.0,
                "despues": float(instance._precio_compra_unitario)
            },
            "precio_compra_con_iva": {
                "antes": float(ultimo_registro._precio_compra_con_iva) if ultimo_registro else 0.0,
                "despues": float(instance._precio_compra_con_iva)
            },
            "precio_compra_sin_iva": {
                "antes": float(ultimo_registro._precio_compra_sin_iva) if ultimo_registro else 0.0,
                "despues": float(instance._precio_compra_sin_iva)
            },
            "precio_compra_sugerido": {
                "antes": float(ultimo_registro._precio_compra_sugerido) if ultimo_registro else 0.0,
                "despues": float(instance._precio_compra_sugerido)
            },
            "audit_producto_template": {
                "antes": str(producto_template) if producto_template else None,
                "despues": str(producto_template) if producto_template else None
            },
            "audit_producto": {
                "antes": str(producto) if producto else None,
                "despues": str(producto) if producto else None
            },
            "fecha": {
                "antes": None,
                "despues": None
            },
            "tipo": {
                "antes": "compra",
                "despues": "compra"
            },
            "id_producto_producto": producto.pk if producto else None,
            "id_producto_template": producto_template.pk if producto_template else None,
            "nombre_base_producto": getattr(producto_template, 'nombre_base_producto', None) if producto_template else None
        }

        cambios = convert_decimals(cambios)
        cambios = safe_json(cambios)
        recordAuditCreate(RecordAuditModel, modelo_nombre, instance, 'create', cambios=cambios)

    elif sender in [PrecioBaseModel, PrecioVentaModel] and created:
        modelo_nombre = sender.__name__
        producto = getattr(instance, 'id_producto_producto', None)
        producto_template = getattr(producto, 'id_producto_template', None) if producto else None

        ultimo_registro = (
            sender.objects
            .filter(id_producto_producto=producto)
            .exclude(pk=instance.pk)
            .order_by('-_create_date')
            .first()
        )

        if sender == PrecioBaseModel:
            field_name = "precio_base"
            field_attr = "_precio_base"
        elif sender == PrecioVentaModel:
            field_name = "precio_venta"
            field_attr = "_precio_unitario"

        precio_antes = float(getattr(ultimo_registro, field_attr)) if ultimo_registro else 0.0
        precio_despues = float(getattr(instance, field_attr))

        cambios = {
            field_name: {
                "antes": precio_antes,
                "despues": precio_despues
            },
            "audit_producto_template": {
                "antes": str(producto_template) if producto_template else None,
                "despues": str(producto_template) if producto_template else None
            },
            "audit_producto": {
                "antes": str(producto) if producto else None,
                "despues": str(producto) if producto else None
            },
            "fecha": {
                "antes": None,
                "despues": None
            },
            "tipo": {
                "antes": sender.__name__.replace("Precio", "").lower(),
                "despues": sender.__name__.replace("Precio", "").lower()
            },
            "id_producto_producto": producto.pk if producto else None,
            "id_producto_template": producto_template.pk if producto_template else None,
            "nombre_base_producto": getattr(producto_template, 'nombre_base_producto', None) if producto_template else None
        }

        cambios = convert_decimals(cambios)
        cambios = safe_json(cambios)
        recordAuditCreate(RecordAuditModel, modelo_nombre, instance, 'create', cambios=cambios)

@receiver(post_delete)
def registrar_eliminacion(sender, instance, **kwargs):
    if modelo_a_auditar(sender, MODELOS_A_AUDITAR):
        modelo_nombre = sender.__name__
        recordAuditCreate(RecordAuditModel, modelo_nombre, instance, 'delete')
