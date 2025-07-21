// InternalContainer.js

import React, { useEffect, useContext, useState, useCallback, useMemo } from "react";
import InternalForm from "./InternalForm";
import showToast from "../../../../shared/utils/ToastShow";
import UtilsFunctions from "@/shared/utils/utilsFunctions";
import { ApiCsvContext } from "@/shared/context/CsvContext";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { formatDate, formatBytes } from "@/shared/services/servicesInternal/servicesInternalGeneral";
import { MuiModal } from "@/shared/ui/Internal/MuiModal";
import { InternalEditor } from "./InternalEditor"; // Asegúrate de que este import es correcto

import {
  Typography,
  Button,
  Box,
  Divider,
} from "@mui/material";

// DICCIONARIO INCLUIDO DIRECTAMENTE EN EL FRONTEND
// ... (tu diccionario CAMPOS_CLAVE es correcto para la detección de sinónimos)
const CAMPOS_CLAVE = {
    // Códigos de producto
    "codigo_producto": [
        "codigo_producto", "código_producto", "cod_producto", "codprod", "cod_producto_sap",
        "codigo", "código", "cod", "sku", "item_code", "articulo", "producto_codigo",
        "cod_art", "ref", "referencia", "id_producto"
    ],

    // Código de barras
    "codigo_barras": [
        "codigo_barras", "código_barras", "codigo_de_barras", "código_de_barras", "ean",
        "upc", "barcode", "codigo_barra", "codbarras", "ean13", "gtin"
    ],

    // Descripción o nombre del producto
    "descripcion": [
        "descripcion", "descripción", "producto", "nombre", "detalle", "nombre_producto",
        "desc", "descrip", "descripcion_producto", "descripcion_corta", "articulo_desc", "medicamento"
    ],

    // Presentación o formato de producto
    "presentacion": [
        "presentacion", "presentación", "contenido", "formato", "envase", "pack", "tamaño",
        "cant_uni", "cantidad_unidad", "envases", "caja", "blister", "ampolla"
    ],

    // Precios de compra (alineados con el modelo PrecioCompraModel)
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

    // Stock o inventario
    "stock": [
        "stock", "existencias", "inventario", "cantidad", "qty", "unidades_disponibles",
        "disponible", "cantidad_stock", "unidades"
    ],

    // Categoría o familia del producto
    "categoria": [
        "categoria", "categoría", "familia", "grupo", "tipo_producto", "segmento", "linea",
        "seccion", "rubro"
    ],

    // Unidad de medida del producto (para diferenciar de "presentacion")
    "unidad_medida_producto": [
        "unidad_medida", "unidad", "medida", "um", "unidad_med", "u_medida", "unidad_venta"
    ],
};


