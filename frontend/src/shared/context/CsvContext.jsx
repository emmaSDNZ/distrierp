import { createContext, useCallback, useState } from "react";
import { postAnalizarCSV, postProcesarCSV } from "../api/apiCsv";

const ApiCsvContext = createContext({
  csvData: null,
  apiCsvAnalizar: async () => {},
  datosProcesados: null,
  apiProcesarCSV: async () => {},
});

const ApiCsvProvider = ({ children }) => {
  const [csvData, setCsvData] = useState(null);

  const apiCsvAnalizar = useCallback(async (file) => {
    const response = await postAnalizarCSV(file);
    if (response.success) {
      setCsvData(response.data); // solo si es exitoso
    }
    return response; // igual devolvemos el mensaje para el frontend
  }, []);

  const [datosProcesados, setDatosProcesados] = useState(null);

const apiProcesarCSV = useCallback(async (file, df, id_proveedor) => {
  const response = await postProcesarCSV(file, df, id_proveedor);
  console.log("Respuesta de procesar CSV:", response);
  if (response.success) {
    setDatosProcesados(response.data);
  }
  return response;
}, []);
  const value = {
    setCsvData,
    csvData,
    apiCsvAnalizar,
    datosProcesados,
    apiProcesarCSV,
    setDatosProcesados,
  };

  return (
    <ApiCsvContext.Provider value={value}>
      {children}
    </ApiCsvContext.Provider>
  );
};

export { ApiCsvContext, ApiCsvProvider };
