const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;

if (!baseURL) {
  throw new Error("La variable de entorno NEXT_PUBLIC_BACKEND_URL no está definida.");
}

// Endpoints
const apiCsvAnalizar = `${baseURL}/api_distrimed_productos/csv/analizar/`;
const apiCsvProcesar = `${baseURL}/api_distrimed_productos/csv/procesar/`; // <-- URL corregida y centralizada

// Función genérica para enviar FormData a un endpoint
async function postFormData(endpoint, formData, nombreFn = "") {
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      body: formData,
    });

    const json = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: json?.message || "Error desconocido",
      };
    }

    return {
      success: true,
      data: json,
      message: json.message || "Éxito",
    };
  } catch (error) {
    console.error(`Error en ${nombreFn}:`, error);
    return {
      success: false,
      message: "Error de red o del servidor",
    };
  }
}

// 🔹 POST para analizar CSV
export async function postAnalizarCSV(file) {
  const formData = new FormData();
  formData.append("file", file);
  return await postFormData(apiCsvAnalizar, formData, "postAnalizarCSV");
}

// 🔹 POST para procesar CSV
export async function postProcesarCSV(file, df, id_proveedor) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("df", JSON.stringify(df));
  formData.append("id_proveedor", id_proveedor);
  return await postFormData(apiCsvProcesar, formData, "postProcesarCSV");
}