export default function InternalContainer({ file }) {
  const [columnVersion, setColumnVersion] = useState(0);
  const { apiCsvAnalizar } = useContext(ApiCsvContext);
  const [openPreviewModal, setOpenPreviewModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [columnas, setColumnas] = useState([]); // Estas son las columnas tal cual vienen del backend
  const [datos, setDatos] = useState([]);
  const [datosEdit, setDatosEdit] = useState([]);
  const [columnasMonetariasDetectadas, setColumnasMonetariasDetectadas] = useState([]);

  // Lógica para identificar columnas monetarias desde el diccionario local
  const sinonimosPrecios = useMemo(() => {
    const s = new Set();
    Object.keys(CAMPOS_CLAVE).forEach(key => {
      if (key.startsWith("precio_compra_")) {
        CAMPOS_CLAVE[key].forEach(sinonimo => s.add(sinonimo.trim().toLowerCase()));
      }
    });
    return s;
  }, []);

  useEffect(() => {
    if (!file) return;
    const toastId = showToast.showLoadingToast();
    const analizar = async () => {
      try {
        const res = await apiCsvAnalizar(file);
        console.log("JSON ANALIZAR", res); // Log para depuración
        showToast.hideLoadingToast(toastId);
        const { success, message, data } = res;
        UtilsFunctions.showToastMessageSuccessError(success, message);
        if (data.df) {
          // *** CAMBIO CRÍTICO AQUÍ ***
          // Mantiene los nombres de columna tal cual vienen del backend para 'columnas'
          const rawColumns = Array.from(new Set(data.df.columnas || [])).filter(Boolean);
          setColumnas(rawColumns);
          console.log("Columnas originales (para renderizar):", rawColumns); // Log para depuración

          // Para la detección de columnas monetarias, SÍ normalizamos a minúsculas para comparar con el diccionario
          const normalizedColumnsForDetection = rawColumns.map(col => String(col).trim().toLowerCase());
          const detectedMonetaryColumns = normalizedColumnsForDetection.filter(colName =>
            sinonimosPrecios.has(colName)
          );
          setColumnasMonetariasDetectadas(detectedMonetaryColumns);
          console.log("Columnas monetarias detectadas (normalizadas):", detectedMonetaryColumns); // Log para depuración


          // Añade el ID provisional a cada fila para la renderización en React
          const datosConId = (data.df.datos || []).map((fila) => {
            // Normaliza las claves de la fila a minúsculas para una búsqueda flexible de IDs
            // No uses estas claves normalizadas para acceder a los valores en la renderización,
            // solo para la lógica de identificación de IDs.
            const normalizedFilaKeys = Object.fromEntries(
                Object.entries(fila).map(([key, value]) => [String(key).trim().toLowerCase(), value])
            );

            // Prioriza la columna "COD" (como en tu JSON de ejemplo), luego "codigo producto", "codigo barras"
            // Asegúrate de que el acceso a estas claves aquí también considere la capitalización si es necesario
            // o usa las claves normalizadas que creaste en `normalizedFilaKeys`.
            const idProducto = String(
                normalizedFilaKeys["cod"] ||
                normalizedFilaKeys["codigo_producto"] ||
                normalizedFilaKeys["código_producto"] ||
                ""
            ).trim();
            const idBarras = String(
                normalizedFilaKeys["ean 13"] || // Como en tu otro ejemplo de imagen
                normalizedFilaKeys["codigo_barras"] ||
                normalizedFilaKeys["código_barras"] ||
                ""
            ).trim();

            return {
              ...fila, // Mantén las claves ORIGINALES de la fila para la visualización y edición
              _id_provisional: idProducto || idBarras || crypto.randomUUID(), // Genera un UUID si no se encuentra un ID estable
            };
          });

          setDatos(datosConId);
          console.log("Datos con _id_provisional (estado 'datos'):", datosConId); // Log para depuración

        } else {
          setColumnas([]);
          setDatos([]);
          setColumnasMonetariasDetectadas([]);
        }
      } catch (error) {
        showToast.hideLoadingToast(toastId);
        setColumnas([]);
        setDatos([]);
        setColumnasMonetariasDetectadas([]);
        UtilsFunctions.showToastMessageSuccessError(false, "Error al procesar archivo: " + error.message);
        console.error("Error al procesar archivo:", error); // Log del error
      }
    };
    analizar();
  }, [file, apiCsvAnalizar, sinonimosPrecios]);

  // Funciones de manejo de estado y UI, memoizadas con useCallback para optimización
  const abrirModalPreview = useCallback(() => {
    const copiaDatos = structuredClone(datos);
    setDatosEdit(copiaDatos);
    setModoEdicion(false);
    setOpenPreviewModal(true);
  }, [datos]);

  const cerrarModalPreview = useCallback(() => {
    setOpenPreviewModal(false);
    setModoEdicion(false);
  }, []);

  const cancelarEdicion = useCallback(() => {
    const copiaDatos = structuredClone(datos);
    setDatosEdit(copiaDatos);
    setModoEdicion(false);
  }, [datos]);

  const guardarEdicion = useCallback(() => {
    setDatos(datosEdit);
    console.log("Datos guardados:", datosEdit);
    setModoEdicion(false);
    setOpenPreviewModal(false);
    UtilsFunctions.showToastMessageSuccessError(true, "Datos actualizados correctamente");
  }, [datosEdit]);

  // Maneja cambios en las celdas editables
  const handleChange = useCallback((rowIndex, colName, value) => {
    setDatosEdit((prevDatos) => {
      const newDatos = [...prevDatos];
      let parsedValue = value;

      // Si la columna es monetaria, intenta convertir el valor a número.
      // Aquí 'colName' debería venir con la capitalización original de la columna.
      // La comparación con 'columnasMonetariasDetectadas' debe ser en minúsculas.
      if (columnasMonetariasDetectadas.includes(colName.toLowerCase())) {
          // Remover el símbolo de moneda, separador de miles y reemplazar coma por punto para decimales
          const cleanedValue = String(value).replace(/[^0-9,-]+/g, '').replace(/\./g, '').replace(/,/g, '.');
          const numValue = parseFloat(cleanedValue);
          parsedValue = isNaN(numValue) ? value : numValue;
      }
      newDatos[rowIndex] = { ...newDatos[rowIndex], [colName]: parsedValue };
      return newDatos;
    });
  }, [columnasMonetariasDetectadas]);

  const agregarColumna = useCallback(() => {
    let baseName = "nueva_columna";
    let newName = baseName;
    let i = 1;
    // Para la comprobación de columnas existentes, sí podemos normalizar a minúsculas
    const columnasExistentesSet = new Set(columnas.map(c => c.toLowerCase()));
    while (columnasExistentesSet.has(newName.toLowerCase())) {
      newName = `${baseName}_${i}`;
      i++;
    }
    const nuevasColumnas = [...columnas, newName]; // Agrega el nombre con la capitalización por defecto (newName)
    setColumnas(nuevasColumnas);
    const nuevoDf = datosEdit.map((fila) => ({ ...fila, [newName]: "" }));
    setDatosEdit(nuevoDf);
    setColumnVersion((prev) => prev + 1);
  }, [columnas, datosEdit]);

  const agregarFila = useCallback(() => {
    const nuevaFila = {};
    // Cuando creas una nueva fila, usa los nombres de columna EXACTOS
    columnas.forEach((col) => {
      nuevaFila[col] = "";
    });
    nuevaFila._id_provisional = crypto.randomUUID();
    setDatosEdit((prevDatos) => [...prevDatos, nuevaFila]);
  }, [columnas]);

  const eliminarColumna = useCallback((columnaAEliminar) => {
    const nuevasColumnas = columnas.filter((c) => c !== columnaAEliminar);
    setColumnas(nuevasColumnas);
    const nuevoDf = datosEdit.map((fila) => {
      const copia = { ...fila };
      delete copia[columnaAEliminar]; // Elimina la columna con el nombre exacto
      return copia;
    });
    setDatosEdit(nuevoDf);
    setColumnVersion((prev) => prev + 1);
    // Vuelve a calcular columnas monetarias si se eliminó una que lo era
    setColumnasMonetariasDetectadas(prev => prev.filter(c => c !== columnaAEliminar.toLowerCase()));
  }, [columnas, datosEdit]);

  const eliminarFila = useCallback((indexFila) => {
    const nuevoDf = datosEdit.filter((_, idx) => idx !== indexFila);
    setDatosEdit(nuevoDf);
  }, [datosEdit]);

  if (columnas.length === 0 && datos.length === 0 && file) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "200px",
          fontSize: "1.2rem",
          color: "#666",
        }}
      >
        ⏳ Procesando archivo...
      </Box>
    );
  }

  return (
    <Box
      sx={{
        maxWidth: 960,
        mx: "auto",
        px: 2,
        pb: 6,
        minHeight: "70vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        gap: 3,
      }}
    >
      <InternalForm columnas={columnas} setColumnas={setColumnas} df={datos} setDf={setDatos} file={file} />

      <Box display="flex" justifyContent="center" mt={2}>
        <Button variant="outlined" color="success" onClick={abrirModalPreview} sx={{ minWidth: 280 }} disabled={datos.length === 0}>
          ✅ Vista previa de los productos del archivo procesado
        </Button>
      </Box>

      <MuiModal
        open={openPreviewModal}
        maxWidth="lg"
        onClose={cerrarModalPreview}
        title={`Vista previa del archivo (${datos.length} productos)`}
        sx={{ ".MuiDialog-paper": { maxWidth: 1000, mx: "auto", p: 3 } }}
      >
        {file && (
          <Box mb={3} display="flex" alignItems="center" gap={2} justifyContent="center" flexWrap="wrap">
            <InsertDriveFileIcon fontSize="large" color="action" />
            <Box textAlign="center">
              <Typography variant="body1" fontWeight="bold" noWrap>
                {file.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formatBytes(file.size)} — {file.type}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Última modificación: {formatDate(file.lastModified)}
              </Typography>
            </Box>
          </Box>
        )}

        <Divider sx={{ mb: 3 }} />

        {/* Pasa las columnas monetarias detectadas a InternalEditor */}
        <InternalEditor
          columnas={columnas} // Estas son las columnas con la capitalización original
          datos={datos}
          datosEdit={datosEdit}
          modoEdicion={modoEdicion}
          setModoEdicion={setModoEdicion}
          setDatosEdit={setDatosEdit}
          setColumnas={setColumnas}
          eliminarFila={eliminarFila}
          eliminarColumna={eliminarColumna}
          agregarFila={agregarFila}
          agregarColumna={agregarColumna}
          handleChange={handleChange}
          guardarEdicion={guardarEdicion}
          cancelarEdicion={cancelarEdicion}
          columnVersion={columnVersion}
          columnasMonetariasDetectadas={columnasMonetariasDetectadas}
        />
      </MuiModal>
    </Box>
  );
}