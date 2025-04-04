"use client"; 
import React, { useState, useContext, useEffect } from "react";
import { ProductContext } from "@/context/ProductContext";

function AttributeValue() {
  const [attributeValues, setAttributeValues] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [editingValue, setEditingValue] = useState(null); // Estado para el valor que se está editando

  const { addAttributeValues, errorAttributeValue, updateAttributeValue } = useContext(ProductContext);

  // Manejo de cambios en el input
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // Función que envía el valor y verifica duplicados en el backend
  const submitAttributeValue = async () => {
    if (inputValue.trim() !== "") {
      const newValue = { value: inputValue };

      try {
        // Verificar duplicados en el backend
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api_distrimed_inventario/attribute-values/?search=${inputValue}`
        );
        const data = await res.json();

        if (data && data.length > 0) {
          console.log(`Atributo duplicado encontrado en el backend:`, data);
          if (!attributeValues.some((item) => item.value === newValue.value)) {
            setAttributeValues((prevValues) => [...prevValues, ...data]);
          }
        } else {
          await addAttributeValues(newValue); // Añadir nuevo atributo
          setAttributeValues((prevValues) => [
            ...prevValues,
            { ...newValue, freeText: "", extraPrice: 0 },
          ]);
        }

        setInputValue(""); // Limpiar el input después de enviar
        setIsAdding(false); // Finalizar el estado de añadir
      } catch (err) {
        console.error("Error al verificar o agregar el valor:", err);
        setIsAdding(false);
      }
    } else {
      setIsAdding(false); // Si el input está vacío, no hacer nada
    }
  };

  // Manejo del Enter en el input
  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") {
      submitAttributeValue(); // Enviar cuando se presiona Enter
    }
  };

  // Manejo del clic en "Agregar una línea"
  const handleAddClick = () => {
    if (!isAdding) {
      setIsAdding(true); // Comenzar a agregar nuevo atributo
    } else {
      submitAttributeValue(); // Enviar el valor si ya estamos agregando
    }
  };

  // Manejo de la edición de valores
  const handleEditClick = (value) => {
    setEditingValue(value); // Guardamos el valor que se está editando
  };

  // Manejo del cambio en el campo de edición
  const handleEditInputChange = (e) => {
    setEditingValue((prev) => ({
      ...prev,
      value: e.target.value, // Actualizar solo el valor del atributo
    }));
  };

  // Función para actualizar el valor en el backend
  const submitUpdatedAttributeValue = async () => {
    if (editingValue && editingValue.value.trim() !== "") {
      try {
        console.log("Actualizando el valor en el backend...", editingValue); // Depuración

        const res = await updateAttributeValue(editingValue.id, {
          value: editingValue.value, // Aquí pasas los valores modificados
        });

        if (res) {
          console.log("Respuesta de la actualización:", res);

          // Luego de actualizar en el backend, actualizar el estado local
          setAttributeValues((prevValues) =>
            prevValues.map((item) =>
              item.id === editingValue.id
                ? { ...item, value: editingValue.value }
                : item
            )
          );
          setEditingValue(null); // Limpiar el estado de edición
        }
      } catch (error) {
        console.error("Error al actualizar el valor:", error);
      }
    }
  };

  useEffect(() => {
    console.log("Estado actualizado de attributeValues:", attributeValues);
  }, [attributeValues]);

  return (
    <div className="p-6 bg-white shadow rounded-md">
      <h2 className="text-lg font-semibold mb-4">Valores de atributo</h2>
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2">Valor</th>
            <th className="text-left py-2">Texto libre</th>
            <th className="text-left py-2">Precio extra predeterminado</th>
          </tr>
        </thead>
        <tbody>
          {/* Filas de valores agregados */}
          {attributeValues.map((value) => (
            <tr key={value.id} className="border-b">
              {editingValue && editingValue.id === value.id ? (
                <td className="py-2">
                  <input
                    type="text"
                    value={editingValue.value}
                    onChange={handleEditInputChange}
                    onBlur={submitUpdatedAttributeValue} // Enviar si pierde el foco
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        submitUpdatedAttributeValue(); // Enviar si presionas Enter
                        setEditingValue(null); // Cerrar el input
                      }
                    }} // Enviar solo si presionas Enter
                    className="border rounded px-2 py-1 w-full"
                  />
                </td>
              ) : (
                <td className="py-2" onClick={() => handleEditClick(value)}>
                  {value.value}
                </td>
              )}
              <td className="py-2">{value.freeText}</td>
              <td className="py-2">{value.extraPrice}</td>
            </tr>
          ))}
          {/* Input dinámico para agregar valor */}
          {isAdding && (
            <tr className="border-b">
              <td className="py-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyDown={handleInputKeyDown} // Enviar solo si presionas Enter
                  className="border rounded px-2 py-1 w-full"
                  autoFocus
                />
              </td>
              <td className="py-2"></td>
              <td className="py-2"></td>
            </tr>
          )}

          {/* Última fila: botón "Agregar una línea" o mensaje de error */}
          <tr className="cursor-pointer hover:bg-gray-100" onClick={handleAddClick}>
            <td colSpan="3" className="text-blue-500 py-2 text-center">
              {errorAttributeValue ? `⚠️ ${errorAttributeValue}` : "Agregar una línea"}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default AttributeValue;
