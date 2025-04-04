"use client";
import React, { useContext, useState, useEffect } from "react";
import { UseForm } from "../UserForm";
import { ProductContext } from "@/context/ProductContext";

export default function AttributeName() {
  const { addAttributeValues, errorAttributeValue, updateAttributeValue, addAttributeName } = useContext(ProductContext);
  const [attributeValues, setAttributeValues] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [editingValue, setEditingValue] = useState(null);
  const { values, handleChange } = UseForm({ attributeName: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [attributeNameValue, setAttributeNameValue] = useState({
    name_atrr: "",
    values: [],
  });

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const fetchAttributeValue = async (value) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api_distrimed_inventario/attribute-values/?search=${value}`
    );
    return res.json();
  };

  useEffect(() => {
    console.log("Estado actualizado de attributeNameValue:", attributeNameValue);
  }, [attributeNameValue]);

  const submitAttributeValue = async () => {
    if (inputValue.trim() !== "") {
      try {
        let data = await fetchAttributeValue(inputValue);

        if (data && data.length > 0) {
          // Verificar duplicados antes de agregar
          if (!attributeValues.some((item) => item.id === data[0].id)) {
            setAttributeNameValue((prevState) => ({
              ...prevState,
              values: [...prevState.values, data[0].id],
            }));

            setAttributeValues((prevValues) => {
              return [...prevValues, { id: data[0].id, value: data[0].value, freeText: "", extraPrice: 0 }];
            });
          }
        } else {
          await addAttributeValues({ value: inputValue });
          const postData = await fetchAttributeValue(inputValue);

          setAttributeNameValue((prevState) => ({
              ...prevState,
              values: [...prevState.values, postData[0].id],
            }));

            setAttributeValues((prevValues) => {
              return [...prevValues, { id: postData[0].id, value: postData[0].value, freeText: "", extraPrice: 0 }];
            });
        }

        setInputValue("");
        setIsAdding(false);
      } catch (err) {
        console.error("Error al verificar o agregar el valor:", err);
        setIsAdding(false);
      }
    }
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") {
      submitAttributeValue();
    }
  };

  const handleAddClick = () => {
    if (!isAdding) {
      setIsAdding(true);
    } else {
      submitAttributeValue();
    }
  };

  const handleEditClick = (value) => {
    setEditingValue(value);
  };

  const handleEditInputChange = (e) => {
    setEditingValue((prev) => ({
      ...prev,
      value: e.target.value,
    }));
  };

  const submitUpdatedAttributeValue = async () => {
    if (editingValue && editingValue.value.trim() !== "") {
      try {
        const res = await updateAttributeValue(editingValue.id, {
          value: editingValue.value,
        });

        if (res) {
          setAttributeValues((prevValues) =>
            prevValues.map((item) =>
              item.id === editingValue.id ? { ...item, value: editingValue.value } : item
            )
          );
          setEditingValue(null);
        }
      } catch (error) {
        console.error("Error al actualizar el valor:", error);
      }
    }
  };

  const handleSubmitAttributeName = async (e) => {
    e.preventDefault();
    if (!values.attributeName.trim()) return;
    setIsLoading(true);
    setSuccessMessage("");
    setErrorMessage("");
    const formattedData = { name_attr: values.attributeName };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api_distrimed_inventario/attribute-names/?search=${formattedData.name_attr}`
      );
      const data = await response.json();
      if (data.length > 0) {
        setErrorMessage("El atributo ya existe en la base de datos.");
        setAttributeNameValue((prevState) => ({
          ...prevState,
          name_atrr: data[0].id,
        }));
        setTimeout(() => setErrorMessage(""), 2000);
        return;
      }
      const nameAttribute = await addAttributeName(formattedData);
      if (nameAttribute) {
        setSuccessMessage("¡Atributo agregado correctamente!");
        setAttributeNameValue((prevState) => ({
          ...prevState,
          name_atrr: nameAttribute.id,
        }));
        setTimeout(() => setErrorMessage(""), 2000);
        setTimeout(() => setSuccessMessage(""), 2000);
      } else {
        setErrorMessage("Hubo un problema al agregar el atributo.");
        setTimeout(() => setErrorMessage(""), 2000);
      }
    } catch (error) {
      console.error("Error en la petición:", error);
      setErrorMessage("Error en la petición. Intenta nuevamente.");
      setTimeout(() => setErrorMessage(""), 2000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmitAttributeName(e);
    }
  };


  const handleSubmit = async () => {
    if (!attributeNameValue.name_atrr || attributeNameValue.values.length === 0) {
      setErrorMessage("Se debe ingresar valores");
      return;
    }
  
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api_distrimed_inventario/attribute-name-values/`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name_attr: attributeNameValue.name_atrr,
          values: attributeNameValue.values,
        }),
      });
      const data = await res.json();
      if (data.id) {
        setSuccessMessage("¡Atributo y valores enviados correctamente!");
  
        // Limpiar los campos después de un envío exitoso
        setAttributeNameValue({ name_atrr: "", values: [] }); // Limpiar valores
        setInputValue("");  // Limpiar el valor de la entrada de atributo
        setIsAdding(false); // Si tienes un estado para mostrar el input de agregar, restablecerlo
        handleChange({ target: { name: "attributeName", value: "" } }); // Limpiar el campo del nombre del atributo
        setAttributeValues([]);
        
        // Limpiar mensaje de éxito después de un corto tiempo
        setTimeout(() => setSuccessMessage(""), 2000);
      } else {
        setErrorMessage("Hubo un problema al enviar los datos.");
      }
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      setErrorMessage("Error en la solicitud. Intenta nuevamente.");
    }
  };
  

  return (
    <div className="p-6 bg-gray-100 h-auto flex justify-center items-start w-full">
      <div className="w-full max-w-4xl bg-white shadow-md rounded-md border border-gray-300 p-8">
        <h1 className="text-xl font-semibold text-gray-800 border-b pb-3 mb-4">
          Atributos
        </h1>

        {/* Nombre del Atributo */}
        <div>
          <label
            htmlFor="attributeName"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Nombre del Atributo:
          </label>
          <input
            type="text"
            id="attributeName"
            name="attributeName"
            placeholder="Nombre del Atributo"
            value={values.attributeName || ""}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className="w-full border-b-2 border-transparent py-3 px-5 text-2xl text-gray-900 focus:outline-none focus:border-blue-400 focus:border-b-2 hover:border-blue-200 transition-colors duration-200"
          />
        </div>

        {/* Pestaña de "Valores de Atributo" */}
        <div className="mt-6 border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-3 mb-4">Valores de Atributo</h3>

          {/* Tabla de valores de atributo */}
          <table className="min-w-full table-auto mt-4">
            <thead>
              <tr className="border-b">
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase">Valor</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase">Texto Libre</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase">Precio Extra</th>
              </tr>
            </thead>
            <tbody>
              {attributeValues.map((value) => (
                <tr key={value.id} className="border-b">
                  {editingValue && editingValue.id === value.id ? (
                    <td className="px-6 py-4 bg-white">
                      <input
                        type="text"
                        value={editingValue.value}
                        onChange={handleEditInputChange}
                        onBlur={submitUpdatedAttributeValue}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            submitUpdatedAttributeValue();
                            setEditingValue(null);
                          }
                        }}
                        className="w-full border-b-2 border-transparent py-2 px-3 text-gray-900 focus:outline-none focus:border-blue-400 focus:border-b-2 hover:border-blue-200 transition-colors duration-200"
                      />
                    </td>
                  ) : (
                    <td className="px-6 py-4 bg-white text-sm cursor-pointer" onClick={() => handleEditClick(value)}>
                      {value.value}
                    </td>
                  )}
                  <td className="px-6 py-4 bg-white text-sm">{value.freeText}</td>
                  <td className="px-6 py-4 bg-white text-sm">{value.extraPrice}</td>
                </tr>
              ))}
              {isAdding && (
                <tr className="border-b">
                  <td className="px-6 py-4 bg-white">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={handleInputChange}
                      onKeyDown={handleInputKeyDown}
                      className="w-full border-b-2 border-transparent py-2 px-3 text-gray-900 focus:outline-none focus:border-blue-400 focus:border-b-2 hover:border-blue-200 transition-colors duration-200"
                      autoFocus
                    />
                  </td>
                  <td className="px-6 py-4 bg-white"></td>
                  <td className="px-6 py-4 bg-white"></td>
                </tr>
              )}
              <tr>
                <td colSpan="3" className="px-6 py-4 bg-white text-center">
                  <button onClick={handleAddClick} className="text-blue-500 hover:text-blue-700">
                    {errorAttributeValue ? `⚠️ ${errorAttributeValue}` : "Agregar una línea"}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Botón de enviar */}
        <div className="flex justify-end pt-4">
        <button onClick={handleSubmit} className="text-blue-500 hover:text-blue-700">
  Enviar
</button>
        </div>

        {/* Mensajes de éxito o error */}
        {successMessage && <p className="text-green-600 mt-4">{successMessage}</p>}
        {errorMessage && <p className="text-red-600 mt-4">{errorMessage}</p>}
      </div>
    </div>
  );
}