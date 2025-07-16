import { apiMethods } from "../api/apiMethods";

function responseCatchError(error) {
  return { success: false, data: null, message: error.message || "Error desconocido" };
}

function handleApiResponse(response) {
  if (!response.success) {
    return { success: false, message: response.message || "No se denegó la acción" };
  }
  return response;
}

async function postDataToEnpoint(endpoint, formData) {
  try {
    const response = await apiMethods.postRequest(endpoint, formData);
    return handleApiResponse(response);
  } catch (error) {
    console.error("PRODUCTO_API POST ERROR:", error);
    return responseCatchError(error);
  }
}

async function getToEnpoint(endpoint) {
  try {
    const response = await apiMethods.getRequest(endpoint);
    return handleApiResponse(response);
  } catch (error) {
    console.error("PRODUCTO_API GET ERROR:", error);
    return responseCatchError(error);
  }
}

async function detailToEnpoint(endpoint, formData) {
  try {
    const response = await apiMethods.detailRequest(endpoint, formData);
    return handleApiResponse(response);
  } catch (error) {
    console.error("PRODUCTO_API DETAIL ERROR:", error);
    return responseCatchError(error);
  }
}

export const fetchHelpers = {
  postDataToEnpoint,
  getToEnpoint,
  detailToEnpoint,
};
