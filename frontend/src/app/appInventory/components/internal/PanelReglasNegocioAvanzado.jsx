import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Typography,
  IconButton,
  Divider,
  Grid,
  Box,
  Paper, // Importar Paper para las "cajas" de grupo
  Snackbar, // Para notificaciones
  Alert,    // Para notificaciones
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { aplicarReglasADatos } from "@/shared/utils/reglasDeNegocio/aplicarReglas"; // Asegúrate de que la ruta sea correcta

// Definiciones de operadores y tipos de acción (sin cambios, solo para referencia)
const operadores = [
  { label: "Igual a", value: "==" },
  { label: "Diferente de", value: "!=" },
  { label: "Mayor que", value: ">" },
  { label: "Menor que", value: "<" },
  { label: "Contiene", value: "includes" },
  { label: "Entre (rango)", value: "between" },
  { label: "Coincide RegEx", value: "regex" },
];

const tiposAccion = [
  { label: "Aumentar %", value: "increase" },
  { label: "Disminuir %", value: "decrease" },
  { label: "Establecer valor", value: "set" },
];

// Función auxiliar para generar un resumen legible de la regla
const generarResumenRegla = (regla) => {
  if (!regla || !regla.condiciones || regla.condiciones.length === 0) {
    return "Regla vacía.";
  }

  const procesarElemento = (elemento) => {
    if (elemento.tipo === "condicion") {
      const operadorLabel = operadores.find(op => op.value === elemento.operador)?.label || elemento.operador;
      let valorDisplay = elemento.valor;
      if (elemento.operador === "between") {
        valorDisplay = `${elemento.valor} Y ${elemento.valorExtra}`;
      }
      return `"${elemento.columna}" ${operadorLabel.toUpperCase()} "${valorDisplay}"`;
    } else if (elemento.tipo === "grupo") {
      // El operador interno del grupo es el que une sus condiciones
      const contenidoGrupo = elemento.condiciones.map(procesarElemento).join(` ${elemento.operadorLogicoInterno || "AND"} `);
      return `(${contenidoGrupo})`;
    }
    return "";
  };

  // El operador lógico principal es el que define cómo se combinan los elementos del grupo raíz
  // Ahora tomamos el operadorLogicoInterno directamente de la regla raíz
  const operadorPrincipal = regla.operadorLogicoInterno || "AND";
  
  const elementosResumen = regla.condiciones.map((cond, index) => {
    let elementoStr = procesarElemento(cond);
    // Para el grupo raíz, el operadorLogico de los hijos (cond.operadorLogico) no se usa, 
    // sino el operadorLogicoInterno del padre (operadorPrincipal).
    // Si es el primer elemento, no lleva operador previo.
    if (index > 0) {
      // Usamos cond.operadorLogico para combinar hermanos en el mismo nivel
      return `${cond.operadorLogico || operadorPrincipal} ${elementoStr}`;
    }
    return elementoStr;
  });

  return elementosResumen.join(" ");
};


