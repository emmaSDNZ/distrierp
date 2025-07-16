import showToast from "./ToastShow";

function showToastMessageSuccessError(success, message) {
  const messageErrorDefault = "No se pudo completar la acción";
  const messageSuccessDefault = "Se completó la acción";

  if (success) {
    return showToast.showSuccessToast(message || messageSuccessDefault);
  } else {
    return showToast.showErrorToast(message || messageErrorDefault)
  }
}

async function deleteClick(apiDelete, id, route, url) {
  if (!id) {
    console.warn("ID no válido para eliminar:", id);
    return;
  }
  
  console.log("Llamando a apiDelete con ID:", id);
  const response = await apiDelete(id);  // Aquí recibes { success, message }
  console.log("Respuesta de apiDelete:", response);

  // Usamos la respuesta directamente para mostrar el toast con el mensaje correcto
  showToastMessageSuccessError(response);

  // Solo redirigimos si fue exitoso
  if (response.success) {
    route.push(url);
  }
}
export function createHandleChange(setEstate) {
  return function(e) {
    const { name, value } = e.target;
    setEstate(prev => ({
      ...prev,
      [name]: value
    }));
  }
}

const UtilsFunctions = {
    showToastMessageSuccessError,
    deleteClick,
    createHandleChange
}
export default  UtilsFunctions