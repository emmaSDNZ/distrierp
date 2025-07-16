import React, { useEffect, useState, useRef, useContext } from 'react';
import { ApiUserContext } from '@/shared/context/UserContext';
import useDebounce from '@/shared/hooks/useDebounce';
import EntityButtonLine from '@/shared/components/entityGeneral/EntityButtonLine';
import FormInput from '@/shared/components/entityForm/FormInput';
import { ApiProductContext } from '@/shared/context/ProductContext';
import UtilsFunctions from '@/shared/utils/utilsFunctions';

export default function PurchaseForm({ idProducto }) {
  const {
    apiUsuariProveedorAgregar,
    apiUsuariosProveedoresListaSearch
  } = useContext(ApiUserContext);

  const {
    apiProductoProveedorCreate,
    apiProductoProveedorByID,
  } = useContext(ApiProductContext);

  const [inputValue, setInputValue] = useState('');
  const [sugerencias, setSugerencias] = useState([]);
  const [proveedorLista, setProveedorLista] = useState([]);
  const [showInput, setShowInput] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const [idsForm, setIdsForm] = useState({
    id_producto_producto: idProducto,
    id_proveedor: null,
  });

  const containerRef = useRef(null);
  const debouncedInput = useDebounce(inputValue, 400);

  useEffect(() => {
    const fetchData = async () => {
      if (idProducto) {
        const response = await apiProductoProveedorByID(idProducto);
        const { success, data } = response;
        if (success && data?.results) {
          setProveedorLista(data.results);
        } else {
          setProveedorLista([]);
        }
      }
    };
    fetchData();
  }, [idProducto]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedInput.trim().length < 3) {
        setSugerencias([]);
        return;
      }

      try {
        const response = await apiUsuariosProveedoresListaSearch(debouncedInput);
   
        console.log("RESPONDE apiUsuariosProveedoresLista ", response)
        setSugerencias(response);
      } catch (error) {
        console.error('Error al buscar proveedores:', error);
        setSugerencias([]);
      }
    };

    if (isTyping) {
      fetchSuggestions();
    }
  }, [debouncedInput, isTyping]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        if (inputValue.trim() === "") {
          setShowInput(false);
        }
        setSugerencias([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [inputValue]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setIsTyping(true);
  };

  const handleCrearProveedor = async (nombre_proveedor) => {
    setInputValue(nombre_proveedor);
    setSugerencias([]);
    setIsTyping(false);

    try {
      const response = await apiUsuariProveedorAgregar({ nombre_proveedor });
      const { success, message, data } = response;
      UtilsFunctions.showToastMessageSuccessError(success, message);
      if (data?.id_proveedor) {
        setIdsForm(prev => ({
          ...prev,
          id_proveedor: data.id_proveedor,
        }));
      }
    } catch (error) {
      console.error("Error al crear proveedor:", error);
    }
  };

  const handleSelectProveedor = (proveedor) => {
    if (!proveedor || !proveedor.id_proveedor) return;

    setInputValue(proveedor.nombre_proveedor || '');
    setSugerencias([]);
    setIsTyping(false);
    setShowInput(true);

    setIdsForm(prev => ({
      ...prev,
      id_proveedor: proveedor.id_proveedor,
    }));
  };

  const handleSaveRelation = async () => {
    const { id_producto_producto, id_proveedor } = idsForm;
    if (!id_producto_producto || !id_proveedor) {
      return UtilsFunctions.showToastMessageSuccessError(false, "Faltan datos para guardar.");
    }

    try {
      const result = await apiProductoProveedorCreate(idsForm);
      const { success, message } = result;
      UtilsFunctions.showToastMessageSuccessError(success, message);

      setInputValue('');
      setIdsForm({ id_producto_producto: idProducto, id_proveedor: null });
      setShowInput(false);

      const updated = await apiProductoProveedorByID(idProducto);
      if (updated.success && updated.data?.results) {
        setProveedorLista(updated.data.results);
      }
    } catch (err) {
      console.error("Error al guardar relación producto-proveedor", err);
    }
  };

  return (
    <div ref={containerRef} className="relative w-64">
      <div className="mb-4">
        {proveedorLista.length > 0 ? (
          <ul className="space-y-2">
            {proveedorLista.map((p) => (
              <li key={p.id_producto_proveedor} className="text-sm text-gray-700">
                Proveedor: {p.proveedor?.nombre_proveedor ?? "Sin nombre"}
                <br />
                Código: {p.codigo_proveedor ?? "N/A"}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No hay proveedores para este producto.</p>
        )}
      </div>

      {showInput ? (
        <FormInput
          type="text"
          id="nombre_proveedor"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Nombre del proveedor"
          autoFocus
        />
      ) : (
        <EntityButtonLine title="Agregar proveedor" setShowInput={setShowInput} />
      )}

      {sugerencias.length >0 ? (
        <ul className="absolute left-0 right-0 bg-white border-x border-b border-gray-200 rounded-b-md shadow-sm mt-px max-h-60 overflow-y-auto z-10">
          {sugerencias.map((s) => (
            <li
              key={s.id_proveedor}
              onClick={() => handleSelectProveedor(s)}
              className="px-4 py-2 text-gray-600 hover:bg-gray-200 active:bg-gray-300 transition-colors duration-150 cursor-pointer"
            >
              {s.nombre_proveedor}
            </li>
          ))}
        </ul>
      ) : debouncedInput.trim().length >= 3 && isTyping ? (
        <ul className="absolute left-0 right-0 bg-white border-x border-b border-gray-200 rounded-b-md shadow-sm mt-px max-h-60 overflow-y-auto z-10">
          <li
            onClick={() => handleCrearProveedor(debouncedInput)}
            className="px-4 py-2 text-gray-600 hover:bg-gray-200 active:bg-gray-300 transition-colors duration-150 cursor-pointer"
          >
            Crear: {debouncedInput}
          </li>
        </ul>
      ) : null}

      {inputValue.trim() !== '' && (
        <div className="mt-4">
          <button
            className="text-blue-500 hover:text-blue-600 transition"
            onClick={handleSaveRelation}
          >
            Guardar
          </button>
          <EntityButtonLine/>
        </div>
      )}
    </div>
  );
}
