"use client";

import React, { useEffect, useContext, useState } from "react";
import InternalForm from "./InternalForm";
import showToast from "../../../../shared/utils/ToastShow";
import UtilsFunctions from "@/shared/utils/utilsFunctions";
import { ApiCsvContext } from "@/shared/context/CsvContext";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { formatDate, formatBytes } from "@/shared/services/servicesInternal/servicesInternalGeneral";
import { MuiModal } from "@/shared/ui/Internal/MuiModal";
import { EditableColumnName } from "./EditableColumnName";

import {
  Typography,
  Button,
  Box,
  Divider,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TextField,
  IconButton,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

export default function InternalContainer({ file }) {
  const [columnVersion, setColumnVersion] = useState(0);
  const { apiCsvAnalizar } = useContext(ApiCsvContext);
  const [openPreviewModal, setOpenPreviewModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [columnas, setColumnas] = useState([]);
  const [datos, setDatos] = useState([]);
  const [datosEdit, setDatosEdit] = useState([]);

  useEffect(() => {
    if (!file) return;
    const toastId = showToast.showLoadingToast();
    const analizar = async () => {
      try {
        const res = await apiCsvAnalizar(file);
        showToast.hideLoadingToast(toastId);
        const { success, message, data } = res;
        UtilsFunctions.showToastMessageSuccessError(success, message);

        if (data.df) {
          const columnasUnicas = Array.from(new Set(data.df.columnas || []));
          setColumnas(columnasUnicas);
          setDatos(data.df.datos || []);
        } else {
          setColumnas([]);
          setDatos([]);
        }
      } catch (error) {
        showToast.hideLoadingToast(toastId);
        console.error("Error analizando CSV:", error);
        setColumnas([]);
        setDatos([]);
        UtilsFunctions.showToastMessageSuccessError(false, "Error al procesar archivo");
      }
    };
    analizar();
  }, [file, apiCsvAnalizar]);

  const abrirModalPreview = () => {
    const copiaDatos = datos.map(row => ({ ...row }));
    setDatosEdit(copiaDatos);
    setModoEdicion(false);
    setOpenPreviewModal(true);
  };

  const cerrarModalPreview = () => {
    setOpenPreviewModal(false);
    setModoEdicion(false);
      console.log("Modal cerrado. Datos actuales:", datos);
  };

  const cambiarModoEdicion = () => setModoEdicion(true);

  const cancelarEdicion = () => {
    const copiaDatos = datos.map(row => ({ ...row }));
    setDatosEdit(copiaDatos);
    setModoEdicion(false);
  };

  const guardarEdicion = () => {
    setDatos(datosEdit);
      console.log("Datos guardados:", datosEdit); 
    setModoEdicion(false);
    setOpenPreviewModal(false);
    UtilsFunctions.showToastMessageSuccessError(true, "Datos actualizados correctamente");
  };

  const handleChange = (rowIndex, colName, value) => {
    setDatosEdit(prevDatos => {
      const copia = [...prevDatos];
      copia[rowIndex] = { ...copia[rowIndex], [colName]: value };
      return copia;
    });
  };

  const agregarColumna = () => {
    let baseName = "nueva_columna";
    let newName = baseName;
    let i = 1;
    const columnasExistentes = new Set(columnas);
    while (columnasExistentes.has(newName)) {
      newName = `${baseName}_${i}`;
      i++;
    }
    const nuevasColumnas = [...columnas, newName];
    setColumnas(nuevasColumnas);
    const nuevoDf = datosEdit.map((fila) => ({ ...fila, [newName]: "" }));
    setDatosEdit(nuevoDf);
    setColumnVersion((prev) => prev + 1);
  };

  const agregarFila = () => {
    const nuevaFila = {};
    columnas.forEach((col) => {
      nuevaFila[col] = "";
    });
    setDatosEdit([...datosEdit, nuevaFila]);
  };

  const eliminarColumna = (columnaAEliminar) => {
    const nuevasColumnas = columnas.filter((c) => c !== columnaAEliminar);
    setColumnas(nuevasColumnas);
    const nuevoDf = datosEdit.map((fila) => {
      const copia = { ...fila };
      delete copia[columnaAEliminar];
      return copia;
    });
    setDatosEdit(nuevoDf);
    setColumnVersion(prev => prev + 1);
  };

  const eliminarFila = (indexFila) => {
    const nuevoDf = datosEdit.filter((_, idx) => idx !== indexFila);
    setDatosEdit(nuevoDf);
  };

  if (columnas.length === 0 && datos.length === 0) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "200px", fontSize: "1.2rem", color: "#666" }}>
        ⏳ Procesando archivo...
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 960, mx: "auto", px: 2, pb: 6, minHeight: "70vh", display: "flex", flexDirection: "column", justifyContent: "flex-start", gap: 3 }}>
      <InternalForm columnas={columnas} setColumnas={setColumnas} df={datos} setDf={setDatos} file={file} />

      <Box display="flex" justifyContent="center" mt={2}>
        <Button variant="outlined" color="success" onClick={abrirModalPreview} sx={{ minWidth: 280 }}>
          ✅ Vista previa de los productos del archivo procesado
        </Button>
      </Box>

      <MuiModal open={openPreviewModal} maxWidth="lg" onClose={cerrarModalPreview} title={`Vista previa del archivo (${datos.length} productos)`} sx={{ ".MuiDialog-paper": { maxWidth: 1000, mx: "auto", p: 3 } }}>
        {file && (
          <Box mb={3} display="flex" alignItems="center" gap={2} justifyContent="center" flexWrap="wrap">
            <InsertDriveFileIcon fontSize="large" color="action" />
            <Box textAlign="center">
              <Typography variant="body1" fontWeight="bold" noWrap>{file.name}</Typography>
              <Typography variant="body2" color="text.secondary">{formatBytes(file.size)} — {file.type}</Typography>
              <Typography variant="body2" color="text.secondary">Última modificación: {formatDate(file.lastModified)}</Typography>
            </Box>
          </Box>
        )}

        <Divider sx={{ mb: 3 }} />

        <Box display="flex" justifyContent="flex-end" mb={2} gap={1}>
          {!modoEdicion && <Button variant="outlined" onClick={cambiarModoEdicion}>📝 Editar datos</Button>}
          {modoEdicion && (
            <>
              <Button variant="contained" color="primary" onClick={guardarEdicion}>💾 Guardar</Button>
              <Button variant="outlined" onClick={cancelarEdicion}>❌ Cancelar</Button>
            </>
          )}
        </Box>

        {modoEdicion && (
          <Box display="flex" justifyContent="flex-start" mb={2} gap={1}>
            <Button variant="outlined" startIcon={<AddIcon />} onClick={agregarColumna}>Agregar columna</Button>
            <Button variant="outlined" startIcon={<AddIcon />} onClick={agregarFila}>Agregar fila</Button>
          </Box>
        )}

        {(modoEdicion ? datosEdit : datos).length > 0 ? (
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                {columnas.map((col, index) => (
                  <TableCell key={`header-${col}-${columnVersion}`} sx={{ textTransform: "uppercase", fontWeight: "normal", color: "text.primary", fontSize: "0.90rem", letterSpacing: "0.5px", textAlign: "center", whiteSpace: "nowrap", px: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
                      <EditableColumnName columnName={col} index={index} columnas={columnas} setColumnas={setColumnas} df={datosEdit} setDf={setDatosEdit} />
                      {modoEdicion && (
                        <IconButton size="small" color="error" onClick={() => eliminarColumna(col)} aria-label={`Eliminar columna ${col}`}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                  </TableCell>
                ))}
                <TableCell sx={{ width: 36, px: 0, textAlign: "center", color: "text.secondary" }} />
              </TableRow>
            </TableHead>

            <TableBody>
              {(modoEdicion ? datosEdit : datos).slice(0, 20).map((fila, idx) => (
                <TableRow key={`fila-${idx}`}>
                  {columnas.map((col) => (
                    <TableCell key={`fila-${idx}-col-${col}`} sx={{ px: 1, py: 0, height: 40, textAlign: "center", whiteSpace: "nowrap", verticalAlign: "middle" }}>
                      {modoEdicion ? (
                        <TextField
                          variant="standard"
                          value={datosEdit[idx]?.[col] ?? ""}
                          onChange={(e) => handleChange(idx, col, e.target.value)}
                          fullWidth
                          InputProps={{
                            disableUnderline: true,
                            sx: { fontSize: "0.8rem", textAlign: "center", padding: 0, height: 32, lineHeight: "1.5em", color: "#6e6e6e" },
                          }}
                          inputProps={{ style: { textAlign: "center" } }}
                        />
                      ) : (
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.8rem", lineHeight: "1.5em", height: 32, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {fila[col]?.toString() ?? "-"}
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
            No hay datos procesados.
          </Typography>
        )}
      </MuiModal>
    </Box>
  );
}