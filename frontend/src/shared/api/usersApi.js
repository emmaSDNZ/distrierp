const endpointUsers=  `${process.env.NEXT_PUBLIC_BACKEND_URL}/api_distrimed_productos/users`
const endpointUserProvider = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api_distrimed_productos/supplier`
const endpointUsuario = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api_distrimed_productos/usuario`

const fetchSearchUsersName = async (search) => {
    try {
        const response = await fetch(`${endpointUsers}/search/?search=${search}`);
        if (!response.ok) {
            throw new Error(`Error al cargar usuarios: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.log("Error en fetch:", error.message);
        throw error;
        
    }
}

const fetchUsersListAll = async()=>{
  try {
    const response = await fetch(`${endpointUsers}/list/`)
    if(!response.ok){
      throw new Error(`Error al cargar usuarios: ${response.status}`);
    }
    const data = response.json()
    return data
  } catch (error) {
    console.log("Error en fetch:", error.message);
    throw error;
    
  }
}

const fetchAddUser = async(newUser)=>{
    try {
        const response = await fetch(
          `${endpointUsers}/create/`,
          {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newUser),
        }
        )
      const data = await response.json();
      return data
    } catch (error) {
      console.log("Error en fetch:", error.message);
      throw error;
    }
  }


  const fetchAddProviderProduct = async(supplierProduct)=>{
    try {
        const response = await fetch(`
          ${endpointUserProvider}/product/create/`, 
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(supplierProduct),
          });
      const data = await response.json();
      return data
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  const fetchProvidersProductsDetail = async(id) =>{
    try{
      const response = await fetch(`
        ${endpointUserProvider}/product/by-product/?product_id=${id}`
        )
        const data = await response.json()
        return data
    }catch(error)
    {
      console.log("Error en fetch:", error.message);
      throw error;
    }
  }
  





    // Función API para obtener usuarios
    const fetchUsuariosLista = async () => {
      try {
        const response = await fetch(`${endpointUsuario}/usuario/`);
        if (!response.ok) {
          throw new Error(`Error al cargar usuarios: ${response.status}`);
        }
        const data = await response.json(); // <- faltaba await
        return data;
      } catch (error) {
        console.log("Error en fetch:", error.message);
        throw error;
      }
    };

    // Función API para agregar un nuevo usuario
    const fetchUsuarioAgregar = async (newUser) => {
      try {
        const response = await fetch(`${endpointUsuario}/usuario/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newUser),
        });
        const data = await response.json();
        return data;
      } catch (error) {
        console.log("Error en fetch:", error.message);
        throw error;
      }
    };

      const endpointUsuarioProveedor = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api_distrimed_productos/usuarios/proveedor`  
    // Función API para obtener usuarios que son proveedores
    const fetchUsuariosProveedorLista = async () => {
      try {
        const response = await fetch(`${endpointUsuarioProveedor}/`);
        if (!response.ok) {
          throw new Error(`Error al cargar usuarios: ${response.status}`);
        }
        const data = await response.json(); // <- faltaba await
        return data;
      } catch (error) {
        console.log("Error en fetch:", error.message);
        throw error;
      }
    };

    
    // Función API para obtener usuarios que son proveedores
    const fetchUsuariosProveedorListaSearch = async (nombre) => {
      const enpoint = `${endpointUsuarioProveedor}`
      try {
        const response = await fetch(`${enpoint}/?nombre_proveedor=${nombre}`);
        if (!response.ok) {
          throw new Error(`Error al cargar usuarios: ${response.status}`);
        }
        const data = await response.json(); // <- faltaba await
        return data;
      } catch (error) {
        console.log("Error en fetch:", error.message);
        throw error;
      }
    };


    // Función API para agregar un nuevo proveedor
    const fetchUsuarioProveedorAgregar = async (newUser) => {
      try {
        const response = await fetch(`${endpointUsuarioProveedor}/create/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newUser),
        });
        const data = await response.json();
        return data;
      } catch (error) {
        console.log("Error en fetch:", error.message);
        throw error;
      }
    };



const usersApi = {
    fetchUsersListAll,
    fetchSearchUsersName,
    fetchAddUser,
    fetchAddProviderProduct,
    fetchProvidersProductsDetail,

    fetchUsuariosLista,
    fetchUsuarioAgregar,
    fetchUsuariosProveedorLista,
    fetchUsuarioProveedorAgregar,
    fetchUsuariosProveedorListaSearch
}


export { usersApi }

