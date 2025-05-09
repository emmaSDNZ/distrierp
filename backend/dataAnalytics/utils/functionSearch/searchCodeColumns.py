import pandas as pd

def searchCodeColumns(df_master, df_supplier, column_cod__master, column_cod_supplier):
    """
    Función que procesa el código de producto/barra del proveedor y lo combina con el DataFrame Master según el código de producto/barra.
    
    Parámetros:
    - df_master (DataFrame): DataFrame Master de la DB con los datos de productos.
    - df_supplier (DataFrame): DataFrame con los datos del proveedor.
    - column_cod_de_prod_master (str): Nombre de la columna que contiene el código de producto o código de barra del Master.
    - column_cod_de_prod_supplier (str): Nombre de la columna que contiene el código de producto o código de barra del proveedor.
    
    Retorna:
    - df_supplier (DataFrame): DataFrame del proveedor con la columna 'niprod' agregada después del merge.
    - df_match_niprod (DataFrame): DataFrame con solo las filas que tienen coincidencias en 'niprod'.
    - df_not_match_niprod (DataFrame): DataFrame con solo las filas sin coincidencias en 'niprod'.
    """

    df_supplier = df_supplier.copy()
    df_master[column_cod__master] = df_master[column_cod__master].fillna('').astype(str)
    df_supplier[column_cod_supplier] = df_supplier[column_cod_supplier].fillna('').astype(str)


    if df_supplier[column_cod_supplier].isin(df_master[column_cod__master]).any():
        if 'niprod' not in df_supplier.columns:
            df_supplier = df_supplier.merge(
                df_master[[column_cod__master, 'niprod']],
                left_on=column_cod_supplier,
                right_on=column_cod__master,
                how='left'
            )
        else:
            print("No hay coincidencias entre los códigos de producto del proveedor y del master.")
            return df_supplier, pd.DataFrame(), pd.DataFrame()
    else:
        return df_supplier, pd.DataFrame(), pd.DataFrame()

    df_match_niprod = df_supplier[df_supplier['niprod'].notna()]
    df_not_match_niprod = df_supplier[df_supplier['niprod'].isna()]

    return df_supplier, df_match_niprod, df_not_match_niprod