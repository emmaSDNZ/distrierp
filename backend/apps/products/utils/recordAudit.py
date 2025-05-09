# utils/auditoria.py
def detectar_cambios(instancia_original, instancia_nueva):
    cambios = {}
    for campo in instancia_original._meta.fields:
        nombre = campo.name
        if nombre == 'id':
            continue
        valor_anterior = getattr(instancia_original, nombre)
        valor_nuevo = getattr(instancia_nueva, nombre)
        if valor_anterior != valor_nuevo:
            cambios[nombre] = {
                'antes': valor_anterior,
                'despues': valor_nuevo
            }
    return cambios