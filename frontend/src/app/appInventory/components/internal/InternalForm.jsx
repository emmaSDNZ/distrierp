"use client";
import React, { useState, useEffect, useContext } from "react";
import InternalCardSearch from "./InternalCardSearch";
import EntityButton from "@/shared/components/entityGeneral/EntityButton";
import UtilsFunctions from "@/shared/utils/utilsFunctions";
import ProductoInternalList from "./ProductoInternalList";
import AgregarProductos from "./AgregarProductos";
import { ApiCsvContext } from "@/shared/context/CsvContext";
import { EditableTableModal } from "@/shared/ui/Internal/EditableTableModal";
import { MuiModal } from "@/shared/ui/Internal/MuiModal";
import {
  Typography,
  Box,
} from "@mui/material";



// Componente principal
export default function InternalForm({ columnas: columnasProp, file, df: dfProp }) {
  const { datosProcesados, apiProcesarCSV } = useContext(ApiCsvContext);

  const [productosCreados, setProductosCreados] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  const [id_proveedor, setIdProveedor] = useState(null);
  const [procesado, setProcesado] = useState(false);
  const [resumenProcesado, setResumenProcesado] = useState(null);

  const [columnas, setColumnas] = useState(columnasProp || []);
  const [df, setDf] = useState(dfProp || []);
  const [isMobile, setIsMobile] = useState(false);
  const [modalVisible, setModalVisible] = useState(null);

  // Estado nuevo para modal editable
  const [modalEditableOpen, setModalEditableOpen] = useState(false);

  const df_procesados = datosProcesados?.resultado?.df_procesado || {};
  const dfCoincidentes = df_procesados.df_coincidente || [];
  const dfNoCoincidentes = df_procesados.df_no_coincidente || [];
  const dfActualizados = df_procesados.actualizados || [];

  const mostrarAgregar = dfNoCoincidentes.length > 0;

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    setColumnas(columnasProp || []);
    setDf(dfProp || []);
  }, [columnasProp, dfProp]);

  const onSelectProveedor = (item) => {
    if (item?.id_proveedor && !procesado) {
      setIdProveedor(item.id_proveedor);
    }
  };

  const handleProcesar = async (file, df, id_proveedor) => {
    const response = await apiProcesarCSV(file, df, id_proveedor);
    console.log("handleProcesar response: ", response)
    const data = response?.data || {};
    UtilsFunctions.showToastMessageSuccessError(data.success, data.message);

    const df_procesados = data?.resultado?.df_procesado || {};
    const productosCoincidentes = df_procesados.df_coincidente || [];

    if (productosCoincidentes.length > 0) {
      setDf(productosCoincidentes);
      setColumnas(Object.keys(productosCoincidentes[0] || {}));
    }

    setResumenProcesado({
      mensaje: data?.message || "",
      fileName: data?.file_name || "",
      idProveedor: data?.id_proveedor || null,
      totalCoincidentes: productosCoincidentes.length,
      totalNoCoincidentes: df_procesados?.df_no_coincidente?.length || 0,
      totalActualizados: df_procesados?.actualizados?.length || 0,
      proveedorData: data?.resultado?.proveedor?.data?.slice(0, 3) || [],
      sistemaData: data?.resultado?.sistema?.data?.slice(0, 3) || [],
      tamañoProveedor: data?.resultado?.proveedor?.tamaño || [],
      tamañoSistema: data?.resultado?.sistema.tamaño || [],
    });

    setProcesado(true);
  };

  const handleProductosAgregados = () => {
    // No reset necesario aquí
  };

  const handleProductoCreado = (productoNuevo) => {
    setProductosCreados((prev) => [...prev, productoNuevo]);
  };

  const cerrarDetalleProducto = () => setProductoSeleccionado(null);

  const botonDeshabilitado =
    procesado || !(file && Array.isArray(df) && df.length > 0 && id_proveedor);

  const abrirModal = (tipo) => setModalVisible(tipo);
  const cerrarModal = () => setModalVisible(null);

  // Función para guardar cambios desde modal editable
  const handleGuardarCambios = (nuevaData) => {
    setDf(nuevaData);
  };

  return (
    <div
      className={`max-w-4xl w-full mx-auto mt-6 ${
        isMobile ? "px-4" : "px-8"
      } pb-10`}
    >
      {/* Header */}
      <div
        className={`flex ${
          isMobile
            ? "flex-col space-y-4"
            : "flex-row items-center justify-between space-x-4"
        }`}
      >
        <Typography variant="h6" component="h2" sx={{ fontWeight: "600" }}>
          Columnas del archivo
        </Typography>
        <div className={isMobile ? "w-full" : ""}>
          <InternalCardSearch onSelect={onSelectProveedor} disabled={procesado} />
        </div>
        <EntityButton
          title="Procesar"
          disabled={botonDeshabilitado}
          onClick={() => handleProcesar(file, df, id_proveedor)}
          className={`${isMobile ? "w-full mt-2" : ""}`}
        />
      </div>


{/* INFORMACIÓN DEL ARCHIVO Y COLUMNAS DETECTADAS */}
{file && (
  <Box
    sx={{
      backgroundColor: '#fff',
      borderRadius: 2,
      border: '1px solid #ccc',
      mt: 6,
      p: { xs: 3, sm: 4 },
      fontFamily: "'Roboto', 'Arial', sans-serif",
      userSelect: 'text',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    }}
  >
    <Typography
      variant="h6"
      sx={{
        fontWeight: 700,
        color: '#111',
        mb: 1,
        letterSpacing: '0.04em',
      }}
    >
      Archivo cargado
    </Typography>

    <Typography
      variant="body1"
      sx={{
        color: '#333',
        mb: 2,
      }}
    >
      <strong>Nombre:</strong> {file.name}
    </Typography>

    {Array.isArray(df) && df.length > 0 && (
      <Typography
        variant="body2"
        sx={{
          color: '#555',
          mb: 3,
          fontStyle: 'italic',
        }}
      >
        Dataset con <strong>{df.length}</strong> filas y <strong>{columnas.length}</strong> columnas
      </Typography>
    )}

    {columnas.length > 0 && (
      <>
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 600,
            color: '#444',
            mb: 1,
            letterSpacing: '0.02em',
            textTransform: 'none',
            fontSize: 14,
          }}
        >
          Columnas detectadas
        </Typography>

        <Box
          component="ul"
          sx={{
            listStyle: 'disc',
            paddingLeft: 3,
            margin: 0,
            color: '#555',
            fontSize: 13,
            lineHeight: 1.6,
            userSelect: 'text',
          }}
        >
          {columnas.map((col, i) => (
            <li key={i} title={col} style={{ marginBottom: 6 }}>
              {col}
            </li>
          ))}
        </Box>

        <Typography
        
          variant="caption"
          sx={{
            color: '#777',
            mt: 3,
            fontStyle: 'italic',
          }}
        >
          Verifique que las columnas coincidan con la estructura esperada antes de continuar.
        </Typography>
      </>
    )}
  </Box>
)}

      {/* RESUMEN PROCESADO */}
      {resumenProcesado && (
        <div className="bg-white rounded-lg shadow-md p-6 mt-6 border border-gray-200 space-y-4">
          <div className="flex items-center justify-between">
            <Typography
              variant="h6"
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              {resumenProcesado.mensaje}
            </Typography>
            <Typography variant="body2" color="text.secondary" fontStyle="italic">
              📁 {resumenProcesado.fileName}
            </Typography>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
              <Typography variant="caption" color="text.secondary">
                ID Proveedor
              </Typography>
              <Typography variant="h6" color="text.primary">
                {resumenProcesado.idProveedor}
              </Typography>
            </div>
            <button
              onClick={() => abrirModal("coincidentes")}
              className="bg-gray-50 rounded-lg p-4 border border-gray-100 cursor-pointer hover:shadow-md transition"
              type="button"
            >
              <Typography variant="caption" color="text.main">
                Cantidad Coincidentes
              </Typography>
              <Typography variant="h6" color="success.main">
                {resumenProcesado.totalCoincidentes}
              </Typography>
            </button>
            <button
              onClick={() => abrirModal("noCoincidentes")}
              className="bg-gray-50 rounded-lg p-4 border border-gray-100 cursor-pointer hover:shadow-md transition"
              type="button"
            >
              <Typography variant="caption" color="text.main">
                Cantidad No Coincidentes
              </Typography>
              <Typography variant="h6" color="warning.main">
                {resumenProcesado.totalNoCoincidentes}
              </Typography>
            </button>
            <button
              onClick={() => abrirModal("actualizados")}
              className="bg-gray-50 rounded-lg p-4 border border-gray-100 cursor-pointer hover:shadow-md transition"
              type="button"
            >
              <Typography variant="caption" color="text.main">
                Cantidad Actualizados
              </Typography>
              <Typography variant="h6" color="info.main">
                {resumenProcesado.totalActualizados}
              </Typography>
            </button>
          </div>

          <div className="mt-4">
            <Typography variant="subtitle1" fontWeight="600" gutterBottom>
              🧮 Tamaño de los datasets:
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Proveedor: {resumenProcesado.tamañoProveedor.join(" filas x ")} columnas
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sistema: {resumenProcesado.tamañoSistema.join(" filas x ")} columnas
            </Typography>
          </div>
        </div>
      )}

      {/* MODALES para productos */}
      <MuiModal
        open={modalVisible === "coincidentes"}
        onClose={cerrarModal}
        title={`Productos Coincidentes (${dfCoincidentes.length})`}
      >
        <ProductoInternalList productos={dfCoincidentes} id_proveedor={id_proveedor} />
      </MuiModal>

      <MuiModal
        open={modalVisible === "noCoincidentes"}
        onClose={cerrarModal}
        title={`Productos No Coincidentes (${dfNoCoincidentes.length})`}
      >
        <Typography variant="h6" color="warning.main" mb={3}>
          🟡 Hay productos que no están en el sistema.
        </Typography>

        <AgregarProductos
          dfNoCoincidentes={dfNoCoincidentes}
          id_proveedor={id_proveedor}
          onProductosAgregadosCompletamente={handleProductosAgregados}
          onProductoCreado={handleProductoCreado}
        />

        {mostrarAgregar && (
          <div className="mt-6">
            <ProductoInternalList productos={dfNoCoincidentes} id_proveedor={id_proveedor} />
          </div>
        )}
      </MuiModal>

      <MuiModal
        open={modalVisible === "actualizados"}
        onClose={cerrarModal}
        title={`Productos Actualizados (${dfActualizados.length})`}
      >
        <ProductoInternalList productos={dfActualizados} id_proveedor={id_proveedor} />
      </MuiModal>

      {/* Mostrar productos recién agregados */}
      {productosCreados.length > 0 && (
        <Box
          mt={6}
          p={3}
          border="1px solid"
          borderColor="success.light"
          borderRadius={2}
          bgcolor="green.50"
        >
          <Typography variant="h6" gutterBottom color="success.main">
            ✅ Productos agregados recientemente
          </Typography>

          <Box mt={2}>
            {productosCreados.map((prod, index) => {
              const producto = prod.producto_productos?.[0] || {};
              const precio = producto.precio_compra_actual || {};

              const formatCurrency = (val) =>
                new Intl.NumberFormat("es-AR", {
                  style: "currency",
                  currency: "ARS",
                }).format(val || 0);

              return (
                <Box
                  key={prod.id_producto_template || index}
                  py={2}
                  px={2}
                  borderBottom="1px solid"
                  borderColor="grey.300"
                  display="flex"
                  flexDirection={{ xs: "column", sm: "row" }}
                  justifyContent="space-between"
                  alignItems={{ sm: "center" }}
                  gap={1}
                >
                  <Box flex={2}>
                    <Typography variant="subtitle1" fontWeight="500">
                      {prod.nombre_base_producto}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Código: <strong>{producto.codigo_producto || "N/A"}</strong>
                    </Typography>
                  </Box>

                  <Box flex={2}>
                    <Typography variant="body2">
                      💰 Unitario: {formatCurrency(precio._precio_compra_unitario)}
                    </Typography>
                    <Typography variant="body2">
                      🧾 Con IVA: {formatCurrency(precio._precio_compra_con_iva)}
                    </Typography>
                    <Typography variant="body2">
                      💡 Sugerido: {formatCurrency(precio._precio_compra_sugerido)}
                    </Typography>
                  </Box>

                  <Box flexShrink={0}>
                    <EntityButton
                      title="Ver detalle"
                      variant="outlined"
                      size="small"
                      onClick={() => setProductoSeleccionado(prod)}
                    />
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>
      )}

      {/* Mostrar detalle del producto seleccionado */}
      {productoSeleccionado && (
        <ProductoDetalle producto={productoSeleccionado} onCerrar={cerrarDetalleProducto} />
      )}

      {/* Columnas detectadas */}
      {columnas.length === 0 && (
        <Typography
          variant="body2"
          color="text.secondary"
          textAlign="center"
          mt={6}
          fontStyle="italic"
        >
          No se detectaron columnas en el archivo.
        </Typography>
      )}

      {/* Modal editable */}
      <EditableTableModal
        open={modalEditableOpen}
        onClose={() => setModalEditableOpen(false)}
        columnas={columnas}
        data={df}
        onSave={handleGuardarCambios}
      />
    </div>
  );
}
