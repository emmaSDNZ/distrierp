
CAMPOS_CLAVE = {
    # Códigos de producto: distintos nombres que puede tener en distintos ERP o archivos
    "codigo_producto": [
        "codigo_producto", "código_producto", "cod_producto", "codprod", "cod_producto_sap", "codigo", "código", "cod", "sku", "item_code", "articulo", "producto_codigo"
    ],
    
    # Código de barras, que suele estar separado del código interno
    "codigo_barras": [
        "codigo_barras", "código_barras", "codigo_de_barras", "código_de_barras", "ean", "upc", "barcode", "codigo_barra", "codbarras"
    ],
    
    # Descripción o nombre del producto
    "descripcion": [
        "descripcion", "descripción", "producto", "nombre", "detalle", "nombre_producto", "desc", "descrip", "descripcion_producto", "descripcion_corta"
    ],
    
    # Presentación o formato de producto
    "presentacion": [
        "presentacion", "presentación", "contenido", "formato", "envase", "unidad_medida", "unidad", "medida", "pack", "tamaño"
    ],
    
    # Precio de lista o venta
    "precio": [
        "precio", "precio_sin_iva", "precio_lista", "pc_lista", "pc_desc", "valor", "precio_venta", "precio_unitario", "pvp", "precio_publico"
    ],
    
    # Precio de compra o costo
    "precio_compra": [
        "precio_compra", "precio_costo_compra", "psc", "pc_lista_compra", "pc_desc_compra", "valor_compra", "costo", "precio_coste", "precio_interno"
    ],
    
    # Stock o inventario (agregado para posible ampliación)
    "stock": [
        "stock", "existencias", "inventario", "cantidad", "qty", "unidades_disponibles", "disponible"
    ],
    
    # Categoría o familia del producto
    "categoria": [
        "categoria", "categoría", "familia", "grupo", "tipo_producto", "segmento", "linea"
    ],
    
    # Unidad de medida
    "unidad_medida": [
        "unidad_medida", "unidad", "medida", "um", "unidad_med", "u_medida"
    ],
}