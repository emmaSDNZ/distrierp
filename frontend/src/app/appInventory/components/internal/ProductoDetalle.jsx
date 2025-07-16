
import { Paper, Box, Typography } from "@mui/material";
function ProductoDetalle({ producto, onCerrar }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  if (!producto) return null;

  const {
    id_producto_template,
    nombre_base_producto,
    principio_activo,
    create_date,
    producto_productos = [],
    ...otrosCampos // por si después llegan más campos
  } = producto;

  const formatCurrency = (value) => {
    if (value == null) return "-";
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(value);
  };

  return (
    <Dialog
      open={Boolean(producto)}
      onClose={onCerrar}
      fullScreen={fullScreen}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { maxHeight: "80vh", overflowY: "auto", p: 2 } }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        Detalle completo del producto
        <IconButton onClick={onCerrar} size="large" aria-label="Cerrar">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Box mb={3}>
          <Typography variant="h6" gutterBottom>
            {nombre_base_producto}
          </Typography>

          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            <div>
              <Typography variant="body2" fontWeight="bold">
                ID Producto Template:
              </Typography>
              <Typography>{id_producto_template}</Typography>
            </div>
            <div>
              <Typography variant="body2" fontWeight="bold">
                Principio Activo:
              </Typography>
              <Typography>{principio_activo ?? "-"}</Typography>
            </div>
            <div>
              <Typography variant="body2" fontWeight="bold">
                Fecha de Creación:
              </Typography>
              <Typography>{new Date(create_date).toLocaleString()}</Typography>
            </div>
            {/* Si llegan más campos generales los podés agregar acá usando otrosCampos */}
          </Box>
        </Box>

        <Typography variant="subtitle1" gutterBottom>
          Productos relacionados:
        </Typography>

        {producto_productos.length === 0 ? (
          <Typography color="text.secondary">No hay productos relacionados.</Typography>
        ) : (
          <Table size="small" aria-label="productos relacionados">
            <TableHead>
              <TableRow>
                <TableCell>Código</TableCell>
                <TableCell>Presentación</TableCell>
                <TableCell>Unidad</TableCell>
                <TableCell>Cód. Barras</TableCell>
                <TableCell>Precio Unitario</TableCell>
                <TableCell>Con IVA</TableCell>
                <TableCell>Sugerido</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {producto_productos.map((prod) => (
                <TableRow key={prod.id_producto_producto}>
                  <TableCell>{prod.codigo_producto || "-"}</TableCell>
                  <TableCell>{prod.presentacion || "-"}</TableCell>
                  <TableCell>{prod.unidad_medida || "-"}</TableCell>
                  <TableCell>{prod.codigo_barras || "-"}</TableCell>
                  <TableCell>
                    {formatCurrency(prod.precio_compra_actual?._precio_compra_unitario)}
                  </TableCell>
                  <TableCell>
                    {formatCurrency(prod.precio_compra_actual?._precio_compra_con_iva)}
                  </TableCell>
                  <TableCell>
                    {formatCurrency(prod.precio_compra_actual?._precio_compra_sugerido)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DialogContent>
    </Dialog>
  );
}
