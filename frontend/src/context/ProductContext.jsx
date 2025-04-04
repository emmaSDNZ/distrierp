"use client";

import React, { createContext, useState, useEffect, useCallback } from 'react';

export const ProductContext = createContext({
    products: [],
    attributeName: [],
    attributesValues: [],
    attributeNameValues:[],
 

    loading: false,
    error: null,
    product: null,
    fetchProductID: async () => {},
    addProduct: async () => {},
    updateProduct: async () => {},
    deleteProduct: async () => {},

    //Atributes
    errorAttributeName: null,
    errorAttributeValue: null,
    fetchAttributeName: async () => {},
    addAttributeName: async () => {},
    fetchAttributesValues: async () => {},
    addAttributeValues: async()=>{},
    addAttributeNameValues: async()=>{},
    fetchAttributeNameValues: async()=>{},
    updateAttributeValue:  async()=>{},
});

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [dataProduct , setDataProduct] = useState([]);
    const [attributeName, setAttributeName] = useState([]);
    const [loading, setLoading] = useState(true);

    const [error, setError] = useState(null);
    const [errorAttributeName, setErrorAttributeName] = useState(null);
    const [errorAttributeValue, setErrorAttributeValue] = useState(null);
    const [product, setProduct] = useState(null);
    const [attributesValues, setAttributesValues] = useState([]);
    const [attributeNameValues, setAttributeNameValues] = useState([]);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api_distrimed_inventario/productos/`
            );
            if (!res.ok) {
                throw new Error(`No se pudo cargar los productos. Código de estado: ${res.status}`);
            }
            const data = await res.json();
            setProducts(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);


const fetchProductID = useCallback(async (IdProduct) => {
    setLoading(true);
    setError(null);
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEzD_URL}/api_distrimed_inventario/productos/${IdProduct}/`
        );
        if (!res.ok) {
            throw new Error(`No se pudo cargar el producto. Código de estado: ${res.status}`);
        }
        const data = await res.json();
        setProduct(data); // Almacena el producto en el estado
    } catch (err) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
}, []);

    const addProduct = useCallback(async (newProduct) => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api_distrimed_inventario/productos/`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newProduct),
                }
            );
            if (!res.ok) {
                throw new Error(`No se pudo agregar el producto. Código de estado: ${res.status}`);
            }
            const dataProduct = await res.json();
            console.log("dataProduct desde context ", dataProduct);
            setProducts(prevProducts => [...prevProducts, dataProduct]);
            fetchProducts();
            return dataProduct; // Regresamos el producto recién agregado
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [fetchProducts]);

    const updateProduct = useCallback(async (id, updatedProduct) => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api_distrimed_inventario/productos/
/{id}/`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedProduct),
                }
            );
            if (!res.ok) {
                throw new Error(`No se pudo actualizar el producto. Código de estado: ${res.status}`);
            }

            setProducts(prevProducts =>
                prevProducts.map(product =>
                    product.id === id ? { ...product, ...updatedProduct } : product
                )
            );

            if (product && product.id === id) {
                setProduct({ ...product, ...updatedProduct });
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [product]);

    const deleteProduct = useCallback(async (id) => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(
                `<span class="math-inline">\{process\.env\.NEXT\_PUBLIC\_BACKEND\_URL\}/api\_distrimed\_inventario/productos/</span>{id}/`,
                {
                    method: 'DELETE',
                }
            );
            if (!res.ok) {
                throw new Error(`No se pudo eliminar el producto. Código de estado: ${res.status}`);
            }
            fetchProducts();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [fetchProducts]);

    /*
    ATTRIBUTES
    */
    const fetchAttributeName = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api_distrimed_inventario/attribute-names/`
            );
            if (!res.ok) {
                throw new Error(`Error al cargar atributos. Código de estado: ${res.status}`);
            }
            const data = await res.json();
            setAttributeName(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAttributeName();
    }, [fetchAttributeName]);


    const addAttributeName = useCallback(async (newProduct) => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api_distrimed_inventario/attribute-names/`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newProduct),
                }
            );
            if (!res.ok) {
                const errorData = await res.json();
                if (errorData.name_attr && errorData.name_attr.length > 0) {
                    setErrorAttributeName(errorData.name_attr[0]);
                } else {
                    setErrorAttributeName(`No se pudo agregar el atributo. Código de estado: ${res.status}`);
                }
                return; // Aquí se termina la ejecución si ocurre un error
            }
    
            // Si la respuesta es exitosa, agrega el nuevo atributo
            const addedAttributeName = await res.json();
            setAttributeName((prevAttributeName) => [...prevAttributeName, addedAttributeName]);
    
            return addedAttributeName; // Regresamos el atributo recién agregado
    
        } catch (err) {
            setError(err.message); // Aquí se maneja el error si falla la solicitud
        } finally {
            setLoading(false); // Se termina el estado de carga
        }
    }, [])

    /*
    Valores de Atributo
    */
    const fetchAttributesValues = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api_distrimed_inventario/attribute-values/`
            );
            if (!res.ok) {
                throw new Error(`Error al cargar valores de atributos. Código de estado: ${res.status}`);
            }
            const data = await res.json();
            setAttributesValues(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAttributesValues();
    }, [fetchAttributesValues]);

const addAttributeValues = useCallback(async (newProduct) => {
    setLoading(true);
    setError(null);  // Limpiar cualquier error previo
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api_distrimed_inventario/attribute-values/`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newProduct),
            }
        );

        // Si la respuesta no es exitosa, intentamos obtener el cuerpo de la respuesta
        if (!res.ok) {
            const errorData = await res.json();  // Capturamos la respuesta de error

            // Revisamos si existe el campo 'value' y lo usamos para el error
            if (errorData.value && errorData.value.length > 0) {
                setErrorAttributeValue(errorData.value[0]);  // El mensaje específico del error
            } else {
                setErrorAttributeValue(`Error: ${res.statusText || 'No se pudo agregar el atributo'}`);
            }
            return;  // Salir de la función si hubo error
        }

        // Si la respuesta es exitosa, agregar el valor
        const addedAttributeValue = await res.json();
        setAttributesValues((prevAttributesValues) => [...prevAttributesValues, addedAttributeValue]);

    } catch (err) {
        // Si ocurre un error durante el fetch, lo capturamos y mostramos
        setError(`Error al agregar valor de atributo: ${err.message}`);
    } finally {
        setLoading(false);  // Se finaliza el estado de carga
    }
}, []);;

