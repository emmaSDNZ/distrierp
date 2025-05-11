import React, { useEffect, useState, useRef, useContext } from 'react';
import { ApiUserContext } from '@/shared/context/UserContext';

export default function PurchaseForm({ propertyProduct }) {
  const { apiUsersSearchList, apiAddUser, apiAddSupplierProduct } = useContext(ApiUserContext);
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [dataPropertyProduct, setDataPropertyProduct] = useState({
    product_id: null,
    supplier_id: null,
  });

  useEffect(() => {
    if (propertyProduct?.id && dataPropertyProduct.product_id === null) {
      const updatedProductId = propertyProduct.id;

      setDataPropertyProduct(prev => ({
        ...prev,
        product_id: updatedProductId,
      }));

      const fetchSuppliers = async () => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api_distrimed_productos/supplier/product/by-product/?product_id=${propertyProduct.id}`
          );
          const data = await response.json();
          setSuppliers(data);
        } catch (error) {
          console.error("Error fetching supplier data:", error);
        }
      };

      fetchSuppliers();
    }
  }, [propertyProduct]);

  const [isTyping, setIsTyping] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!isTyping || inputValue.trim().length < 3) return;

      try {
        const data = await apiUsersSearchList(inputValue);
        if (data && Array.isArray(data.data) && data.data.length > 0) {
          setSuggestions(data.data);
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
  }, [inputValue, isTyping, apiUsersSearchList]);

  const handleButtonClick = () => {
    setShowInput(true);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setIsTyping(true);
  };

  const handleSelectCreateClick = async (name) => {
    try {
      setInputValue(name);
      setSuggestions([]);
      setIsTyping(false);

      const newUser = { name };
      const dataFormat = { name: newUser.name };
      const response = await apiAddUser(dataFormat);
      setDataPropertyProduct(prev => ({
        ...prev,
        supplier_id: response.data.id,
      }));
      console.log('Nuevo proveedor creado:', response.data.id);
    } catch (error) {
      console.error('Error al crear el proveedor:', error);
    }
  };

  const handleSupplierProductButtonClick = async () => {
    if (dataPropertyProduct.product_id && dataPropertyProduct.supplier_id) {
      try {
        const addedSupplierProduct = await apiAddSupplierProduct(dataPropertyProduct);
        console.log("Relación proveedor-producto creada:", addedSupplierProduct);
      } catch (error) {
        console.error("Error al guardar proveedor-producto:", error);
      }
    } else {
      console.log("Faltan datos para guardar el producto y proveedor.");
    }
  };

  const handleSelect = (supplier) => {
    const { name, id } = supplier;
    setInputValue(name);
    setDataPropertyProduct(prev => ({
      ...prev,
      supplier_id: id,
    }));
    setSuggestions([]);
    setIsTyping(false);
    setShowInput(true);
  };

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

  useEffect(() => {
    if (dataPropertyProduct.supplier_id) {
      const selectedSupplier = suppliers.find(
        (supplier) => supplier.supplier_id?.id === dataPropertyProduct.supplier_id
      );
      if (selectedSupplier) {
        setInputValue(selectedSupplier.supplier_id?.name || "");
      }
    }
  }, [dataPropertyProduct.supplier_id, suppliers]);

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

      <div>
        {suppliers.length > 0 ? (
          <ul>
            {suppliers.map((supplierObj) => (
              <li key={supplierObj.id}>
                {supplierObj.supplier_id?.name ?? "Nombre no disponible"} - Estado: {supplierObj.state ? "Activo" : "Inactivo"}
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay proveedores para este producto.</p>
        )}
      </div>
      
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
