import { fetchHelpers } from "../helpers/fetchHelpers";
const { postDataToEnpoint, getToEnpoint } = fetchHelpers;

// Endpoints
const urlDistrimed = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api_distrimed_productos`;
const urlProducto = `${urlDistrimed}/producto`;

// Endpoints Producto Template
const apiProductoTemplate = `${urlProducto}/producto-template`;
const apiProductoTemplateCreate = `${apiProductoTemplate}/create/`;

async function fetchProductoTemplateObtenerSchema(){
  const endpoint = `${apiProductoTemplate}/schema/`
  return await getToEnpoint(endpoint)
}
// Endpoints Producto Producto Lista
const apiProductoProductoLista = `${urlProducto}/producto-producto-lista`;
const apiProductoProductoListaList = `${apiProductoProductoLista}/list/`;



// Función para crear producto template (solo recibe formData)
async function fetchProductoTemplateCrear(formData) {
  return await postDataToEnpoint(apiProductoTemplateCreate, formData);
}

//Enpoints Prodcuto Proveedor
const apiProductoProveedor = `${urlProducto}/producto-proveedor`

async function fetchProductoProveedorCrear(formData){
  const endpoint = `${apiProductoProveedor}/create/`
  return await postDataToEnpoint(endpoint, formData)
}
async function fetchProductoProductoLista(){
  const endpoint = `${apiProductoProveedor}/list/`
  return await getToEnpoint(endpoint)
}

async function fetchProductoProveedorByID(id){
  const endpoint = `${apiProductoProveedor}/list/?id_producto_producto=${id}`
  return await getToEnpoint(endpoint)
}

async function fetchProductoProveedorByNombreProveedor(nombre_proveedor){
  const endpoint = `${apiProductoProveedor}/list/?nombre_proveedor=${nombre_proveedor}`
  return await getToEnpoint(endpoint)
}



function responseCatchError(error){
  return { success: false, data: null, error }
}

async function fetchProductoTemplateID (id){
  try {
    const endpointProductoTemplateID = `${apiProductoTemplate}/${id}/`;
    const { success, data } = await apiMethods.getRequest(endpointProductoTemplateID);
    console.log("PRODUCTO_API ID: fetchProductoTemplateUpdate", success, data);
    return { success, data };
  } catch (error) {
    console.error("PRODUCTO_API ID ERROR: fetchProductoTemplateUpdate", error);
    responseCatchError(error)
  }

} 

// Función para detalle producto template
const fetchProductoTemplateDetalle = async (id, formData) => {
  try {
    const endpointProductoTemplateUpdate = `${apiProductoTemplate}/${id}`;
    const { success, data } = await apiMethods.detailRequest(endpointProductoTemplateUpdate, formData);
    console.log("PRODUCTO_API UPDATE: fetchProductoTemplateUpdate", success, data);
    return { success, data };
  } catch (error) {
    console.error("PRODUCTO_API UPDATE ERROR: fetchProductoTemplateUpdate", error);
    responseCatchError(error)
  }
}; 

// Función para obtener la lista general de productos
const fetchProductosListGeneral = async (customUrl = null) => {
  try {
    const endpoint = customUrl ?? apiProductoProductoListaList; // Usa la URL que venga del backend
    const { success, data } = await apiMethods.getRequest(endpoint);
    console.log("audit_API LISTA", data);
    return { success, data };
  } catch (error) {
    console.error("PRODUCTO_API LISTA ERROR", error);
    return responseCatchError(error); // <= retornás correctamente el error capturado
  }

};

// Función para obtener la lista general de productos
const fetchProductosListGeneralSearch = async (keySearch,valueSearch ) => {
  try {
    const endpoint =  `${apiProductoProductoListaList}?${keySearch}=${valueSearch}`; 
    const { success, data } = await apiMethods.getRequest(endpoint);
    console.log("audit_API LISTA", data);
    return { success, data };
  } catch (error) {
    console.error("PRODUCTO_API LISTA ERROR", error);
    return responseCatchError(error); // <= retornás correctamente el error capturado
  }

};


const fetchProductoTemplateEliminar = async(id)=>{
  try {
    const endpointProductoTemplateUpdate = `${apiProductoTemplate}/${id}`;
    const { success, data } = await apiMethods.deleteRequest(endpointProductoTemplateUpdate);
    console.log("PRODUCTO_API DELETE: fetchProductoTemplateUpdate", success, data);
    return { success, data };
  } catch (error) {
    console.error("PRODUCTO_API DELETE ERROR: fetchProductoTemplateUpdate", error);
    responseCatchError(error)
  }
};


import { apiMethods } from "./apiMethods";



export const productApi = {
    fetchProductoTemplateCrear,
    fetchProductoTemplateID,
    fetchProductoTemplateDetalle,
    fetchProductosListGeneral,
    fetchProductoTemplateEliminar,
    fetchProductosListGeneralSearch,
    fetchProductoProveedorCrear,
    fetchProductoProductoLista,
    fetchProductoProveedorByID,
    fetchProductoProveedorByNombreProveedor,
    fetchProductoTemplateObtenerSchema 
    
}


