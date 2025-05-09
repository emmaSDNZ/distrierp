import React, { useEffect, useState, useRef, useContext } from 'react';
import { ApiUserContext } from '@/shared/context/UserContext';

export default function PurchaseForm({ propertyProduct }) {
  const { apiUsersSearchList, apiAddUser } = useContext(ApiUserContext);
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [dataPropertyProduct, setDataPropertyProduct] = useState({
    product_id: null,
    supplier_id: null,
  });

  useEffect(() => {
    if (propertyProduct && propertyProduct.id && dataPropertyProduct.product_id === null) {
      setDataPropertyProduct({
        ...dataPropertyProduct,
        product_id: propertyProduct.id,  // Solo se actualiza si product_id es null
      });
      console.log("product_id actualizado:", propertyProduct.id);
    }
  }, [propertyProduct, dataPropertyProduct]); 

  const [isTyping, setIsTyping] = useState(false);  // Estado para verificar si el usuario está escribiendo
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!isTyping) return; // Solo buscar si el usuario está escribiendo
      try {
        if (inputValue.trim().length >= 3) {
          const data = await apiUsersSearchList(inputValue);
          if (data && Array.isArray(data.data) && data.data.length > 0) {
            setSuggestions(data.data);
          } else {
            setSuggestions([]);
          }
        } else {
          setSuggestions([]);
        }
      } catch (error) {
        console.error('Error al buscar usuarios:', error);
        setSuggestions([]);
      }
    };

    const timeout = setTimeout(fetchData, 300);

    return () => clearTimeout(timeout);
  }, [inputValue, isTyping, apiUsersSearchList]); // `isTyping` agregado

  const handleButtonClick = () => {
    setShowInput(true);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setIsTyping(true); // Marcar que está escribiendo
  };

  const handleSelectCreateClick = async (name) => {
    try {
      setInputValue(name);
      setSuggestions([]);
      setIsTyping(false); 
      setShowInput(true);

      const newUser = { name };
      const dataFormat = {
        name: newUser.name,
      };
      const response = await apiAddUser(dataFormat);
      setDataPropertyProduct({
        ...dataPropertyProduct,
        supplier_id: response.data.id,
      });
      console.log('Nuevo proveedor creado:', response.data.id);
    } catch (error) {
      console.error('Error al crear el proveedor:', error);
    }
  };

  const handleSelect = (users) => {
    const { name, id } = users;
    setInputValue(name);
    setDataPropertyProduct({
      ...dataPropertyProduct,
      supplier_id: id, // Cambié 'name_id' por 'supplier_id'
    });
    setSuggestions([]);
    setIsTyping(false); 
    setShowInput(true);
  };

  // UseEffect para observar cambios en el estado 'dataPropertyProduct'
  useEffect(() => {
    console.log("propiedad del producto después de la actualización", dataPropertyProduct);
  }, [dataPropertyProduct]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        if (inputValue.trim() === "") {
          setShowInput(false);
        }
        setSuggestions([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [inputValue]);


  const handleSupplierProductButtonClick = () => {
    // Verifica que los datos del producto y proveedor están completos antes de hacer la solicitud
    if (dataPropertyProduct.product_id && dataPropertyProduct.supplier_id) {
      console.log("Datos del proveedor y producto:", dataPropertyProduct);
      try {
        const saveData = async () => {
          const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api_distrimed_productos/supplier/product/create/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataPropertyProduct),
          });
  
          const responseData = await response.json();
          console.log(responseData);
        };
        saveData();
      } catch (error) {
        console.error("Error al guardar los datos:", error);
      }
    } else {
      console.log("Faltan datos para guardar el producto y proveedor.");
    }
  };

  

  return (
    <div ref={containerRef} className="relative w-64">
      {showInput ? (
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Nombre del proveedor"
          className="w-full border rounded px-2 py-1"
          autoFocus
        />
      ) : (
        <button
          className="text-blue-500 hover:text-blue-600 transition"
          onClick={handleButtonClick}
        >
          Agregar Proveedor
        </button>
      )}

      {suggestions.length > 0 ? (
        <ul className="absolute left-0 right-0 bg-white border rounded shadow-lg mt-1 max-h-60 overflow-y-auto z-10">
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.id}
              onMouseDown={() => handleSelect(suggestion)}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {suggestion.name}
            </li>
          ))}
        </ul>
      ) : inputValue.trim().length >= 3 && isTyping ? (
        <ul className="absolute left-0 right-0 bg-white border rounded shadow-lg mt-1 max-h-60 overflow-y-auto z-10">
          <li
            onClick={() => handleSelectCreateClick(inputValue)}
            className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-gray-700"
          >
            Crear: {inputValue}
          </li>
        </ul>
      ) : null}
      
      <div className="mt-4">
        <button
          className="text-blue-500 hover:text-blue-600 transition"
          onClick={handleSupplierProductButtonClick}
        >
          Guardar
        </button>
        </div>
    </div>
  );
}
