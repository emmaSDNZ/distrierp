# apps/products/utils/actualizar_precio.py

from apps.products.models.precio._precioCompraModel import PrecioCompraModel
from apps.products.models.producto.productoProductoModel import ProductoProductoModel
from decimal import Decimal, ROUND_HALF_UP # Importar ROUND_HALF_UP para redondeo consistente

def actualizar_precio_compra(
    id_producto_producto,
    precio_unitario=None,
    precio_con_iva=None,
    precio_sin_iva=None,
    precio_sugerido=None
):
    try:
        id_int = int(id_producto_producto)
    except (TypeError, ValueError):
        print(f"⚠️ Error: ID de producto inválido: {id_producto_producto}")
        return None

    try:
        # Usamos select_related para evitar consultas adicionales al acceder a id_producto_template
        producto = ProductoProductoModel.objects.select_related('id_producto_template').get(pk=id_int)
    except ProductoProductoModel.DoesNotExist:
        print(f"⚠️ Error: Producto con ID {id_int} no encontrado.")
        return None

    def parse_precio(value):
        """
        Convierte un valor a Decimal, redondea a 2 decimales y maneja valores no numéricos/negativos.
        Retorna Decimal o None si no es válido.
        """
        if value is None or value == '':
            return None # Los valores nulos o vacíos se tratan como no proporcionados

        try:
            value_str = str(value).replace(',', '.') # Reemplazar comas por puntos
            # Convertir a Decimal y redondear a 2 decimales
            parsed_value = Decimal(value_str).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
            return parsed_value if parsed_value >= 0 else None # Permitir 0.00 como precio válido, pero no negativos
        except Exception as e:
            print(f"⚠️ Error al parsear precio '{value}': {e}")
            return None

    precios_a_procesar = {}
    # Solo añadir al diccionario si el valor no es None y se puede parsear correctamente
    if precio_unitario is not None:
        valor = parse_precio(precio_unitario)
        if valor is not None:
            precios_a_procesar["_precio_compra_unitario"] = valor

    if precio_con_iva is not None:
        valor = parse_precio(precio_con_iva)
        if valor is not None:
            precios_a_procesar["_precio_compra_con_iva"] = valor

    if precio_sin_iva is not None:
        valor = parse_precio(precio_sin_iva)
        if valor is not None:
            precios_a_procesar["_precio_compra_sin_iva"] = valor

    if precio_sugerido is not None:
        valor = parse_precio(precio_sugerido)
        if valor is not None:
            precios_a_procesar["_precio_compra_sugerido"] = valor

    if not precios_a_procesar:
        print(f"ℹ️ No se proporcionaron precios válidos para actualizar para el producto {id_int}.")
        return None

    # Obtener el último precio registrado para este producto
    ultimo = PrecioCompraModel.objects.filter(
        id_producto_producto=producto
    ).order_by("-_create_date").first()

    # Diccionario para almacenar solo los precios que realmente cambiaron
    precios_que_cambiaron = {}

    # Verificar si los precios proporcionados son idénticos a los últimos registrados
    if ultimo:
        cambios_detectados = False
        for key_modelo, valor_nuevo_decimal in precios_a_procesar.items():
            valor_actual_db_decimal = getattr(ultimo, key_modelo, None)

            # Convertir el valor de la DB a Decimal y redondear para la comparación
            if valor_actual_db_decimal is not None:
                valor_actual_db_decimal = Decimal(str(valor_actual_db_decimal)).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
            
            # Comparación robusta:
            # 1. Si ambos son None, no hay cambio para este campo.
            if valor_nuevo_decimal is None and valor_actual_db_decimal is None:
                continue
            # 2. Si uno es None y el otro no, hay un cambio.
            if (valor_nuevo_decimal is None and valor_actual_db_decimal is not None) or \
               (valor_nuevo_decimal is not None and valor_actual_db_decimal is None):
                cambios_detectados = True
                precios_que_cambiaron[key_modelo] = valor_nuevo_decimal # Añadir al diccionario de cambios
                continue # Continuar para registrar otros posibles cambios en el mismo producto
            # 3. Si ambos son Decimales válidos, compararlos directamente.
            if valor_nuevo_decimal != valor_actual_db_decimal:
                cambios_detectados = True
                precios_que_cambiaron[key_modelo] = valor_nuevo_decimal # Añadir al diccionario de cambios
                continue # Continuar para registrar otros posibles cambios en el mismo producto
        
        if not cambios_detectados: # Si no se detectaron cambios en ningún campo
            print(f"🔁 Producto {id_int}: Los precios proporcionados son idénticos a los últimos registrados. No se requiere actualización.")
            return None  # No hay cambios, no se crea un nuevo registro
    else:
        # Si no hay registro anterior, todos los precios proporcionados son un "cambio" inicial
        precios_que_cambiaron = precios_a_procesar.copy()


    try:
        # Crear un nuevo registro de precio con los valores actualizados
        # Solo se pasan los precios que realmente se procesaron, no necesariamente los que cambiaron
        # (ya que `precios_a_procesar` contiene todos los recibidos del CSV que son válidos)
        nuevo = PrecioCompraModel.objects.create(
            id_producto_producto=producto,
            **precios_a_procesar # Usar los precios ya parseados y validados
        )
        # Aquí accedemos al nombre base del producto a través de la relación
        nombre_producto = producto.id_producto_template.nombre_base_producto if producto.id_producto_template else ""

        print(f"🟢 Producto {producto.pk} actualizado con nuevos precios: {precios_a_procesar}")
        return {
            "id_producto": producto.pk,
            "nombre_producto": nombre_producto,
            "precios_nuevos": precios_que_cambiaron # ¡Ahora solo incluye los precios que realmente cambiaron!
        }
    except Exception as e:
        print(f"❌ Error al crear nuevo registro de precio para producto {id_int}: {e}")
        return None