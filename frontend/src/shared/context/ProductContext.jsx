import { createContext, useCallback, useState } from "react";
import { productApi } from "../api/productApi";
import {auditApi} from '../api/apiAudit'
import {apiProductoProducto} from '../api/apiProductoProductoLista'

function messageError() {
    throw new Error("Error al ejecutar la acción");
  }
const ApiProductContext = createContext({

  nextUrl: null,
  prevUrl: null,
  producto: [],
  apiProductoTemplateCreate: async () => {},
  productosLista: [],
  apiProductoTemplateDetalle: async ()=>{},
  productoEliminar: [],
  apiProductoTemplateEliminar: async()=>{},

  auditLista:[],
  apiAuditListaGeneral:async()=>{},
  productoActualizar: [],
  apiListarProductos_All: async()=>{},
  apiProductoProductoDetalleByID: async()=>{},
  apiProductoProductoByID: async()=>{},

  productoProveedor: [],
  productoProveedorLista:[],
  apiProductoProveedorCreate: async()=>{},
  apiProductoProveedorLista: async()=>{},
  apiProductoProveedorByID: async()=>{},
  apiProductoProveedorByNombreProveedor: async()=>{},

  schemeTemplate: [],
  apiProductoTemplateObtenerSchema: async () => {}
});
const ApiProductProvider = ({ children }) => {

  const [nextUrl, setNextUrl] = useState(null);
  const [prevUrl, setPrevUrl] = useState(null);
  const [producto, setProducto] =  useState([])
  const [productosLista, setProductosLista] = useState([]);
  const [productoDetalle, setProductoDetalle] = useState([])
  const [productoEliminar, setProductoEliminar] = useState([]);


const apiProductoTemplateCreate = useCallback(async (formData) => {
  const  response = await productApi.fetchProductoTemplateCrear(formData);
  const {success, data} = response;
  if (!success) {messageError();}
  return data
  }, []);

const apiProductoTemplateDetalle =  useCallback(async(id, formData)=>{
    const response = await productApi.fetchProductoTemplateDetalle(id, formData)
    const {success, data} = response;
    if (!success){
      messageError() 
    }
    setProductoDetalle(data)
    return data
  },[]) 

const apiProductoTemplateEliminar = useCallback(async (id) => {
    const { success, data } = await productApi.fetchProductoTemplateEliminar(id);
    if (success) {
      setProductoEliminar(data);
      setProductosLista((prevProducts) =>
        prevProducts.filter((product) => product.id !== id)
      );
      return { success, data };
    } else {
      messageError(); 
    }
}, []);

  const apiListarProductos_All = useCallback(async() =>{
    const {success, data} = await productApi.fetchProductosListGeneral()
    if (success){
      setProductosLista(data.results || []);
      setNextUrl(data.next || null);
      setPrevUrl(data.previous || null);
      return data
    }else{
      messageError()
      setProductosLista([]);
      setNextUrl(null);
      setPrevUrl(null);
    }
  }, [])
  const [auditLista, setAuditLista] = useState([]);

  const apiAuditListaGeneral = useCallback(async (customUrl = null) => {
    const { success, data } = await auditApi.fetchAudtiListaGeneral(customUrl);
    if (success) {
  
      setAuditLista(data.results || []);
      setNextUrl(data.next || null);
      setPrevUrl(data.previous || null);
      return data;
    } else {
      messageError();
      setAuditLista([]);
      setNextUrl(null);
      setPrevUrl(null);
    }
  }, []);

    const apiAuditListaGeneralSearch = useCallback(async (keySearch, keyValue) => {
    const { success, data } = await productApi.fetchProductosListGeneralSearch(keySearch, keyValue);
    if (success) {
  
      setProductosLista(data.results || []);
      setNextUrl(data.next || null);
      setPrevUrl(data.previous || null);
      return data;
    } else {
      messageError();
      setProductosLista([]);
      setNextUrl(null);
      setPrevUrl(null);
    }
  }, []);


    /*PRODUCTO PRODUCTOS LISTA - lista*/
  const apiProductoProductoDetalleByID = useCallback(async (id) => {
    const response = await apiProductoProducto.getProductoProductoListaByID(id);
    const {success, data} = response;
    if (success) {
      setProducto(data);
  
      return data;
    }else{
      messageError()
  }}, [])

  
    /*PRODUCTO PRODUCTOS LISTA - lista*/
  const apiProductoProductoByID = useCallback(async (id) => {
    const response = await apiProductoProducto.getProductoProductoByID(id);
    const {success, data} = response;
    if (success) {
      setProducto(data);
      

      return data;
    }else{
      messageError()
  }}, [])

  /* PRODUCTO PROVEEDOR */
  const apiProductoProveedorCreate = useCallback(async (formData) => {
  const  response = await productApi.fetchProductoProveedorCrear(formData);
  const {success, data} = response;

  if (!success) {
    messageError();
  }
  return data
}, []);


const [productoProveedorLista, setProductoProveedorLista] = useState([])
const [productoProveedor, setProductoProveedor] = useState([])

const apiProductoProveedorLista  = useCallback(async (keySearch, keyValue) => {
    const response = await productApi.fetchProductoProductoLista(keySearch, keyValue);
    const {success, data} =  response
    if (success) {
    
      setProductoProveedorLista(data.results || []);
      setNextUrl(data.next || null);
      setPrevUrl(data.previous || null);
      return data;
    } else {
      messageError();
      setProductosLista([]);
      setNextUrl(null);
      setPrevUrl(null);
    }
  }, []);

    const apiProductoProveedorByID = useCallback(async (id) => {
    const response = await productApi.fetchProductoProveedorByID(id);
    const {success, data} = response;
    if (!success) {
      messageError()
    }
    setProductoProveedorLista(data);
  
    return data;
   }, [])

   
const apiProductoProveedorByNombreProveedor = useCallback(async (nombre_proveedor) => {
  const response = await productApi.fetchProductoProveedorByNombreProveedor(nombre_proveedor);
  const { success, data } = response;
  if (!success) { messageError(); }
  setProductoProveedorLista(data);
  return { success, data };
}, []);

const [schemaFields, setSchemaFields] = useState(null); 

const apiProductoTemplateObtenerSchema = useCallback(async () => {
  const response = await productApi.fetchProductoTemplateObtenerSchema();
  const { success, data } = response;

  if (!success) {
    messageError();
  }
  setSchemaFields(data);
  return response
}, []);

  const value = {
    nextUrl,
    prevUrl,
    producto,
    productoDetalle,
    apiProductoTemplateCreate,
    productosLista,
    apiProductoTemplateDetalle,
    productoDetalle,
    apiListarProductos_All,
    productoEliminar,
    apiProductoTemplateEliminar, 
    apiAuditListaGeneral,
    auditLista,
    apiAuditListaGeneralSearch,
    apiProductoProductoDetalleByID,
    apiProductoProductoByID,
    apiProductoProveedorCreate,
    productoProveedorLista,
    apiProductoProveedorLista,

    productoProveedor,
    apiProductoProveedorByID,
    apiProductoProveedorByNombreProveedor,
    schemaFields,
    setSchemaFields,         
    apiProductoTemplateObtenerSchema,
  };

  return (
    <ApiProductContext.Provider value={value}>
      {children}
    </ApiProductContext.Provider>
  );
};

export { ApiProductContext, ApiProductProvider };
