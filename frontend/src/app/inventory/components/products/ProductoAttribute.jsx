'use client';
import React, { useEffect, useState } from 'react';
import ProductAttributeList from './ProductAttributeList';
export default function ProductoAttribute({ dataProductAttribute }) {
  const [productAttribute, setProductAttribute] = useState({
    product: dataProductAttribute.product_id,
    attribute_values: Array.isArray(dataProductAttribute.attribute_name_value)
      ? dataProductAttribute.attribute_name_value
      : [dataProductAttribute.attribute_name_value]
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("Datos recibidos en ProductoAttribute:", dataProductAttribute);
    setProductAttribute({
      product: dataProductAttribute.product_id,
      attribute_values: Array.isArray(dataProductAttribute.attribute_name_value)
        ? dataProductAttribute.attribute_name_value
        : [dataProductAttribute.attribute_name_value]
    });
  }, [dataProductAttribute]);

  const handleSubmitName = async () => {
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api_distrimed_inventario/product-attribute/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productAttribute)
      });

      if (!response.ok) {
        throw new Error("Error al enviar atributo de producto");
      }

      const data = await response.json();
      console.log("Producto-atributo guardado:", data);
      setSuccessMessage("¡Atributo del producto guardado con éxito!");
    } catch (error) {
      console.error(error);
      setErrorMessage("Hubo un problema al guardar los datos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded shadow-sm">
      <h2 className="text-xl font-bold mb-2">Datos del producto:</h2>
      <pre className="bg-gray-100 p-2 rounded text-sm">{JSON.stringify(productAttribute, null, 2)}</pre>

      <button
        onClick={handleSubmitName}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Guardando..." : "Guardar Producto relacion Atributo"}
      </button>

      {successMessage && <p className="text-green-600 mt-2">{successMessage}</p>}
      {errorMessage && <p className="text-red-600 mt-2">{errorMessage}</p>}
      <div>
        <ProductAttributeList/>
      </div>
    </div>
  );
}
