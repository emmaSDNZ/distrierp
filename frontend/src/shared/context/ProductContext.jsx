import { createContext, useCallback, useState } from "react";
import { productApi } from "../api/productApi";

const ApiProductContext = createContext({
  productsList: [],
  apiProductList: async()=>{},
  productDetail: [],
  apiProductDetail: async()=>{},
  apiAddProduct: async()=>{},
  productUpdate: [],
  apiProductUpdate: async()=>{},
  productDelete: [],
  apiProductDelete: async()=>{},

});

const ApiProductProvider = ({ children }) => {

  const [productsList, setProductsList] = useState([]);
  const [productDetail, setProductDetail] = useState([]);
  const [productUpdate, setProductUpdate] = useState([]);
  const [productDelete, setProductDelete] = useState([]);

  const apiProductList = useCallback(async () => {
    try {
      const dataProductList = await productApi.fetchProductsList();
      setProductsList(dataProductList.data);
      return dataProductList.data;
    } catch (error) {
      console.error("Error al obtener productos:", error);
      setProductsList([]);
    }
  }, []);

  const apiProductDetail = useCallback(async (id)=>{
    try {
      const dataProductDetail = await productApi.fetchProductId(id)
      setProductDetail(dataProductDetail)
      return dataProductDetail;
    } catch (error) {
      console.error("Error al obtener el producto:", error);
      setProductDetail([]);
    }
  },[])

  const apiAddProduct = useCallback(async (newProduct)=>{
    try {
      const addNewProduct = await productApi.fetchAddProduct(newProduct)
      setProductsList(prevProducts => [...prevProducts, addNewProduct ])
      return addNewProduct
    } catch (error) {
      console.error("Error al crear el producto:", error);
    }
  }, [])

  const apiProductUpdate = useCallback(async (id, product) => {
    try {
      const dataProductUpdate = await productApi.fetchProductUpdate(id, product);
      setProductUpdate(dataProductUpdate);
      console.log("context", dataProductUpdate)
      return dataProductUpdate;
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
    }
  }, []);  

  const apiProductDelete = useCallback(async (id) => {
    try {
      const dataProductDelete = await productApi.fetchProductDelete(id);
      setProductDelete(dataProductDelete);
      setProductsList((prevProducts) => prevProducts.filter((product) => product.id !== id));
      console.log("Producto eliminado:", dataProductDelete);
      return dataProductDelete;
    }  catch (error) {
      console.error("Error al eliminar el producto:", error);
      setProductDelete("Error al eliminar el producto");
      return "Error al eliminar el producto";
    }
  }, []);

  const value = {
    productsList,
    apiProductList,
    productDetail,
    apiProductDetail,
    apiAddProduct,
    productUpdate,
    apiProductUpdate,
    productDelete,
    apiProductDelete,
  };

  return (
    <ApiProductContext.Provider value={value}>
      {children}
    </ApiProductContext.Provider>
  );

};

export { ApiProductContext, ApiProductProvider };
