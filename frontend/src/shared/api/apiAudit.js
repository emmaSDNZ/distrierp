
import { apiMethods } from "./apiMethods";

const urlDistrimed = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api_distrimed_productos`;
const urlAudit = `${urlDistrimed}/audit`;
const apiAuditProductList = `${urlAudit}/product/list/`;

function responseCatchError(error) {
  return { success: false, data: null, error };
}

async function fetchAudtiListaGeneral(customUrl = null) {
  try {
    const endpoint = customUrl ?? apiAuditProductList; // Usa la URL que venga del backend
    const { success, data } = await apiMethods.getRequest(endpoint);
    console.log("audit_API LISTA", data);
    return { success, data };
  } catch (error) {
    console.error("PRODUCTO_API LISTA ERROR", error);
    return responseCatchError(error); // <= retornás correctamente el error capturado
  }
}

export const auditApi = {
  fetchAudtiListaGeneral,
};