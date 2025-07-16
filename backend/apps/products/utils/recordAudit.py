from decimal import Decimal
import datetime

def normalizar_valor(valor):
    if isinstance(valor, Decimal):
        return float(valor)
    if isinstance(valor, datetime.datetime):
        return valor.replace(tzinfo=None)  # ignorar zona horaria
    return valor

def detectar_cambios(instancia_original, instancia_nueva):
    cambios = {}
    for campo in instancia_original._meta.fields:
        nombre = campo.name
        if nombre == 'id':
            continue
        valor_anterior = normalizar_valor(getattr(instancia_original, nombre))
        valor_nuevo = normalizar_valor(getattr(instancia_nueva, nombre))
        if valor_anterior != valor_nuevo:
            cambios[nombre] = {
                'antes': valor_anterior,
                'despues': valor_nuevo
            }
    return cambios