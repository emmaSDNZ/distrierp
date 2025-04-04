'use client';

import { useState, useEffect, use } from 'react';
import ProductoAttribute from './ProductoAttribute';

export default function ContactForm({productId}) {

  const [dataProductAttribute, setDataProductAttribute] =useState({
    product_id: productId,
    attribute_name_value: null,

  });
  const [loadingName, setLoadingName] = useState(false);
  const [loadingValue, setLoadingValue] = useState(false);
  const [success, setSuccess] = useState(null);
  const [name, setName] = useState({ name_attr: "", id: null });
  const [value, setValue] = useState({ value: "", id: null });
  const [attributeNameValue, setAttributeNameValue] = useState({
    name_attr: null,
    values: []
  });
  useEffect(() => {
    if (productId) {
      console.log("ID del producto recibido:", productId);
      setDataProductAttribute((prev) => ({ ...prev, product_id: productId }));
    }
  }, [productId]);

  useEffect(() => {
    console.log("Estado actualizado Name:", name);
  }, [name]);

  useEffect(() => {
    console.log("Estado actualizado Value:", value);
  }, [value]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "name") {
      setName((prev) => ({ ...prev, name_attr: value }));
    } else if (name === "value") {
      setValue((prev) => ({ ...prev, value: value }));
    }
  };

  const handleSubmitName = async (e) => {
    e.preventDefault();
    setLoadingName(true);
    setSuccess(null);
    const responseName = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api_distrimed_inventario/attribute-names/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name_attr: name.name_attr })
    });

    if (!responseName.ok) {
      const getData = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api_distrimed_inventario/attribute-names/?search=${name.name_attr}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      const getResponse = await getData.json();
      if (getResponse.length > 0) {
        setName({ name_attr: getResponse[0].name_attr, id: getResponse[0].id });
        setAttributeNameValue((prev) => ({ ...prev, name_attr: getResponse[0].id }));
      }
      setLoadingName(false);
      return;
    }

    const successData = await responseName.json();
    setSuccess('Nombre agregado con éxito');
    setName({ name_attr: successData.name_attr, id: successData.id });
    setAttributeNameValue((prev) => ({ ...prev, name_attr: successData.id }));
    setLoadingName(false);
  };

  const handleSubmitValue = async (e) => {
    e.preventDefault();
    setLoadingValue(true);
    setSuccess(null);
  
    const responseValue = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api_distrimed_inventario/attribute-values/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value: value.value })
    });
  
    if (!responseValue.ok) {
      const getData = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api_distrimed_inventario/attribute-values/?search=${value.value}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
  
      const getResponse = await getData.json(); // 🔧 ESTA LÍNEA FALTABA
  
      if (getResponse.length > 0) {
        const val = getResponse[0];
        setValue({ value: val.value, id: val.id });
  
        // Chequear si ya fue agregado
        const alreadyExists = attributeNameValue.values.some(item => item.id === val.id);
        if (!alreadyExists) {
          setAttributeNameValue((prev) => ({
            ...prev,
            values: [...prev.values, { id: val.id, value: val.value }]
          }));
        }
  
        setLoadingValue(false);
        return;
      }
    }
  
    const successData = await responseValue.json();
    setValue({ value: successData.value, id: successData.id });
  
    // Chequear si ya fue agregado
    const alreadyExists = attributeNameValue.values.some(item => item.id === successData.id);
    if (!alreadyExists) {
      setAttributeNameValue((prev) => ({
        ...prev,
        values: [...prev.values, { id: successData.id, value: successData.value }]
      }));
    }
    setSuccess('Valor agregado con éxito'); 
    setLoadingValue(false);
  };
    
  const handleSubmitAttributeNameValue = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api_distrimed_inventario/attribute-name-values/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name_attr: attributeNameValue.name_attr,
            values: attributeNameValue.values.map(val => val.id)
        })
    });
    if (!response.ok) {
        console.error('Error al enviar los datos:', response.statusText);
        return;
    }
    const data = await response.json();
    console.log('Datos enviados con éxito:', data);
    setDataProductAttribute((prev) => ({  ...prev, attribute_name_value: data.id }));
    console.log(dataProductAttribute)
  };   
  return (
<div>
<form className="max-w-md mx-auto p-4 border rounded-lg shadow-md">
      <div className="mb-4">
        <label className="block text-gray-700">Atributo</label>
        <input
          type="text"
          name="name"
          value={name.name_attr}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <button
          onClick={handleSubmitName}
          className="w-full bg-blue-500 text-white p-2 rounded mt-2"
          disabled={loadingName}
        >
          {loadingName ? 'Enviando...' : 'Enviar Nombre'}
        </button>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Valor</label>
        <input
          type="text"
          name="value"
          value={value.value}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <button
          onClick={handleSubmitValue}
          className="w-full bg-green-500 text-white p-2 rounded mt-2"
          disabled={loadingValue}
        >
          {loadingValue ? 'Enviando...' : 'Enviar Valor'}
        </button>

        {attributeNameValue.values.length > 0 && (
          <div className="mt-2 text-sm text-gray-600">
            <p className="font-semibold">Valores agregados:</p>
            <ul className="list-disc ml-5">
              {attributeNameValue.values.map((val, index) => (
                <li key={index}>ID: {val.value}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {success && <p className="mt-2 text-center text-sm text-green-600">{success}</p>}
      <button
  type="button"
  onClick={handleSubmitAttributeNameValue}
  className="w-full bg-purple-600 text-white p-2 rounded mt-4 hover:bg-purple-700 transition"
>
  Guardar Relación Atributo/Valores
</button>
    </form>
        <ProductoAttribute dataProductAttribute={dataProductAttribute} />
</div>
  );
}