function CondicionEditor({ condicion, onChange, onDelete, columnas, mostrarOperadorLogico }) {
  const { columna, operador, valor, valorExtra, operadorLogico } = condicion;

  const handleChange = (key, value) => {
    onChange({ ...condicion, [key]: value });
  };

  return (
    <Grid container spacing={1} alignItems="center" wrap="nowrap" sx={{ py: 1, pr: 1, bgcolor: "transparent" }}>
      {mostrarOperadorLogico && (
        <Grid item sx={{ minWidth: 100, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <FormControl fullWidth size="small" variant="outlined">
            <InputLabel sx={{ fontSize: "0.9rem" }}>Combinar</InputLabel>
            <Select
              value={operadorLogico || "AND"}
              onChange={(e) => handleChange("operadorLogico", e.target.value)}
              label="Combinar"
              sx={{ fontSize: "0.9rem", minWidth: 100 }}
            >
              <MenuItem value="AND" sx={{ fontSize: "0.9rem" }}>AND (Y)</MenuItem>
              <MenuItem value="OR" sx={{ fontSize: "0.9rem" }}>OR (O)</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      )}

      <Grid item xs sx={{ minWidth: 180 }}>
        <FormControl fullWidth size="small" variant="outlined">
          <InputLabel sx={{ fontSize: "0.9rem" }}>Columna</InputLabel>
          <Select
            value={columna}
            onChange={(e) => handleChange("columna", e.target.value)}
            label="Columna"
            sx={{ fontSize: "0.9rem" }}
          >
            {columnas.map((col) => (
              <MenuItem key={col} value={col} sx={{ fontSize: "0.9rem" }}>{col}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs sx={{ minWidth: 140, maxWidth: 160 }}>
        <FormControl fullWidth size="small" variant="outlined">
          <InputLabel sx={{ fontSize: "0.9rem" }}>Operador</InputLabel>
          <Select
            value={operador}
            onChange={(e) => handleChange("operador", e.target.value)}
            label="Operador"
            sx={{ fontSize: "0.9rem" }}
          >
            {operadores.map((op) => (
              <MenuItem key={op.value} value={op.value} sx={{ fontSize: "0.9rem" }}>{op.label}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs sx={{ minWidth: 130, maxWidth: 180 }}>
        <TextField
          fullWidth
          size="small"
          label={operador === "between" ? "Valor mínimo" : "Valor"}
          value={valor}
          onChange={(e) => handleChange("valor", e.target.value)}
          variant="outlined"
          sx={{ "& .MuiInputBase-input": { fontSize: "0.9rem" }, "& .MuiInputLabel-root": { fontSize: "0.9rem" } }}
        />
      </Grid>

      {operador === "between" && (
        <Grid item sx={{ minWidth: 130, maxWidth: 180 }}>
          <TextField
            fullWidth
            size="small"
            label="Valor máximo"
            value={valorExtra || ""}
            onChange={(e) => handleChange("valorExtra", e.target.value)}
            variant="outlined"
            sx={{ "& .MuiInputBase-input": { fontSize: "0.9rem" }, "& .MuiInputLabel-root": { fontSize: "0.9rem" } }}
          />
        </Grid>
      )}

      <Grid item sx={{ minWidth: 48, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <IconButton color="error" onClick={onDelete} size="small" sx={{ p: 0 }} title="Eliminar condición">
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Grid>
    </Grid>
  );
}

function GrupoEditor({ grupo, onChange, onDelete, columnas, nivel = 0 }) {
  // Generar un ID único para cada elemento de condición/grupo para las 'keys' de React
  const generateId = () => Math.random().toString(36).substring(2, 9);

  const agregarCondicion = () => {
    const nuevasCondiciones = [
      ...grupo.condiciones,
      {
        id: generateId(), // Añadido ID
        tipo: "condicion",
        operadorLogico: grupo.condiciones.length > 0 ? "AND" : undefined, // Asigna AND si no es la primera
        columna: "",
        operador: "==",
        valor: "",
        valorExtra: "",
      },
    ];
    onChange({ ...grupo, condiciones: nuevasCondiciones });
  };

  const agregarGrupo = () => {
    const nuevasCondiciones = [
      ...grupo.condiciones,
      {
        id: generateId(), // Añadido ID
        tipo: "grupo",
        operadorLogico: grupo.condiciones.length > 0 ? "AND" : undefined, // Asigna AND si no es el primer elemento
        operadorLogicoInterno: "AND", // Este es el operador que regirá *dentro* del nuevo grupo
        condiciones: [
          {
            id: generateId(), // Añadido ID
            tipo: "condicion",
            operadorLogico: undefined, // Primera condición dentro del nuevo grupo sin operador previo
            columna: "",
            operador: "==",
            valor: "",
            valorExtra: "",
          },
        ],
      },
    ];
    onChange({ ...grupo, condiciones: nuevasCondiciones });
  };

  const actualizarCondicion = (index, nuevaCondicion) => {
    let nuevasCondiciones = grupo.condiciones.map((c, i) => (i === index ? nuevaCondicion : c));

    // Lógica para asegurar que la primera condición de un grupo no tenga operadorLogico
    if (nuevasCondiciones.length > 0) {
      nuevasCondiciones[0].operadorLogico = undefined;
    }
    // Para cualquier elemento subsiguiente que se añada o mueva, si no tiene operador, asigna AND
    for (let i = 1; i < nuevasCondiciones.length; i++) {
        if (!nuevasCondiciones[i].operadorLogico) {
            nuevasCondiciones[i].operadorLogico = "AND";
        }
    }

    onChange({ ...grupo, condiciones: nuevasCondiciones });
  };

  const eliminarCondicion = (index) => {
    let nuevasCondiciones = grupo.condiciones.filter((_, i) => i !== index);

    // Reajustar operadorLogico para el primer elemento si es necesario
    if (nuevasCondiciones.length > 0) {
      nuevasCondiciones[0].operadorLogico = undefined;
    }

    onChange({ ...grupo, condiciones: nuevasCondiciones });
  };

  // Función para manejar el operador lógico *interno* del grupo
  const handleOperadorLogicoInternoChange = (value) => {
    onChange({ ...grupo, operadorLogicoInterno: value });
  };

  // Función para manejar el operador lógico que conecta este grupo con el elemento anterior
  const handleOperadorLogicoExternoChange = (value) => {
    onChange({ ...grupo, operadorLogico: value });
  };

  return (
    <>
      {nivel > 0 && ( // Este operador combina este grupo con la condición/grupo anterior en el nivel padre
        <Grid container spacing={1} alignItems="center" mb={1} sx={{ maxWidth: 900, mx: "auto", pl: `${(nivel - 1) * 2 + 1}rem`, pr: 1 }}> {/* Ajuste de padding/margen para alinear */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small" variant="outlined">
              <InputLabel sx={{ fontSize: "0.9rem" }}>Combinar este grupo con el anterior</InputLabel>
              <Select
                value={grupo.operadorLogico || "AND"} // Usa el operadorLogico del grupo para conexión externa
                onChange={(e) => handleOperadorLogicoExternoChange(e.target.value)}
                label="Combinar este grupo con el anterior"
                sx={{ fontSize: "0.9rem" }}
              >
                <MenuItem value="AND" sx={{ fontSize: "0.9rem" }}>AND (Y)</MenuItem>
                <MenuItem value="OR" sx={{ fontSize: "0.9rem" }}>OR (O)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item sx={{ minWidth: 48, display: "flex", justifyContent: "flex-end" }}>
            <IconButton color="error" onClick={onDelete} size="small" sx={{ p: 0.5 }} title="Eliminar grupo">
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Grid>
        </Grid>
      )}

      {/* Contenedor visual para el grupo */}
      {/* Añadido ID único para la clave si el grupo no tiene uno */}
      <Paper
        elevation={nivel === 0 ? 0 : 2}
        sx={{
          borderLeft: nivel === 0 ? "none" : "3px solid #1976d2",
          ml: nivel === 0 ? 0 : 0, // No necesitas ml, el paddingLeft del Paper lo hará
          pl: nivel === 0 ? 0 : 2, // padding interior para el contenido del grupo
          py: 1,
          mb: 2,
          position: 'relative',
          backgroundColor: nivel % 2 === 0 ? 'background.paper' : '#f0f0f0' // Color alterno para grupos
        }}
      >
        <Box sx={{ p: 1 }}> {/* Padding adicional dentro del Paper */}
          {/* Operador Lógico INTERNO del grupo (cómo se combinan sus hijos) */}
          <Grid container alignItems="center" spacing={1} mb={nivel > 0 ? 1 : 0}>
            {/* Solo muestra el selector de lógica interna del grupo y su etiqueta si es un SUBGRUPO (nivel > 0) */}
            {nivel > 0 && (
              <>
                <Grid item xs={12}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>
                    Elementos dentro de este grupo se combinan con:
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size="small" variant="outlined">
                    <InputLabel sx={{ fontSize: "0.9rem" }}>Lógica interna del grupo</InputLabel>
                    <Select
                      value={grupo.operadorLogicoInterno || "AND"} // Usa operadorLogicoInterno del grupo
                      onChange={(e) => handleOperadorLogicoInternoChange(e.target.value)}
                      label="Lógica interna del grupo"
                      sx={{ fontSize: "0.9rem" }}
                    >
                      <MenuItem value="AND" sx={{ fontSize: "0.9rem" }}>TODAS deben cumplir (AND)</MenuItem>
                      <MenuItem value="OR" sx={{ fontSize: "0.9rem" }}>ALGUNA debe cumplir (OR)</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </>
            )}
          </Grid>

          {grupo.condiciones.map((cond, i) =>
            cond.tipo === "grupo" ? (
              <GrupoEditor
                key={cond.id || i} // Usa cond.id como key
                grupo={cond}
                columnas={columnas}
                nivel={nivel + 1}
                onChange={(nuevoGrupo) => actualizarCondicion(i, nuevoGrupo)}
                onDelete={() => eliminarCondicion(i)}
              />
            ) : (
              <CondicionEditor
                key={cond.id || i} // Usa cond.id como key
                condicion={cond}
                columnas={columnas}
                mostrarOperadorLogico={i > 0} // Este operador conecta las condiciones *dentro* de este mismo grupo
                onChange={(nuevaCond) => actualizarCondicion(i, nuevaCond)}
                onDelete={() => eliminarCondicion(i)}
              />
            )
          )}

          <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mt: 2, mb: 1, maxWidth: 900, mx: "auto" }}>
            <Button
              variant="outlined"
              size="small"
              onClick={agregarCondicion}
              sx={{ fontWeight: "normal", textTransform: "none", width: 180 }}
              startIcon={<AddIcon />}
            >
              Añadir condición
            </Button>

            <Button
              variant="outlined"
              size="small"
              onClick={agregarGrupo}
              sx={{ fontWeight: "normal", textTransform: "none", width: 180 }}
              startIcon={<AddIcon />}
            >
              Añadir subgrupo
            </Button>
          </Box>
        </Box>
      </Paper>
    </>
  );
}

export default function EditorReglasAvanzado({ open, onClose, columnas, datos, onAplicar }) {
  const [regla, setRegla] = useState({
    tipo: "grupo",
    // Ahora, el operadorLogicoInterno del grupo raíz es lo que controla su lógica principal
    operadorLogicoInterno: "AND",
    condiciones: [
      {
        id: Math.random().toString(36).substring(2, 9), // ID para la condición inicial
        tipo: "condicion",
        operadorLogico: undefined,
        columna: "",
        operador: "==",
        valor: "",
        valorExtra: "",
      },
    ],
  });

  const [acciones, setAcciones] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");

  useEffect(() => {
    if (open) {
      setRegla({
        tipo: "grupo",
        operadorLogicoInterno: "AND", // Por defecto el grupo principal opera con AND
        condiciones: [
          {
            id: Math.random().toString(36).substring(2, 9), // ID para la condición inicial
            tipo: "condicion",
            operadorLogico: undefined,
            columna: "",
            operador: "==",
            valor: "",
            valorExtra: "",
          },
        ],
      });
      setAcciones([]);
      setSnackbarOpen(false);
    }
  }, [open]);

  const showSnackbar = (message, severity = "info") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const actualizarRegla = (nuevoGrupo) => {
    setRegla(nuevoGrupo);
  };

  const agregarAccion = () => {
    setAcciones((prev) => [...prev, { columna: "", tipo: "increase", valor: "" }]);
  };

  const eliminarAccion = (index) => {
    setAcciones((prev) => prev.filter((_, i) => i !== index));
  };

  const actualizarAccion = (index, key, value) => {
    setAcciones((prev) =>
      prev.map((accion, i) => (i === index ? { ...accion, [key]: value } : accion))
    );
  };

  const validarRegla = (grupo) => {
    if (!grupo.condiciones || grupo.condiciones.length === 0) {
      showSnackbar("La regla debe contener al menos una condición o grupo.", "error");
      return false;
    }
    for (let i = 0; i < grupo.condiciones.length; i++) {
      const c = grupo.condiciones[i];
      if (c.tipo === "grupo") {
        if (!validarRegla(c)) return false; // Recursivamente valida subgrupos
      } else if (c.tipo === "condicion") {
        if (!c.columna || c.valor === "" || (c.operador === "between" && c.valorExtra === "")) {
          showSnackbar("Todas las condiciones deben tener columna y valor definidos.", "error");
          return false;
        }
        if (c.operador === "regex") {
          try {
            new RegExp(c.valor); // Intenta crear la RegEx para validar
          } catch (e) {
            showSnackbar(`Expresión regular inválida en columna "${c.columna}": ${e.message}`, "error");
            return false;
          }
        }
      }
    }
    return true;
  };

  const aplicarRegla = () => {
    if (!validarRegla(regla)) {
      return; // La validación ya mostró el snackbar
    }
    if (acciones.length === 0 || acciones.some((a) => !a.columna || a.valor === "")) {
      showSnackbar("Debes definir al menos una acción válida con columna y valor.", "error");
      return;
    }

    // La estructura de la regla se pasa como está.
    // cumplirCondiciones ahora sabe que el operadorLogicoInterno del grupo raíz es lo que controla su lógica.
    const reglaCompleta = {
      condiciones: regla.condiciones,
      operadorLogicoInterno: regla.operadorLogicoInterno || "AND", // Se asegura que el operador principal esté definido
      acciones,
    };

    try {
        const nuevosDatos = aplicarReglasADatos(datos, reglaCompleta);

        if (!nuevosDatos) {
            showSnackbar("La función aplicarReglasADatos no devolvió resultados inesperadamente.", "error");
            return;
        }

        onAplicar(nuevosDatos);
        showSnackbar("Regla aplicada exitosamente.", "success");
        onClose(); // Cierra el diálogo después de aplicar
    } catch (error) {
        console.error("Error al aplicar la regla:", error);
        showSnackbar(`Ocurrió un error al aplicar la regla: ${error.message}`, "error");
    }
  };

  const reglaResumen = generarResumenRegla(regla);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          fontWeight: 600,
          fontSize: "1.35rem",
          borderBottom: "1px solid #e0e0e0",
          pb: 1,
        }}
      >
        Editor Avanzado de Reglas
      </DialogTitle>

      <DialogContent sx={{ bgcolor: "background.paper", py: 3, px: 4, maxWidth: 900, mx: "auto" }}>
        <Typography variant="subtitle1" mb={2} sx={{ fontSize: "0.9rem" }}>
          Definir Condiciones
        </Typography>

        {/* Agregamos el selector de lógica principal aquí, fuera del GrupoEditor para que sea el operador global */}
        <Grid container alignItems="center" spacing={1} mb={2}>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small" variant="outlined">
                    <InputLabel sx={{ fontSize: "0.9rem" }}>Lógica principal de la regla</InputLabel>
                    <Select
                        value={regla.operadorLogicoInterno || "AND"}
                        onChange={(e) => setRegla(prev => ({...prev, operadorLogicoInterno: e.target.value}))}
                        label="Lógica principal de la regla"
                        sx={{ fontSize: "0.9rem" }}
                    >
                        <MenuItem value="AND" sx={{ fontSize: "0.9rem" }}>TODAS deben cumplir (AND)</MenuItem>
                        <MenuItem value="OR" sx={{ fontSize: "0.9rem" }}>ALGUNA debe cumplir (OR)</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
        </Grid>


        {/* El grupo raíz (nivel 0) ya no muestra su propio selector de "Lógica interna del grupo"
            ya que la "Lógica principal de la regla" lo controla.
            Pasamos un 'nivel' de 0 al GrupoEditor inicial.
            El GrupoEditor ahora maneja el renderizado condicional de su propio selector de lógica interna.
        */}
        {/* Usamos el operadorLogicoInterno de la regla directamente para el grupo raíz */}
        <GrupoEditor
          grupo={{ ...regla, nivel: 0 }} // Pasar el grupo completo y el nivel explícito
          columnas={columnas}
          onChange={actualizarRegla}
          nivel={0} // Asegurar que el nivel sea 0 para el grupo raíz
          // No pasar onDelete aquí ya que el grupo raíz no se elimina con un botón
          onDelete={() => {}}
        />

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle1" mb={1} sx={{ fontSize: "0.9rem" }}>
          Resumen de la Regla:
        </Typography>
        <Typography variant="body2" sx={{ mb: 2, fontStyle: 'italic', bgcolor: '#e8f5e9', p: 1, borderRadius: 1 }}>
          **SI** {reglaResumen}
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <Typography variant="subtitle1" mb={1} sx={{ fontSize: "0.9rem" }}>
          Definir Acciones
        </Typography>

        {acciones.map((accion, i) => (
          <Grid container spacing={1} alignItems="center" mb={2} key={i} wrap="nowrap" sx={{ maxWidth: 900, width: "100%", mx: "auto" }}>
            <Grid item xs sx={{ minWidth: 180 }}>
              <FormControl fullWidth size="small" variant="outlined">
                <InputLabel sx={{ fontSize: "0.9rem" }}>Columna</InputLabel>
                <Select
                  value={accion.columna}
                  onChange={(e) => actualizarAccion(i, "columna", e.target.value)}
                  label="Columna"
                  sx={{ fontSize: "0.9rem" }}
                >
                  {columnas.map((col) => (
                    <MenuItem key={col} value={col} sx={{ fontSize: "0.9rem" }}>
                      {col}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs sx={{ minWidth: 140, maxWidth: 160 }}>
              <FormControl fullWidth size="small" variant="outlined">
                <InputLabel sx={{ fontSize: "0.9rem" }}>Tipo Acción</InputLabel>
                <Select
                  value={accion.tipo}
                  onChange={(e) => actualizarAccion(i, "tipo", e.target.value)}
                  label="Tipo Acción"
                  sx={{ fontSize: "0.9rem" }}
                >
                  {tiposAccion.map((ta) => (
                    <MenuItem key={ta.value} value={ta.value} sx={{ fontSize: "0.9rem" }}>
                      {ta.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs sx={{ minWidth: 130, maxWidth: 180 }}>
              <TextField
                label="Valor"
                size="small"
                type="number"
                value={accion.valor}
                onChange={(e) => actualizarAccion(i, "valor", e.target.value)}
                variant="outlined"
                fullWidth
                sx={{ "& .MuiInputBase-input": { fontSize: "0.9rem" }, "& .MuiInputLabel-root": { fontSize: "0.9rem" } }}
              />
            </Grid>

            <Grid item sx={{ minWidth: 48, flexShrink: 0, display: "flex", justifyContent: "center" }}>
              <IconButton color="error" onClick={() => eliminarAccion(i)} size="small" sx={{ p: 0.5 }}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Grid>
          </Grid>
        ))}

        <Button
          onClick={agregarAccion}
          variant="outlined"
          sx={{
            mt: 1,
            mb: 3,
            width: 240,
            fontWeight: "normal",
            textTransform: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            mx: "auto",
          }}
        >
          <AddIcon sx={{ fontSize: 18 }} />
          Añadir acción
        </Button>
      </DialogContent>

      <DialogActions sx={{ px: 4, py: 2 }}>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={aplicarRegla}>
          Aplicar regla
        </Button>
      </DialogActions>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Dialog>
  );
}