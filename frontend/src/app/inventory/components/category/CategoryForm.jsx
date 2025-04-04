"use client";
import React, { useEffect, useState } from 'react';
import { UseForm } from '../UserForm';

export default function CategoryForm() {
    const [categories, setCategories] = useState([]);
    const [showCategories, setShowCategories] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState({ id: "", name: "" }); // Almacenamos un objeto con id y name
    const [errorMessage, setErrorMessage] = useState(""); // Estado para mostrar el mensaje de error
    const { values, handleChange, resetForm } = UseForm({
        name: "",
        parent: "", // Este será el ID de la categoría seleccionada
    });

    // Función para cargar las categorías
    const getCategory = async () => {
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api_distrimed_inventario/category/`
            );
            if (!res.ok) {
                throw new Error('No se pudo cargar las categorías.');
            }
            const data = await res.json();
            setCategories(data); // Guardamos las categorías
            console.log('Categorías cargadas:', data);
        } catch (error) {
            console.error('Error al cargar las categorías:', error.message);
        }
    };

    useEffect(() => {
        getCategory();
    }, []);

    // Mostrar el listado de categorías al hacer clic en el input
    const handleInputClick = () => {
        setShowCategories(true); // Muestra las categorías al hacer clic en el input
    };

    // Seleccionar una categoría y actualizar el input
    const handleCategorySelect = (id, name) => {
        console.log('Categoría seleccionada:', { id, name }); // Depuración: muestra el ID y nombre seleccionado
        setSelectedCategory({ id, name }); // Guardamos un objeto con el id y name
        setShowCategories(false); // Oculta las opciones al seleccionar
    };

    // Ocultar las categorías cuando el input pierde el foco
    const handleInputBlur = (e) => {
        // Usamos setTimeout para darle tiempo a que el usuario seleccione la opción antes de que se cierre el dropdown
        setTimeout(() => {
            setShowCategories(false);
        }, 200);
    };

    // Manejar la tecla retroceso (backspace) para vaciar el input y seguir mostrando las opciones
    const handleKeyDown = (e) => {
        if (e.key === "Backspace") {
            setSelectedCategory({ id: "", name: "" }); // Vaciar el input cuando se presiona retroceso
            setShowCategories(true); // Seguir mostrando las sugerencias
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Enviando datos:", values);
        console.log("Categoría seleccionada:", selectedCategory); // Mostramos el nombre de la categoría
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api_distrimed_inventario/category/`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        ...values,
                        parent: selectedCategory.id, // Enviamos el ID de la categoría seleccionada
                    }),
                }
            );

            // Verifica si la respuesta no es exitosa (es decir, código de estado no es 200)
            if (!res.ok) {
                const errorData = await res.json(); // El servidor debe enviar un mensaje en el cuerpo de la respuesta
                // Maneja el error específico para la categoría duplicada


                if (errorData.name && errorData.name.length > 0) {
                    const message = errorData.name[0];
                
                    // Si el mensaje está en inglés, traducirlo manualmente
                    if (message.includes("already exists")) {
                        throw new Error("Ya existe una categoría de producto con este nombre.");
                    }
                
                    throw new Error(message); // Si no es un mensaje conocido, mostrarlo tal cual
                }
                throw new Error("No se pudo agregar la categoría.");
            }

            const addedCategory = await res.json();
            console.log("Categoría agregada correctamente:", addedCategory);

            // Limpiamos los campos del formulario
            resetForm();

            // Limpiamos la categoría seleccionada
            setSelectedCategory({ id: "", name: "" });
            setErrorMessage(""); // Limpiamos el mensaje de error en caso de éxito
        } catch (error) {
            console.error("Error al enviar el formulario:", error.message);
            setErrorMessage(error.message); // Mostrar el mensaje de error específico
        }
    };

    return (
        <div className="p-6 bg-gray-100 h-auto flex justify-center items-start w-full">
            <div className="w-full max-w-2xl bg-white shadow-md rounded-md border border-gray-300 p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            Categoría:
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={values.name}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md py-2 px-3 text-gray-900 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                        />
                    </div>
                    <div className="relative"> {/* Contenedor relativo para el input y las categorías */}
                        <label htmlFor="parent" className="block text-sm font-medium text-gray-700 mb-1">
                            Categoría padre:
                        </label>
                        <input
                            type="text"
                            id="parent"
                            name="parent"
                            value={selectedCategory.name} // Mostrar el nombre de la categoría seleccionada
                            onClick={handleInputClick}
                            onBlur={handleInputBlur}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown} // Detectamos la tecla retroceso
                            className="w-full border border-gray-300 rounded-md py-2 px-3 text-gray-900 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                        />
                        {/* Estilo para el dropdown de categorías */}
                        {showCategories && categories.length > 0 && (
                            <div className="mt-2 max-h-40 overflow-auto border border-gray-300 rounded-md shadow-md bg-white absolute w-full z-10">
                                {categories.slice(0, 4).map(({ id, name }) => (
                                    <div
                                        key={id}
                                        className="flex items-center p-2 cursor-pointer hover:bg-gray-100 text-gray-500"
                                        onClick={() => handleCategorySelect(id, name)} // Pasamos id y name
                                    >
                                        <div className="flex-grow">
                                            <div className="text-sm">{name}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Mostrar mensaje de error si hay uno */}
                    {errorMessage && (
                        <div className="text-red-500 text-sm mt-2">
                            {errorMessage}
                        </div>
                    )}

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-5 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                        >
                            Guardar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
