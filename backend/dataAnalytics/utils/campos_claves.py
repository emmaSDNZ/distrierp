CAMPOS_CLAVE = {
    # Códigos de producto
    "codigo_producto": [
        "codigo_producto", "código_producto", "cod_producto", "codprod", "cod_producto_sap", 
        "codigo", "código", "cod", "sku", "item_code", "articulo", "producto_codigo", 
        "cod_art", "ref", "referencia", "id_producto" # Añadido id_producto como posible sinónimo
    ],
    
    # Código de barras
    "codigo_barras": [
        "codigo_barras", "código_barras", "codigo_de_barras", "código_de_barras", "ean", 
        "upc", "barcode", "codigo_barra", "codbarras", "ean13", "gtin"
    ],
    
    # Descripción o nombre del producto
    "descripcion": [
        "descripcion", "descripción", "producto", "nombre", "detalle", "nombre_producto", 
        "desc", "descrip", "descripcion_producto", "descripcion_corta", "articulo_desc", "medicamento"
    ],
    
    # Presentación o formato de producto
    "presentacion": [
        "presentacion", "presentación", "contenido", "formato", "envase", "pack", "tamaño",
        "cant_uni", "cantidad_unidad", "envases", "caja", "blister", "ampolla"
    ],
    
    # Precios de compra (alineados con el modelo PrecioCompraModel)
    # Estos son los nombres estandarizados internos a los que se mapearán las columnas del CSV.
    # Incluye una amplia gama de sinónimos para mayor robustez.
    "precio_compra_unitario": [
        "precio unitario", "precio_unitario", "precio compra", "precio_compra", "precio_base", 
        "costo_unitario", "precio_neto_unitario", "precio_uni", "costo_prod", "precio_adq",
        "precio_bruto", "valor_costo", "pdl", "precio de lista", "precio_lista_unitario", "pu"
    ],
    "precio_compra_con_iva": [
        "precio con iva", "precio_con_iva", "precio_iva", "precio_final", "precio_total_iva", 
        "pc_con_iva", "precio_c_iva", "costo_con_iva", "precio_factura", "precio_mayorista_iva",
        "precio_drogueria_iva", "drogueria_iva", "drogueria con iva", "pdl con iva", "iva incluido",
        "precio_venta_iva", "pvp_iva"
    ],
    "precio_compra_sin_iva": [
        "precio sin iva", "precio_sin_iva", "precio compra sin iva", "precio_compra_sin_iva", 
        "precio_neto", "pc_sin_iva", "precio_s_iva", "costo_sin_iva", "precio_mayorista_sin_iva",
        "precio_drogueria_sin_iva", "drogueria_sin_iva", "drogueria", "pdl sin iva", 
        "precio de lista sin iva", "precio_venta_sin_iva", "pvp_sin_iva"
    ],
    "precio_compra_sugerido": [
        "precio sugerido", "precio_sugerido", "precio_venta_sugerido", "pvp_sugerido", 
        "precio_minorista", "precio_publico", "pvp", "precio_sug", "precio_farmacia",
        "precio de venta al publico", "precio_venta_final"
    ],
    
    # Stock o inventario
    "stock": [
        "stock", "existencias", "inventario", "cantidad", "qty", "unidades_disponibles", 
        "disponible", "cantidad_stock", "unidades"
    ],
    
    # Categoría o familia del producto
    "categoria": [
        "categoria", "categoría", "familia", "grupo", "tipo_producto", "segmento", "linea", 
        "seccion", "rubro"
    ],
    
    # Unidad de medida del producto (para diferenciar de "presentacion")
    "unidad_medida_producto": [ 
        "unidad_medida", "unidad", "medida", "um", "unidad_med", "u_medida", "unidad_venta"
    ],
}
