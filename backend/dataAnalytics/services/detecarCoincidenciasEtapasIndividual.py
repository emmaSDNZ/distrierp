# dataAnalytics/services/detecarCoincidenciasEtapasIndividual.py

import pandas as pd
from apps.products.utils.actualizar_precio import actualizar_precio_compra
from dataAnalytics.services.normalizarDf import limpiar_valores_para_comparacion

def detectar_coincidencias_por_etapas_individual(
    df_proveedor,
    df_sistema,
    col_proveedor,
    col_sistema,
):
    print("📥 Iniciando proceso de coincidencias...")
    print(f"🔧 Comparando '{col_proveedor}' (proveedor) con '{col_sistema}' (sistema)")

    # Limpiar y normalizar los valores de las columnas de comparación
    df_proveedor[col_proveedor] = df_proveedor[col_proveedor].apply(limpiar_valores_para_comparacion)
    df_sistema[col_sistema] = df_sistema[col_sistema].apply(limpiar_valores_para_comparacion)

    # Identificar las filas coincidentes y no coincidentes
    es_coincidente = df_proveedor[col_proveedor].isin(set(df_sistema[col_sistema]))

    df_coincidentes = df_proveedor[es_coincidente].copy()
    df_no_coincidentes = df_proveedor[~es_coincidente].copy()

    print(f"✅ Coincidencias encontradas: {len(df_coincidentes)}")
    print(df_coincidentes)
    print(f"❌ No coincidencias: {len(df_no_coincidentes)}")
    print(df_no_coincidentes)

    # Definimos todas las columnas de precios que podríamos esperar del CSV.
    # Es crucial que esta lista contenga todos los nombres de columnas de precio que esperas del CSV.
    columnas_posibles_precios_csv = [
        "precio unitario",       # Columna del CSV
        "precio compra",         # Columna del CSV (si tu proveedor todavía usa este nombre)
        "precio con iva",        # Columna del CSV
        "precio sin iva",        # Columna del CSV (si tiene este nombre exacto)
        "precio compra sin iva", # ¡Nueva columna detectada en tu log!
        "precio sugerido"        # Columna del CSV
    ]

    # Mapeo de nombres de columna del CSV a los nombres de los parámetros
    # esperados por la función `actualizar_precio_compra`.
    nombre_parametros_map = {
        "precio unitario": "precio_unitario",
        "precio compra": "precio_unitario",         # Si "precio compra" (sin el "sin iva") aún se usa, mapea a unitario
        "precio con iva": "precio_con_iva",
        "precio sin iva": "precio_sin_iva",        # Mapeo para columna "precio sin iva" exacta
        "precio compra sin iva": "precio_sin_iva", # Mapeo para la nueva columna "precio compra sin iva"
        "precio sugerido": "precio_sugerido",
    }

    # **LÓGICA DE PRIORIDAD:**
    # Definimos el orden de preferencia para las columnas del CSV cuando múltiples columnas
    # del CSV podrían mapear al mismo campo del modelo.
    # El primer elemento de la tupla es el nombre de la columna en el CSV,
    # el segundo es el nombre del parámetro en `actualizar_precio_compra`.
    prioridad_columnas_csv_para_mapeo = [
        ("precio unitario", "precio_unitario"),      # Prioridad 1 para precio unitario (si existe en CSV)
        ("precio compra", "precio_unitario"),        # Prioridad 2 para precio unitario (si "precio unitario" no está y "precio compra" sí)
        ("precio con iva", "precio_con_iva"),
        ("precio sin iva", "precio_sin_iva"),        # Prioridad 1 para precio sin iva (si el CSV tiene el nombre exacto)
        ("precio compra sin iva", "precio_sin_iva"), # Prioridad 2 para precio sin iva (si "precio sin iva" no está y "precio compra sin iva" sí)
        ("precio sugerido", "precio_sugerido"),
    ]

    # Bloque para incluir columnas relevantes del sistema (modelo) para el merge.
    # Esto asegura que df_sistema_min tenga las columnas necesarias para el merge,
    # incluyendo las columnas de precio del sistema para futuras referencias.
    columnas_a_incluir_sistema = ["id_producto", col_sistema]
    # También incluimos los nombres de los campos de precio del modelo en df_sistema_min
    columnas_a_incluir_sistema.extend([
        "precio_compra_unitario",
        "precio_compra_con_iva",
        "precio_compra_sin_iva",
        "precio_sugerido",
    ])
    columnas_a_incluir_sistema = list(set(columnas_a_incluir_sistema)) # Eliminar duplicados
    
    # Filtrar df_sistema para solo las columnas que realmente existen en él
    columnas_existentes_en_sistema = [col for col in columnas_a_incluir_sistema if col in df_sistema.columns]
    df_sistema_min = df_sistema[columnas_existentes_en_sistema].drop_duplicates()


    # Realizar el merge para añadir el `id_producto` del sistema a las filas coincidentes del proveedor.
    # df_coincidentes ya contiene todas las columnas originales del proveedor.
    df_coincidentes = df_coincidentes.merge(
        df_sistema_min,
        left_on=col_proveedor,
        right_on=col_sistema,
        how='left'
    )
    df_coincidentes.drop(columns=[col_sistema], inplace=True)

    print("🔄 Datos después del merge (ejemplo de columnas):")
    # Imprime las columnas relevantes para depurar, incluyendo las columnas de precio del proveedor.
    # Esto muestra las columnas del CSV que están siendo consideradas.
    print_cols = [col_proveedor, "id_producto"] + [c for c in columnas_posibles_precios_csv if c in df_coincidentes.columns]
    print(df_coincidentes[print_cols].head())


    productos_actualizados = []
    productos_sin_cambios = []

    print("💸 Iniciando actualización de precios...")
    
    for index, row in df_coincidentes.iterrows():
        id_producto = row.get("id_producto")
        precios_para_actualizar = {}

        # Iterar sobre la lista de prioridad para poblar `precios_para_actualizar`.
        # Esto asegura que las columnas con mayor prioridad (más arriba en la lista)
        # se usen primero para el campo del modelo correspondiente.
        for col_csv_name, param_name in prioridad_columnas_csv_para_mapeo:
            # Verificar si la columna del CSV existe en la fila actual y no está nula
            if col_csv_name in row and pd.notnull(row[col_csv_name]):
                # Si este parámetro (ej. "precio_unitario") ya fue asignado por una columna de mayor prioridad,
                # lo saltamos para mantener la prioridad (no sobrescribir).
                if param_name not in precios_para_actualizar:
                    precios_para_actualizar[param_name] = row[col_csv_name]
        
        print(f"🟡 Fila {index} → id_producto: {id_producto}, precios a actualizar: {precios_para_actualizar}")

        # Solo intentar actualizar si hay precios válidos para actualizar
        if precios_para_actualizar:
            resultado = actualizar_precio_compra(id_producto, **precios_para_actualizar)

            if resultado:
                productos_actualizados.append(resultado)
                print(f"🟢 Producto {id_producto} actualizado.")
            else:
                productos_sin_cambios.append(id_producto)
                print(f"🔁 Producto {id_producto} sin cambios (valores idénticos o id_producto inválido).")
        else:
            productos_sin_cambios.append(id_producto)
            print(f"⚪ Producto {id_producto} sin precios válidos en el CSV para actualizar.")


    print("✅ Actualización de precios finalizada.")
    print(f"📊 Total actualizados: {len(productos_actualizados)}")
    print(f"📊 Sin cambios: {len(productos_sin_cambios)}")
    print("🎯 Proceso completo.\n")
    print("VALORES ÚNICOS PROVEEDOR:")
    print(df_proveedor[col_proveedor].dropna().unique()[:5])
    print("VALORES ÚNICOS SISTEMA:")
    print(df_sistema[col_sistema].dropna().unique()[:5])

    return {
        "coincidentes": df_coincidentes,
        "no_coincidentes": df_no_coincidentes,
        "actualizados": productos_actualizados,
        "sin_cambios": productos_sin_cambios,
    }