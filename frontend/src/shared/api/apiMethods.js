
function getDefaultResponseError(error) {
  return {
      success: false,
      error: error.message
  }  
}

function getDefaultResponseSucces(data){
      return {
        success: true,
        data,
      };
}

function headerMethod(method, formData) {
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  const options = {
    method,
    headers,
  };
  if (method !== "DELETE") {
    options.body = JSON.stringify(formData);
  }
  return options;
}

function messageError(data, response) {
    throw new Error(data.message || `Error HTTP ${response.status}: ${response.statusText}`);
  }

async function responseRequest(endpoint, method, formData) {
  let response;
  if (method && formData) {
    response = await fetch(endpoint, headerMethod(method, formData));
  } else {
    response = await fetch(endpoint);
  }
  const data = await response.json();
  if (!response.ok) {
    messageError(data, response)
  }
  return getDefaultResponseSucces(data); 
}

async function postRequest(endpoint, formData = {}) {
  try {
    const response = await responseRequest(endpoint, 'POST', formData);
    console.log("🚀 postRequest response:", response); // 🔍 Añadido
    return response;
  } catch (error) {
    console.error("❌ postRequest error:", error); // 🔍 Añadido
    return getDefaultResponseError(error);
  }
}

async function detailRequest(endpoint, formData){
  try {
    return await responseRequest(endpoint, 'PUT', formData)
  } catch (error) {
    return getDefaultResponseError(error)
  }
}

async function getRequest(endpoint) {
try {
  return await responseRequest(endpoint)
} catch (error) {
  return getDefaultResponseError(error)
}
}

async function deleteRequest(endpoint) {
  try {
    const response = await fetch(endpoint, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });

    const data = await response.json();
    return data;

  } catch (error) {
    console.log("Error en fetch:", error.message);
    return {
      success: false,
      message: error.message || "Error en la petición"
    };
  }
}


// Exportar el método en un objeto reutilizable
export const apiMethods = {
  postRequest,
  detailRequest,
  getRequest,
  deleteRequest
}