const updateAttributeValue = useCallback(async (id, updatedValue) => {
    setLoading(true);
    setError(null);
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api_distrimed_inventario/attribute-values/${id}/`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedValue),
            }
        );
        if (!res.ok) {
            throw new Error(`No se pudo actualizar el valor. Código de estado: ${res.status}`);
        }
        setAttributesValues(prevValues =>
            prevValues.map(item =>
                item.id === id ? { ...item, ...updatedValue } : item
            )
        );
    } catch (err) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
}, []);

    //NOMBRE Y VALOR

    const fetchAttributeNameValues = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api_distrimed_inventario/attribute-name-values/`
            );
            if (!res.ok) {
                throw new Error(`Error al cargar valores de nombres de atributos. Código de estado: ${res.status}`);
            }
            const data = await res.json();
            setAttributeNameValues(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAttributeNameValues();
    }, [fetchAttributeNameValues]);

    const addAttributeNameValues = useCallback(async (newProduct) => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api_distrimed_inventario/attribute-name-values/`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newProduct),
                }
            );
            if (!res.ok) {
                const errorData = await res.json();
                if (errorData.value && errorData.value.length > 0) {
                    setErrorAttributeValu(errorData.value[0]);
                } else {
                    setErrorAttributeValu(`No se pudo agregar el atributo. Código de estado: ${res.status}`);
                }
                return;
            }
            const addedAttributeValue = await res.json();
            setAttributeNameValues((prevAttributesValues) => [...prevAttributesValues, addedAttributeValue]);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);



    



    const value = {
        products: products,
        loading,
        error,
        product,
        fetchProductID,
        addProduct,
        updateProduct,
        deleteProduct,

        //Attributo
        attributeName,
        attributesValues,
        attributeNameValues,
        errorAttributeName,
        errorAttributeValue,
        setErrorAttributeValue,
        fetchAttributeName,
        addAttributeName,
        fetchAttributesValues,
        addAttributeValues,
        addAttributeNameValues,
        fetchAttributeNameValues,
        updateAttributeValue
    };

    return (
        <ProductContext.Provider value={value}>
            {children}
        </ProductContext.Provider>
    );
};