import React, { useState, useMemo } from "react";
import {
  Typography,
  Button,
  Box,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TextField,
  IconButton,
} from "@mui/material";
import EditorReglasAvanzado from "./PanelReglasNegocioAvanzado";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { EditableColumnName } from "./EditableColumnName";
import PanelesReglasNegocio from "./PanelesReglasNegocio";
import { aplicarAumentoPorColumna, aplicarDescuentoProducto } from "@/shared/utils/reglasDeNegocio/reglasNegocio";
import UtilsFunctions from "@/shared/utils/utilsFunctions";

export function InternalEditor({
  columnas,
  datos,
  datosEdit,
  modoEdicion,
  setModoEdicion,
  setDatosEdit,
  setColumnas,
  eliminarFila,
  eliminarColumna,
  agregarFila,
  agregarColumna,
  handleChange,
  guardarEdicion,
  cancelarEdicion,
  columnVersion,
  columnasMonetariasDetectadas, // ¡Recibimos el prop de InternalContainer!
}) {
  const [openModalReglas, setOpenModalReglas] = useState(false);
  const [openModalAvanzado, setOpenModalAvanzado] = useState(false);

  // Columnas válidas para reglas de negocio (excluye _id_provisional)
  const columnasValidas = useMemo(() => {
    const datosBase = modoEdicion ? datosEdit : datos;
    if (!datosBase || datosBase.length === 0) return [];

    const allKeys = datosBase.flatMap(fila => Object.keys(fila));

    const uniqueNormalizedKeys = new Set(allKeys.map(k => String(k).trim().toLowerCase()));

    // Filtra las claves no deseadas y mapea de nuevo a mayúsculas si es necesario para mostrar,
    // pero la comparación interna se hace con minúsculas.
    // Aquí el `columnas` prop ya debería tener los nombres normalizados si se desea usar esos,
    // o se pueden usar los originales del `data.df.columnas` del backend.
    // Para reglas, lo mejor es usar los nombres tal cual aparecen en el objeto de datos.
    return Array.from(new Set(
        datosBase.flatMap(fila => Object.keys(fila))
                 .filter(k => !!k && String(k).trim().toLowerCase() !== "nan" && String(k).trim().toLowerCase() !== "_id_provisional")
    ));

  }, [datosEdit, datos, modoEdicion]);

  const handleAplicarReglas = ({ tipoRegla, columna, porcentaje, productos }) => {
    let nuevosDatos = [...datosEdit];

    console.log("🚀 Aplicando regla con:", { tipoRegla, columna, porcentaje, productos });

    if (!columna) {
      UtilsFunctions.showToastMessageSuccessError(false, "Por favor selecciona una columna válida.");
      return;
    }
    if (isNaN(porcentaje) || porcentaje === "") {
      UtilsFunctions.showToastMessageSuccessError(false, "Por favor ingresa un porcentaje válido.");
      return;
    }

    // Las funciones de reglas de negocio esperan números.
    // El `handleChange` en InternalContainer ya se encarga de parsear a número si es monetaria.
    if (tipoRegla === "aumento") {
      nuevosDatos = aplicarAumentoPorColumna(nuevosDatos, productos, columna, porcentaje);
    } else if (tipoRegla === "descuento") {
      nuevosDatos = aplicarDescuentoProducto(nuevosDatos, productos, columna, porcentaje);
    }

    console.log("📝 Datos después de aplicar regla:", nuevosDatos);

    setDatosEdit(nuevosDatos);
    UtilsFunctions.showToastMessageSuccessError(true, "Regla aplicada correctamente");
  };

  console.log("InternalEditor - Renderizando con datos:", datos); // Último chequeo de datos
  console.log("InternalEditor - Columnas para renderizar:", columnas); // Último chequeo de columnas

  return (
    <>
      <Box display="flex" justifyContent="flex-end" mb={2} gap={1}>
        {!modoEdicion && (
          <Button variant="outlined" onClick={() => setModoEdicion(true)} disabled={datos.length === 0}>
            📝 Editar datos
          </Button>
        )}
        {modoEdicion && (
          <>
            <Button variant="contained" color="primary" onClick={guardarEdicion}>
              💾 Guardar
            </Button>
            <Button variant="outlined" onClick={cancelarEdicion}>
              ❌ Cancelar
            </Button>
            <Button variant="outlined" onClick={() => setOpenModalReglas(true)}>
              ⚙️ Aplicar reglas
            </Button>
            <Button variant="outlined" color="secondary" onClick={() => setOpenModalAvanzado(true)}>
              🧠 Reglas avanzadas
            </Button>
          </>
        )}
      </Box>

      {modoEdicion && (
        <Box display="flex" justifyContent="flex-start" mb={2} gap={1}>
          <Button variant="outlined" startIcon={<AddIcon />} onClick={agregarColumna}>
            Agregar columna
          </Button>
          <Button variant="outlined" startIcon={<AddIcon />} onClick={agregarFila}>
            Agregar fila
          </Button>
        </Box>
      )}

      {(modoEdicion ? datosEdit : datos).length > 0 ? (
        <Table size="small" stickyHeader key={`data-table-${columnVersion}`}>
          <TableHead>
            <TableRow>
              {columnas.map((col) => (
                <TableCell
                  key={`header-${col}`}
                  sx={{
                    textTransform: "uppercase",
                    fontWeight: "normal",
                    color: "text.primary",
                    fontSize: "0.90rem",
                    letterSpacing: "0.5px",
                    textAlign: "center",
                    whiteSpace: "nowrap",
                    px: 1,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
                    {modoEdicion ? (
                      <>
                        <EditableColumnName
                          columnName={col}
                          columnas={columnas}
                          setColumnas={setColumnas}
                          df={datosEdit}
                          setDf={setDatosEdit}
                        />
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => eliminarColumna(col)}
                          aria-label={`Eliminar columna ${col}`}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </>
                    ) : (
                      <Typography variant="body2" sx={{ fontSize: "0.85rem", textAlign: "center", flex: 1 }}>
                        {col}
                      </Typography>
                    )}
                  </Box>
                </TableCell>
              ))}
              {/* Celda extra para el botón de eliminar fila */}
              <TableCell sx={{ width: 36, px: 0, textAlign: "center", color: "text.secondary" }} />
            </TableRow>
          </TableHead>

          <TableBody>
            {/* Limita la visualización a las primeras 20 filas para rendimiento */}
            {(modoEdicion ? datosEdit : datos).slice(0, 20).map((fila, idx) => (
              <TableRow key={`fila-${fila._id_provisional}`}>
                {columnas.map((col) => (
                  <TableCell
                    key={`${fila._id_provisional}-${col}`}
                    sx={{ px: 1, py: 0, height: 40, textAlign: "center", whiteSpace: "nowrap", verticalAlign: "middle" }}
                  >
                    {modoEdicion ? (
                      <TextField
                        variant="standard"
                        // El valor del TextField debe ser el valor numerico sin formatear para que la edicion sea mas natural.
                        // El handleChange ya se encarga de parsear.
                        value={datosEdit[idx]?.[col] ?? ""}
                        onChange={(e) => {
                          handleChange(idx, col, e.target.value);
                        }}
                        fullWidth
                        InputProps={{
                          disableUnderline: true,
                          sx: { fontSize: "0.8rem", textAlign: "center", padding: 0, height: 32, lineHeight: "1.5em", color: "#6e6e6e" },
                        }}
                        inputProps={{ style: { textAlign: "center" } }}
                      />
                    ) : (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontSize: "0.8rem", lineHeight: "1.5em", height: 32, display: "flex", alignItems: "center", justifyContent: "center" }}
                      >
                        {
                          // Aplica formato de moneda solo si el valor es numérico Y la columna es monetaria
                          typeof fila[col] === "number" && columnasMonetariasDetectadas.includes(col.toLowerCase())
                            ? fila[col].toLocaleString("es-AR", { style: "currency", currency: "ARS" })
                            : fila[col]?.toString() ?? "-"
                        }
                      </Typography>
                    )}
                  </TableCell>
                ))}
                <TableCell sx={{ textAlign: "center", px: 0, height: 40 }}>
                  {modoEdicion && (
                    <IconButton size="small" color="error" onClick={() => eliminarFila(idx)} aria-label="Eliminar fila">
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <Typography textAlign="center" color="text.secondary" sx={{ mt: 4 }}>
          No hay datos procesados para mostrar. Por favor, sube un archivo CSV/Excel.
        </Typography>
      )}

      {/* Modal reglas de negocio */}
      <PanelesReglasNegocio
        open={openModalReglas}
        onClose={() => setOpenModalReglas(false)}
        columnas={columnasValidas}
        productos={datosEdit.map((fila) => ({
          id: fila._id_provisional,
          nombre: fila.producto ?? fila["NOMBRE COMERCIAL"] ?? "Producto sin nombre", // Usa NOMBRE COMERCIAL si existe
        }))}
        onAplicar={handleAplicarReglas} 
      />

      <EditorReglasAvanzado
        open={openModalAvanzado}
        onClose={() => setOpenModalAvanzado(false)}
        columnas={columnasValidas}
        datos={datosEdit}
        onAplicar={(nuevosDatos) => {
          setDatosEdit(nuevosDatos);
          UtilsFunctions.showToastMessageSuccessError(true, "Reglas avanzadas aplicadas correctamente");
        }}
      />
    </>
  );
}