const endpointUers=  `${process.env.NEXT_PUBLIC_BACKEND_URL}/api_distrimed_productos/users`

const fetchUsersList = async (search) => {
    try {
        const response = await fetch(`${endpointUers}/search/?search=${search}`);
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
    const response = await fetch(`${endpointUers}/list/`)
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
          `${endpointUers}/create/`,
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

  const fetchAddSupplierProduct = async(supplierProduct)=>{
    try {
        const response = await fetch(`
          ${process.env.NEXT_PUBLIC_BACKEND_URL}/api_distrimed_productos/supplier/product/create/`, 
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
const usersApi = {
    fetchUsersListAll,
    fetchUsersList,
    fetchAddUser,
    fetchAddSupplierProduct
}


export { usersApi }

