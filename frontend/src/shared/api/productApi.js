const endpointProducts=  `${process.env.NEXT_PUBLIC_BACKEND_URL}/api_distrimed_productos/products`

const fetchProductsList = async () => {
    try {
      const response = await fetch(
        `${endpointProducts}/list/`);
      if (!response.ok) {
        throw new Error(`Error al cargar productos: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.log("Error en fetch:", error.message);
      throw error;
    }
  }

  const fetchAddProduct = async(newProduct)=>{
    try {
        const response = await fetch(
          `${endpointProducts}/create/`,
          {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newProduct),
        }
        )
      const data = await response.json();
      return data
    } catch (error) {
      console.log("Error en fetch:", error.message);
      throw error;
    }
  }

const fetchProductId = async(id)=>{
  try {
    const response = await fetch(
      `${endpointProducts}/${id}/`
    )
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.log("Error en fetch:", error.message);
    throw error; 
  }
} 

const fetchProductUpdate = async(id, product)=>{
  try {
    const response  = await fetch(
      `${endpointProducts}/update/${id}/`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      }
    )
      if (!response.ok){
        const errorData = await response.json();
        console.log(errorData)
        throw new Error(`Faild to update product: (status ${response.status}): ${errorData.message || 'Unknown error'}`);
      }
      const data = await response.json();
      return data
  } catch (firstError) {
    console.log("Error en fetch:", firstError.message);
    throw firstError;
  }
}

const fetchProductDelete = async(id) => {
  try {
    const response = await fetch(
      `${endpointProducts}/delete/${id}/`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json(); // ✅ ahora sí se puede parsear
    console.log(data)
    return data;

  } catch (error) {
    console.log("Error en fetch:", error.message);
    throw error; 
  }
}


const productApi = {
    fetchProductsList,
    fetchProductId,
    fetchAddProduct,
    fetchProductUpdate,
    fetchProductDelete
}
export{ productApi}

