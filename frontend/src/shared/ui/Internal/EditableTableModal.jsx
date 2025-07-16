import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  Button,
  TextField,
  Box,
} from "@mui/material";

export function EditableTableModal({ open, onClose, columnas, data, onSave }) {
  const [tableData, setTableData] = useState([]);
  const [columnNames, setColumnNames] = useState([]);
  const [editColumnNames, setEditColumnNames] = useState(false);

  useEffect(() => {
    setTableData(data || []);
    setColumnNames(columnas || []);
    setEditColumnNames(false);
  }, [data, columnas, open]);

  // Cambiar nombre columna
  const handleColumnNameChange = (index, newName) => {
    if (!newName.trim()) return; // no vacío
    if (columnNames.includes(newName) && columnNames[index] !== newName) return; // no repetidos

    const oldName = columnNames[index];
    const updatedColumns = [...columnNames];
    updatedColumns[index] = newName;

    const updatedData = tableData.map((row) => {
      const newRow = { ...row };
      newRow[newName] = newRow[oldName];
      delete newRow[oldName];
      return newRow;
    });

    setColumnNames(updatedColumns);
    setTableData(updatedData);
  };

  // Cambiar valor celda
  const handleCellChange = (rowIndex, colName, value) => {
    const updatedData = [...tableData];
    updatedData[rowIndex] = { ...updatedData[rowIndex], [colName]: value };
    setTableData(updatedData);
  };

  // Agregar fila vacía
  const handleAddRow = () => {
    const newRow = {};
    columnNames.forEach((col) => (newRow[col] = ""));
    setTableData([...tableData, newRow]);
  };

  // Eliminar fila
  const handleDeleteRow = (rowIndex) => {
    setTableData(tableData.filter((_, i) => i !== rowIndex));
  };

  // Guardar todo y cerrar modal
  const handleSave = () => {
    onSave(tableData, columnNames);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>Editar datos y columnas</DialogTitle>
      <DialogContent dividers style={{ overflowX: "auto" }}>
        <Box mb={2}>
          <Button variant="outlined" onClick={() => setEditColumnNames(!editColumnNames)}>
            {editColumnNames ? "✅ Finalizar edición de columnas" : "✏️ Editar nombres de columnas"}
          </Button>
        </Box>

        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              {columnNames.map((col, i) => (
                <TableCell key={i} sx={{ minWidth: 140 }}>
                  {editColumnNames ? (
                    <TextField
                      variant="standard"
                      value={col}
                      onChange={(e) => handleColumnNameChange(i, e.target.value)}
                      fullWidth
                      size="small"
                    />
                  ) : (
                    col
                  )}
                </TableCell>
              ))}
              <TableCell sx={{ minWidth: 100 }}>Acciones</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {tableData.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {columnNames.map((col, colIndex) => (
                  <TableCell key={colIndex} sx={{ minWidth: 140 }}>
                    <TextField
                      variant="standard"
                      value={row[col] || ""}
                      onChange={(e) => handleCellChange(rowIndex, col, e.target.value)}
                      fullWidth
                      size="small"
                    />
                  </TableCell>
                ))}
                <TableCell>
                  <Button
                    color="error"
                    size="small"
                    onClick={() => handleDeleteRow(rowIndex)}
                  >
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleAddRow}>Agregar fila</Button>
        <Button variant="contained" color="primary" onClick={handleSave}>
          Guardar
        </Button>
        <Button onClick={onClose}>Cancelar</Button>
      </DialogActions>
    </Dialog>
  );
}
