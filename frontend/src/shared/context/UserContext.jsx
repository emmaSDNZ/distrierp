import { createContext, useCallback, useState } from "react";
import { usersApi } from "../api/usersApi";


const ApiUserContext = createContext({
    usersList: [],
    usersSearchList: [],
    usersListAll: [],
    supplierProduct: [],
    apiUsersSearchList: async()=>{},
    apiAddUser: async()=>{},
    apiUsersList: async()=>{},
    apiAddSupplierProduct: async() =>{},
});

const ApiUserProvider = ({ children }) => {
    const [usersSearchList, setUsersSearchList] = useState([]);
    const [usersList, setUsersList] = useState([]);
    const [usersListAll, setUsersListAll] = useState([])
    const [supplierProduct, setSupplierProduct] = useState([])

    const apiUsersSearchList = useCallback(async (search) => {
        try {
            const dataUsersSearchList = await usersApi.fetchUsersList(search);
            setUsersSearchList(dataUsersSearchList.data);
            return dataUsersSearchList;
        } catch (error) {
            console.error("Error al obtener usuarios:", error);
            setUsersSearchList([]);
        }

    },[])

    const apiUsersList = useCallback(async () =>{
      try {
        const dataUsersListAll = await usersApi.fetchUsersListAll()
        setUsersListAll(dataUsersListAll.data)
        return dataUsersListAll
      
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
        setUsersListAll([])
      }
    },[])

    const apiAddUser = useCallback(async (newUser) => {
      try {
        const addNewUser = await usersApi.fetchAddUser(newUser) 
        setUsersList(prevUsers => [...prevUsers, addNewUser ])
        console.log(addNewUser)
        return addNewUser
      } catch (error) {
        console.error("Error al crear el proveedor:", error); 
      }
  },[])

    const apiAddSupplierProduct = useCallback(async(newSupplierProduct)=>{
      try {
        const addNewSupplierProduct = await usersApi.fetchAddSupplierProduct(newSupplierProduct)
        setSupplierProduct(prevSupplierPoduct => [... prevSupplierPoduct, addNewSupplierProduct])
        return addNewSupplierProduct
      } catch (error) {
        console.log("Error al relacionar el producto con el proveedor-", error)
      }
    })



const value = {
    usersList,
    usersSearchList,
    usersListAll,
    supplierProduct,
    apiUsersSearchList,
    apiAddUser,
    apiUsersList,
    apiAddSupplierProduct
}

return (
    <ApiUserContext.Provider value={value}>
      {children}
    </ApiUserContext.Provider>
  );
}

export { ApiUserContext, ApiUserProvider };