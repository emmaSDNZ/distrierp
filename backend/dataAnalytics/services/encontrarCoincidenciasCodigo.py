from apps.products.utils.actualizar_precio import actualizar_precio_compra
from dataAnalytics.services.normalizarDf import limpiar_valores_para_comparacion

def obtener_df_coincidentes_y_no_coincidentes(
    df_proveedor,
    df_sistema,
    col_proveedor,
    col_sistema,
    col_precio="PRECIO CON IVA",
):
    print("📥 Iniciando proceso de coincidencias...")
    print(f"🔧 Comparando '{col_proveedor}' (proveedor) con '{col_sistema}' (sistema)")
    df_proveedor[col_proveedor] = df_proveedor[col_proveedor].apply(limpiar_valores_para_comparacion)
    df_sistema[col_sistema] = df_sistema[col_sistema].apply(limpiar_valores_para_comparacion)

    es_coincidente = df_proveedor[col_proveedor].isin(set(df_sistema[col_sistema]))

    df_coincidentes = df_proveedor[es_coincidente].copy()
    df_no_coincidentes = df_proveedor[~es_coincidente].copy()

    print(f"✅ Coincidencias encontradas: {len(df_coincidentes)}")
    print(f"❌ No coincidencias: {len(df_no_coincidentes)}")

    df_sistema_min = df_sistema[[col_sistema, "id_producto"]].drop_duplicates()
    df_coincidentes = df_coincidentes.merge(
        df_sistema_min,
        left_on=col_proveedor,
        right_on=col_sistema,
        how='left'
    )
    df_coincidentes.drop(columns=[col_sistema], inplace=True)

    print("🔄 Datos después del merge:")
    print(df_coincidentes[[col_proveedor, "id_producto", col_precio]].head())

    productos_actualizados = []
    productos_sin_cambios = []

    print("💸 Iniciando actualización de precios...")
    for index, row in df_coincidentes.iterrows():
        id_producto = row.get("id_producto")
        precio_con_iva = row.get(col_precio)

        print(f"🟡 Fila {index} → id_producto: {id_producto}, precio_con_iva: {precio_con_iva}")

        resultado = actualizar_precio_compra(id_producto, precio_con_iva)

        if resultado:
            productos_actualizados.append(resultado)
            print(f"🟢 Producto {id_producto} actualizado.")
        else:
            productos_sin_cambios.append(id_producto)
            print(f"🔁 Producto {id_producto} sin cambios.")

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
        "sin_cambios": productos_sin_cambios
    }
