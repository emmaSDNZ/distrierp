import React, { useState, useEffect, useRef, memo, useCallback } from "react";
import { TextField, Typography } from "@mui/material";

export const EditableColumnName = memo(function EditableColumnName({
  columnName,
  // **SOLUCIÓN ROBUSTA 13: `EditableColumnName` ya no necesita `index` como prop.**
  // El componente encontrará el índice de la columna internamente cuando lo necesite.
  columnas,
  setColumnas,
  df, // `datosEdit` pasado como `df`
  setDf, // `setDatosEdit` pasado como `setDf`
}) {
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState(columnName);
  const inputRef = useRef(null);

  useEffect(() => {
    // Sincroniza el estado interno `newName` con la prop `columnName` if changes externally.
    // Esto es importante if el nombre de la columna es modificado por otra parte del sistema.
    setNewName(columnName);
  }, [columnName]);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  // **SOLUCIÓN ROBUSTA 14: Lógica de guardado robusta y memoizada**
  // Validaciones completas y actualización inmutable.
  const handleSave = useCallback(() => {
    const trimmedNewName = newName.trim();
    
    // Si el nombre está vacío o no ha cambiado, simplemente salimos del modo edición.
    if (!trimmedNewName || trimmedNewName === columnName) {
      setEditing(false);
      return;
    }

    // Convertimos a minúsculas para una comparación case-insensitive de nombres duplicados.
    const lowerTrimmedNewName = trimmedNewName.toLowerCase();
    const currentColumnNameLower = columnName.toLowerCase();

    // Verificamos si el nuevo nombre ya existe en OTRA columna (excluyendo la actual).
    // Usamos `some` para iterar y encontrar si hay un duplicado.
    const isDuplicate = columnas.some(
      (col) => col.toLowerCase() === lowerTrimmedNewName && col.toLowerCase() !== currentColumnNameLower
    );

    if (isDuplicate) {
      alert("Ya existe otra columna con ese nombre.");
      setNewName(columnName); // Restaura el nombre anterior
      setEditing(false);
      return;
    }

    // Encuentra el índice actual de la columna que estamos editando.
    // Esto es más seguro que depender de un `index` pasado como prop que podría desfasarse.
    const currentIndex = columnas.indexOf(columnName);
    if (currentIndex === -1) {
      console.warn(`Error: La columna "${columnName}" no se encontró en el array de columnas. No se pudo renombrar.`);
      setEditing(false);
      return;
    }

    // Actualiza el array de columnas de forma inmutable.
    const nuevasColumnas = [...columnas];
    nuevasColumnas[currentIndex] = trimmedNewName;
    setColumnas(nuevasColumnas);

    // **SOLUCIÓN ROBUSTA 15: Actualización inmutable de los datos al renombrar la columna.**
    // Recorre cada fila y renombra la propiedad de la columna.
    const nuevoDf = df.map((row) => {
      // structuredClone asegura que los objetos de la fila sean copias profundas e inmutables.
      // Esto es crucial para evitar mutaciones directas de objetos anidados.
      const newRow = structuredClone(row); 
      if (Object.prototype.hasOwnProperty.call(newRow, columnName)) {
        newRow[trimmedNewName] = newRow[columnName]; // Asigna el valor a la nueva clave
        delete newRow[columnName]; // Elimina la clave antigua
      }
      return newRow;
    });

    setDf(nuevoDf); // Actualiza el estado de los datos con el DataFrame modificado.
    setEditing(false);
  }, [newName, columnName, columnas, setColumnas, df, setDf]); // Dependencias para useCallback

  const handleKeyDown = useCallback((e) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      setNewName(columnName); // Restaura el nombre original al cancelar
      setEditing(false);
    }
  }, [handleSave, columnName]); // Dependencias para useCallback

  return (
    <>
      {editing ? (
        <TextField
          inputRef={inputRef}
          value={newName} 
          onChange={(e) => setNewName(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          variant="standard"
          size="small"
          fullWidth
          inputProps={{ style: { textAlign: "center" } }}
          autoComplete="off"
          spellCheck={false}
        />
      ) : (
        <Typography
          noWrap
          fontSize="0.75rem"
          fontWeight={400}            // normal, no negrita
          sx={{
            cursor: "pointer",
            userSelect: "none",
            textAlign: "center",
            textTransform: "uppercase", // Mayúsculas
          }}
          title="Doble clic para editar nombre"
          onDoubleClick={() => setEditing(true)}
        >
          {columnName}
        </Typography>
      )}
    </>
  );
});