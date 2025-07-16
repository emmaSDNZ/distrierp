import { createContext, useCallback, useState } from "react";
import { usersApi } from "../api/usersApi";

const ApiUserContext = createContext({
    usersList: [],
    usersSearchList: [],
    usersListAll: [],
    supplierProduct: [],
    providersProductsDetail: [],
    apiProvidersProductsDetail: async () => {},
    apiUsersSearchList: async () => {},
    apiAddUser: async () => {},
    apiUsersList: async () => {},
    apiAddProviderProduct: async () => {}, // Corregido aquí



    usuariosLista: [],
    apiUsuariosLista: async () => {},
    apiUsuarioAgregar: async () => {},

    usuarioProveedorLista: [],
    apiUsuariosProveedoresLista: async () => {},
    apiUsuariProveedorAgregar: async () => {},
    apiUsuariosProveedoresListaSearch: async()=>{},
});

const ApiUserProvider = ({ children }) => {
    const [usersSearchList, setUsersSearchList] = useState([]);
    const [usersList, setUsersList] = useState([]);
    const [usersListAll, setUsersListAll] = useState([]);
    const [supplierProduct, setSupplierProduct] = useState([]);
    const [providersProductsDetail, setProvidersProductsDetail] = useState([]);

    


    const apiUsersSearchList = useCallback(async (search) => {
        try {
            const dataUsersSearchList = await usersApi.fetchSearchUsersName(search);
            setUsersSearchList(dataUsersSearchList.data);
            return dataUsersSearchList;
        } catch (error) {
            console.error("Error al obtener usuarios:", error);
            setUsersSearchList([]);
            return null; // Añadido
        }
    }, []);

    const apiUsersList = useCallback(async () => {
        try {
            const dataUsersListAll = await usersApi.fetchUsersListAll();
            setUsersListAll(dataUsersListAll.data);
            return dataUsersListAll;
        } catch (error) {
            console.error("Error al obtener usuarios:", error);
            setUsersListAll([]);
            return null; // Añadido
        }
    }, []);

    const apiAddUser = useCallback(async (newUser) => {
        try {
            const addNewUser = await usersApi.fetchAddUser(newUser);
            setUsersList((prevUsers) => [...prevUsers, addNewUser]);
            return addNewUser;
        } catch (error) {
            console.error("Error al crear el proveedor:", error);
            return null; // Añadido
        }
    }, []);

    const apiAddProviderProduct = useCallback(async (newSupplierProduct) => {
        try {
            const addNewSupplierProduct = await usersApi.fetchAddProviderProduct(newSupplierProduct);
            setSupplierProduct((prevSupplierProduct) => [...prevSupplierProduct, addNewSupplierProduct]);
            return addNewSupplierProduct;
        } catch (error) {
            console.error("Error al relacionar el producto con el proveedor:", error);
            return null; // Añadido
        }
    }, []); // Dependencias agregadas

    const apiProvidersProductsDetail = useCallback(async (id) => {
        try {
            const providerProductDetail = await usersApi.fetchProvidersProductsDetail(id);
            setProvidersProductsDetail((prev) => [...prev, providerProductDetail]);
            return providerProductDetail;
        } catch (error) {
            console.error("Error al obtener el listado:", error);
            return null; // Añadido
        }
    }, []);





    const [usuariosLista, setUsuariosLista] = useState([]);
    const [usuarioProveedorLista, setUsuarioProveedorLista] = useState([]);

    const apiUsuariosLista = useCallback(async (search) => {
    try {
        const dataUsuariosLista = await usersApi.fetchUsuariosLista(search);
        const lista = Array.isArray(dataUsuariosLista?.data)
        ? dataUsuariosLista.data
        : [];
        setUsuariosLista(lista);
        return dataUsuariosLista;
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        setUsuariosLista([]); // <-- importante corregir aquí también
        return null;
    }
    }, []);

    const apiUsuarioAgregar = useCallback(async (newUser) => {
    try {
        const addNewUser = await usersApi.fetchUsuarioAgregar(newUser);
        setUsuariosLista((prevUsers = []) => [...prevUsers, addNewUser]);
        return addNewUser;
    } catch (error) {
        console.error("Error al crear el usuario:", error);
        return null;
    }
    }, []);


    
    const apiUsuariosProveedoresLista = useCallback(async (search) => {
    try {
        const dataUsuariosLista = await usersApi.fetchUsuariosProveedorLista(search);
        const lista = Array.isArray(dataUsuariosLista?.data)
        ? dataUsuariosLista.data
        : [];
        setUsuariosLista(lista);
        return dataUsuariosLista;
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        setUsuarioProveedorLista([]); // <-- importante corregir aquí también
        return null;
    }
    }, []);

    const apiUsuariProveedorAgregar = useCallback(async (newUser) => {
    try {
        const addNewUser = await usersApi.fetchUsuarioProveedorAgregar(newUser);
        setUsuarioProveedorLista((prevUsers = []) => [...prevUsers, addNewUser]);
        return addNewUser;
    } catch (error) {
        console.error("Error al crear el usuario:", error);
        return null;
    }
    }, []);

        
    const apiUsuariosProveedoresListaSearch = useCallback(async (nombre) => {
    try {
        const response = await usersApi.fetchUsuariosProveedorListaSearch(nombre);
        const {success, messsage, data} = response
        setUsuariosLista(data);
        return data;
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        setUsuarioProveedorLista([]); // <-- importante corregir aquí también
        return null;
    }
    }, []);


    const value = {
        usersList,
        usersSearchList,
        usersListAll,
        supplierProduct,
        providersProductsDetail, // Agregado al value
        apiUsersSearchList,
        apiAddUser,
        apiUsersList,
        apiAddProviderProduct,
        apiProvidersProductsDetail,



        usuariosLista,
        apiUsuariosLista,
        apiUsuarioAgregar,

        usuarioProveedorLista, 
        apiUsuariosProveedoresLista,
        apiUsuariProveedorAgregar,
        apiUsuariosProveedoresListaSearch
    };

    return (
        <ApiUserContext.Provider value={value}>
            {children}
        </ApiUserContext.Provider>
    );
};

export { ApiUserContext, ApiUserProvider };
