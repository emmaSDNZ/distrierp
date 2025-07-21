import React, { useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
} from "@mui/material";

export default function ProductoInternalList({ productos, id_proveedor }) {
  useEffect(() => {
    console.log("productos producto internal list:", productos);
  }, [productos, id_proveedor]);

  if (!productos || productos.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: "center" }}>
        No hay productos para mostrar.
      </Typography>
    );
  }

  // Formateador de moneda ARS
  const formatter = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
  });

  // Convierte snake_case o _campos a algo más legible
  const toReadable = (key) => {
    return key
      .replace(/^_/, "")                         // elimina guión bajo inicial
      .replace(/_/g, " ")                        // reemplaza guiones bajos por espacios
      .replace(/\b\w/g, (c) => c.toUpperCase()); // mayúsculas en cada palabra
  };

  // Claves principales de cada producto (excluyendo precios_nuevos)
  const allKeys = Array.from(
    new Set(
      productos.flatMap((item) =>
        Object.keys(item).filter((key) => key !== "precios_nuevos")
      )
    )
  );

  // Claves internas de precios_nuevos
  const precioKeys = Array.from(
    new Set(
      productos.flatMap((item) =>
        item.precios_nuevos ? Object.keys(item.precios_nuevos) : []
      )
    )
  );

  return (
    <Box mt={2} mx="auto" sx={{ maxWidth: 960, width: "100%", px: 2 }}>
      <Typography
        variant="h6"
        sx={{
          mb: 1,
          color: "#555",
          letterSpacing: "0.03em",
          fontWeight: "normal",
          userSelect: "text",
        }}
      >
        Productos para el proveedor #{id_proveedor}
      </Typography>

      <TableContainer
        component={Paper}
        sx={{ maxHeight: 400, overflow: "auto", border: "1px solid #e0e0e0" }}
      >
        <Table stickyHeader size="small" sx={{ width: "100%" }}>
          <TableHead>
            <TableRow>
              {allKeys.map((key) => (
                <TableCell
                  key={key}
                  sx={{
                    padding: "4px 8px",
                    whiteSpace: "nowrap",
                    fontWeight: "normal",
                    fontSize: "0.85rem",
                    color: "#333",
                    letterSpacing: "0.03em",
                  }}
                >
                  {toReadable(key)}
                </TableCell>
              ))}
              {precioKeys.map((key) => (
                <TableCell
                  key={key}
                  sx={{
                    padding: "4px 8px",
                    whiteSpace: "nowrap",
                    fontWeight: "normal",
                    fontSize: "0.85rem",
                    color: "#333",
                    letterSpacing: "0.03em",
                  }}
                >
                  {toReadable(key)}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {productos.map((item, idx) => (
              <TableRow key={idx} hover>
                {allKeys.map((key) => (
                  <TableCell
                    key={key}
                    sx={{
                      padding: "4px 8px",
                      fontSize: "0.85rem",
                      whiteSpace: "nowrap",
                      color: "#777",
                      letterSpacing: "0.02em",
                      fontWeight: "normal",
                    }}
                  >
                    {String(item[key] ?? "")}
                  </TableCell>
                ))}
                {precioKeys.map((key) => (
                  <TableCell
                    key={key}
                    sx={{
                      padding: "4px 8px",
                      fontSize: "0.85rem",
                      whiteSpace: "nowrap",
                      color: "#777",
                      letterSpacing: "0.02em",
                      fontWeight: "normal",
                    }}
                  >
                    {typeof item.precios_nuevos?.[key] === "number"
                      ? formatter.format(item.precios_nuevos[key])
                      : item.precios_nuevos?.[key] ?? "-"}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
