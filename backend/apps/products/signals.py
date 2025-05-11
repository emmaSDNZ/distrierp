from django.db.models.signals import pre_save, post_save, post_delete
from django.dispatch import receiver
from apps.products.models.productModel import Product
from apps.products.models.recordAuditModel import RecordAuditModel
from apps.products.utils.recordAudit import detectar_cambios

import datetime
from decimal import Decimal

def convert_decimals(obj):
    if isinstance(obj, dict):
        return {k: convert_decimals(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [convert_decimals(item) for item in obj]
    elif isinstance(obj, Decimal):
        return float(obj)  # Convierte Decimal a float
    return obj

def safe_json(obj):
    if isinstance(obj, datetime.datetime):
        return obj.isoformat()
    if isinstance(obj, dict):
        return {k: safe_json(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [safe_json(i) for i in obj]
    return obj

_originales = {}

@receiver(pre_save, sender=Product)
def guardar_original(sender, instance, **kwargs):
    if instance.pk:
        try:
            _originales[instance.pk] = sender.objects.get(pk=instance.pk)
        except sender.DoesNotExist:
            pass

@receiver(post_save, sender=Product)
def registrar_creacion_o_actualizacion(sender, instance, created, **kwargs):
    if created:
        print(f"Creación de producto detectado: {instance.name}. {instance.name}") 
        RecordAuditModel.objects.create(
            modelo=sender.__name__,
            registro_id=instance.pk,
            registro_nombre = instance.name, 
            accion='create',
            cambios=None
        )
    else:
        print(f"Actualización de producto detectado: {instance.pk}, {instance.name}")
        original = _originales.get(instance.pk)
        if original:
            cambios = detectar_cambios(original, instance)
            if cambios:
                cambios["name"] = instance.name
                
                # Aplica la conversión de Decimal a float en los cambios antes de serializarlos
                cambios = convert_decimals(cambios)

                RecordAuditModel.objects.create(
                    modelo=sender.__name__,
                    registro_id=instance.pk,
                    registro_nombre = instance.name,
                    accion='update',
                    cambios=safe_json(cambios)  # Serializa a JSON
                )

@receiver(post_delete, sender=Product)
def registrar_eliminacion(sender, instance, **kwargs):
    print(f"Eliminacion de producto detectado: {instance.pk}. {instance.name}") 
    RecordAuditModel.objects.create(
        modelo=sender.__name__,
        registro_id=instance.pk,
        registro_nombre = instance.name,
        accion='delete',
        cambios=None
    )
