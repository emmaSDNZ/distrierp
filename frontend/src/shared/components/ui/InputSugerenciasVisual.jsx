import React, { useEffect, useRef, useState } from 'react';
import useDebounce from '@/shared/hooks/useDebounce';
import FormInput from '../entityForm/FormInput';

export default function InputSugerenciasVisual({
  onSelect,
  onCreate,
  fetchSugerencias,
  placeholder = "Ingrese nombre.",
  minLength = 3,
}) {
  const [inputValue, setInputValue] = useState('');
  const [sugerencias, setSugerencias] = useState([]);
  const [visible, setVisible] = useState(false);
  const [hasSelected, setHasSelected] = useState(false);
  const containerRef = useRef(null);

  const debouncedInput = useDebounce(inputValue, 400);

  useEffect(() => {
    const fetch = async () => {
      if (debouncedInput.trim().length >= minLength && !hasSelected) {
        try {
          const resultado = await fetchSugerencias(debouncedInput);
          setSugerencias(resultado || []);
          setVisible(true);
        } catch {
          setSugerencias([]);
          setVisible(false);
        }
      } else {
        setSugerencias([]);
        setVisible(false);
      }

      if (hasSelected) setHasSelected(false);
    };

    fetch();
  }, [debouncedInput]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSelect = (s) => {
    setInputValue(s.nombre_proveedor);
    setVisible(false);
    setHasSelected(true);
    onSelect && onSelect(s);
  };

  const handleCreate = () => {
    setVisible(false);
    onCreate && onCreate(inputValue);
  };

  const shouldShowCreate = () =>
    debouncedInput.trim().length >= minLength &&
    sugerencias.length === 0 &&
    typeof onCreate === 'function';

  const shouldShowNoResults = () =>
    debouncedInput.trim().length >= minLength &&
    sugerencias.length === 0 &&
    typeof onCreate !== 'function';

  return (
    <div className="relative w-64" ref={containerRef}>
      <FormInput
        type="text"
        value={inputValue}
        onChange={handleChange}
        placeholder={placeholder}
      />

      {visible && (
        <ul className="absolute left-0 right-0 bg-white border-x border-b border-gray-200 rounded-b-md shadow-sm mt-px max-h-60 overflow-y-auto z-10">
          {sugerencias.length > 0 ? (
            sugerencias.map((s) => (
              <li
                key={s.id_proveedor}
                onClick={() => handleSelect(s)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-200 active:bg-gray-300 transition-colors duration-150 cursor-pointer"
              >
                {s.nombre_proveedor}
              </li>
            ))
          ) : shouldShowCreate() ? (
            <li
              onClick={handleCreate}
              className="px-4 py-2 text-gray-600 hover:bg-gray-200 active:bg-gray-300 transition-colors duration-150 cursor-pointer"
            >
              Crear: {inputValue}
            </li>
          ) : shouldShowNoResults() ? (
            <li className="px-4 py-2 text-gray-500 mb-1">No se encontraron resultados</li> 
          ) : null}
        </ul>
      )}
    </div>
  );
}
