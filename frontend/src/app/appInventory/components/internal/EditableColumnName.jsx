import React, { useState, useEffect, useRef, memo } from "react";
import { TextField, Typography } from "@mui/material";

export const EditableColumnName = memo(function EditableColumnName({
  columnName,
  index,
  columnas,
  setColumnas,
  df,
  setDf,
}) {
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState(columnName);
  const inputRef = useRef(null);

  useEffect(() => {
    setNewName(columnName);
  }, [columnName]);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const handleSave = () => {
    const trimmed = newName.trim();
    if (!trimmed || trimmed === columnName) {
      setEditing(false);
      return;
    }

    if (columnas.includes(trimmed)) {
      alert("Ya existe una columna con ese nombre.");
      setNewName(columnName);
      setEditing(false);
      return;
    }

    // Actualiza el array de columnas
    const nuevasColumnas = [...columnas];
    nuevasColumnas[index] = trimmed;
    setColumnas(nuevasColumnas);

    // Actualiza los datos, renombrando la propiedad de la columna
    const nuevoDf = df.map((row) => {
      const nuevo = { ...row, [trimmed]: row[columnName] };
      delete nuevo[columnName];
      return nuevo;
    });

    setDf(nuevoDf);
    setEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") {
      setNewName(columnName);
      setEditing(false);
    }
  };

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
          fontWeight={400}              // normal, no negrita
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
