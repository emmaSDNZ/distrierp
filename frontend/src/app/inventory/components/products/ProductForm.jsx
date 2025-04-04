"use client";
import React, { use, useContext, useEffect, useState } from "react";
import { UseForm } from "../UserForm";
import { ProductContext } from "@/context/ProductContext";
import AttributesVariants from "./AttributesVariants";

export default function ProductForm({ productToEdit }) {
  const [productId, setProductId] = useState(null);
  const { addProduct, updateProduct, loading, error } = useContext(ProductContext);
  const [activeTab, setActiveTab] = useState("informacion-general");
  const { values, handleChange, resetForm, setValues } = UseForm({
    nombre: "",
    descripcion: "",
    presentacion: "",
    tipo: "1",
    precio_venta: "",
    precio_coste: "",
    referencia: "",
    cod_barras: "",
    cod_prod_proveedor: "",
    cod_ncm: "",
  });

  const [categories, setCategories] = useState([]);
  const [showCategories, setShowCategories] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState({ id: "", name: "" });

  const getCategories = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api_distrimed_inventario/category/`
      );
      if (!res.ok) {
        throw new Error("No se pudo cargar las categorías.");
      }
      const data = await res.json();
      setCategories(data);
      console.log("Categorías cargadas:", data);
    } catch (error) {
      console.error("Error al cargar las categorías:", error.message);
    }
  };

  useEffect(() => {
    getCategories();
    if (productToEdit) {
      setSelectedCategory({
        id: productToEdit.categoria_id,
        name: productToEdit.categoria_name,
      });
      setValues({
        nombre: productToEdit.nombre || "",
        descripcion: productToEdit.descripcion || "",
        presentacion: productToEdit.presentacion || "",
        tipo: productToEdit.tipo_producto_id?.toString() || "1", // Asegúrate de manejar nulos
        precio_venta: productToEdit.precio_venta?.precio_venta?.toString() || "", // Maneja nulos
        precio_coste: productToEdit.precio_coste?.precio_coste?.toString() || "", // Maneja nulos
        referencia: productToEdit.referencia || "",
        cod_barras: productToEdit.cod_barras || "",
        cod_prod_proveedor: productToEdit.cod_prod_proveedor || "",
        cod_ncm: productToEdit.cod_ncm || "",
      });
    }
  }, [productToEdit]);


    // Muestra el drop-down de categorías al hacer clic en el input
    const handleCategoryInputClick = () => {
      setShowCategories(true);
    };
  
  
    // Cuando se selecciona una categoría, se actualiza el estado y se oculta el menú
    const handleCategorySelect = (id, name) => {
      console.log("Categoría seleccionada:", { id, name });
      setSelectedCategory({ id, name });
      setShowCategories(false);
    };
  
  
    // Para ocultar el menú cuando se pierde el foco (con un pequeño delay para permitir el click)
    const handleCategoryInputBlur = () => {
      setTimeout(() => {
        setShowCategories(false);
      }, 200);
    };
  
  
    // Para manejar la tecla retroceso (backspace): si se presiona, se limpia la categoría pero se mantiene el menú
    const handleCategoryInputKeyDown = (e) => {
      if (e.key === "Backspace") {
        setSelectedCategory({ id: "", name: "" });
        setShowCategories(true);
      }
    };
  
  // Manejo de cambio de pestaña
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Manejo del envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Enviando datos del formulario:", values);
    console.log("Categoría seleccionada:", selectedCategory);

    // Formatear los datos antes de enviar
    const formattedData = {
        nombre: values.nombre,
        descripcion: values.descripcion,
        presentacion: values.presentacion,
        done: true,
        tipo_producto_id: Number(values.tipo),
        categoria_id: Number(selectedCategory.id),
        precio: { precio: parseFloat(values.precio_coste) || 0 },
        precio_venta: { precio_venta: parseFloat(values.precio_venta) || 0 },
        precio_coste: { precio_coste: parseFloat(values.precio_coste) || 0 },
        referencia: values.referencia,
        cod_barras: values.cod_barras,
        cod_prod_interno: values.cod_prod_proveedor,
        cod_prod_proveedor: values.cod_prod_proveedor,
        cod_ncm: values.cod_ncm,
    };

    if (productToEdit) {
        // Si es una edición (PUT), actualizamos sin resetear el formulario
        await updateProduct(productToEdit.id, formattedData);
        console.log("Valores después de updateProduct:", values);
    } else {
        // Si es una creación (POST), agregamos el producto y limpiamos el formulario
        const data = await addProduct(formattedData);
        console.log("data desde post", data)
        setProductId(data.id);
        console.log(data.id)
        resetForm(); 
        setSelectedCategory({ id: "", name: "" });
    }
};

  return (
    <div className="p-6 bg-gray-100 h-auto flex justify-center items-start w-full">
      <div className="w-full max-w-4xl bg-white shadow-md rounded-md border border-gray-300 p-8">
      <h1 className="text-xl font-semibold text-gray-800 border-b pb-3 mb-4">
          {productToEdit ? "Actualizar Producto" : "Formulario de Producto"}
        </h1>
        {/* Nombre del Prdocucto*/}
        <div>
  <label
    htmlFor="nombre"
    className="block text-sm font-medium text-gray-700 mb-2"
  >
    Producto:
  </label>
  <input
    type="text"
    id="nombre"
    name="nombre"
    placeholder="Nombre del Producto"
    value={values.nombre || ""}
    onChange={handleChange}
    className="w-full border-b-2 border-transparent py-3 px-5 text-2xl text-gray-900 focus:outline-none focus:border-blue-400 focus:border-b-2 hover:border-blue-200 transition-colors duration-200"
  />
</div>



        {/* Pestañas */}
        <div className="tabs-container mb-6">
          <ul className="flex space-x-4 border-b-2 border-gray-300">
            <li
              className={`px-4 py-2 cursor-pointer text-sm font-medium border-b-2 transition-all ${activeTab === "informacion-general" ? "border-blue-500 text-blue-500" : "border-transparent text-gray-700 hover:border-gray-300 hover:text-gray-900"}`}
              onClick={() => handleTabChange("informacion-general")}
            >
              Información General
            </li>
            <li
              className={`px-4 py-2 cursor-pointer text-sm font-medium border-b-2 transition-all ${activeTab === "atributos-variantes" ? "border-blue-500 text-blue-500" : "border-transparent text-gray-700 hover:border-gray-300 hover:text-gray-900"}`}
              onClick={() => handleTabChange("atributos-variantes")}
            >
              Atributos y Variantes
            </li>
            <li
              className={`px-4 py-2 cursor-pointer text-sm font-medium border-b-2 transition-all ${activeTab === "ventas" ? "border-blue-500 text-blue-500" : "border-transparent text-gray-700 hover:border-gray-300 hover:text-gray-900"}`}
              onClick={() => handleTabChange("ventas")}
            >
              Ventas
            </li>
            <li
              className={`px-4 py-2 cursor-pointer text-sm font-medium border-b-2 transition-all ${activeTab === "compra" ? "border-blue-500 text-blue-500" : "border-transparent text-gray-700 hover:border-gray-300 hover:text-gray-900"}`}
              onClick={() => handleTabChange("compra")}
            >
              Compra
            </li>
            <li
              className={`px-4 py-2 cursor-pointer text-sm font-medium border-b-2 transition-all ${activeTab === "inventario" ? "border-blue-500 text-blue-500" : "border-transparent text-gray-700 hover:border-gray-300 hover:text-gray-900"}`}
              onClick={() => handleTabChange("inventario")}
            >
              Inventario
            </li>
          </ul>
        </div>

        {/* Contenido del formulario */}
        {activeTab === "informacion-general" && (
          <form onSubmit={handleSubmit} className="space-y-4">
          {/* Sección de información */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
          {/* Tipo de Producto (Radio Buttons) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Producto:
            </label>
            <div className="flex flex-wrap space-x-4">
              {[
                { label: "Consumible", value: "1" },
                { label: "Servicio", value: "2" },
                { label: "Almacenble", value: "3" },
              ].map(({ label, value }) => (
                <label key={value} className="flex items-center space-x-2 mb-2">
                  <input
                    type="radio"
                    name="tipo"
                    value={value}
                    checked={values.tipo === value}
                    onChange={handleChange}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{label}</span>
                </label>
              ))}
            </div>
          </div>
        
            {/* Descripción */}
            <div>
              <label
                htmlFor="descripcion"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Descripción:
              </label>
              <input
                type="text"
                id="descripcion"
                name="descripcion"
                value={values.descripcion || ""}
                onChange={handleChange}
                className="w-full border-b-2 border-transparent py-2 px-3 text-gray-900 focus:outline-none focus:border-blue-400 focus:border-b-2 hover:border-blue-200 transition-colors duration-200"
              />
            </div>
            {/* Presentación */}
            <div>
              <label
                htmlFor="presentacion"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Presentación:
              </label>
              <input
                type="text"
                id="presentacion"
                name="presentacion"
                value={values.presentacion || ""}
                onChange={handleChange}
                className="w-full border-b-2 border-transparent py-2 px-3 text-gray-900 focus:outline-none focus:border-blue-400 focus:border-b-2 hover:border-blue-200 transition-colors duration-200"
              />
            </div>
            {/* Precio venta */}
            <div>
              <label
                htmlFor="precio_venta"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Precio venta:
              </label>
              <input
                type="text"
                id="precio_venta"
                name="precio_venta"
                value={values.precio_venta || ""}
                onChange={handleChange}
                className="w-full border-b-2 border-transparent py-2 px-3 text-gray-900 focus:outline-none focus:border-blue-400 focus:border-b-2 hover:border-blue-200 transition-colors duration-200"
              />
            </div>
            {/* Precio Coste */}
            <div>
              <label
                htmlFor="precio_coste"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Coste:
              </label>
              <input
                type="text"
                id="precio_coste"
                name="precio_coste"
                value={values.precio_coste || ""}
                onChange={handleChange}
                className="w-full border-b-2 border-transparent py-2 px-3 text-gray-900 focus:outline-none focus:border-blue-400 focus:border-b-2 hover:border-blue-200 transition-colors duration-200"
              />
            </div>
            {/* Referencia */}
            <div>
              <label
                htmlFor="referencia"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Referencia:
              </label>
              <input
                type="text"
                id="referencia"
                name="referencia"
                value={values.referencia || ""}
                onChange={handleChange}
                className="w-full border-b-2 border-transparent py-2 px-3 text-gray-900 focus:outline-none focus:border-blue-400 focus:border-b-2 hover:border-blue-200 transition-colors duration-200"
              />
            </div>

            {/* Codigo de Barra */}
            <div>
              <label
                htmlFor="precio_coste"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Codigo de barras:
              </label>
              <input
                type="text"
                id="cod_barras"
                name="cod_barras"
                value={values.cod_barras || ""}
                onChange={handleChange}
                className="w-full border-b-2 border-transparent py-2 px-3 text-gray-900 focus:outline-none focus:border-blue-400 focus:border-b-2 hover:border-blue-200 transition-colors duration-200"
              />
            </div>    
            {/*  Codigo Producto Proveedor */}
            <div>
              <label
                htmlFor="precio_coste"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Codigo producto proveedor:
              </label>
              <input
                type="text"
                id="cod_prod_proveedor"
                name="cod_prod_proveedor"
                value={values.cod_prod_proveedor || ""}
                onChange={handleChange}
                className="w-full border-b-2 border-transparent py-2 px-3 text-gray-900 focus:outline-none focus:border-blue-400 focus:border-b-2 hover:border-blue-200 transition-colors duration-200"
              />
            </div>
            {/*  Codigo NCM */}
            <div>
              <label
                htmlFor="precio_coste"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Codigo NCM:


              </label>
              <input
                type="text"
                id="cod_ncm"
                name="cod_ncm"
                value={values.cod_ncm || ""}
                onChange={handleChange}
                className="w-full border-b-2 border-transparent py-2 px-3 text-gray-900 focus:outline-none focus:border-blue-400 focus:border-b-2 hover:border-blue-200 transition-colors duration-200"
              />
            </div>
          </div>


          {/* Sección para seleccionar la categoría */}
          <div className="relative">
            <label
              htmlFor="categoria"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Categoría:
            </label>
            <input
              type="text"
              id="categoria"
              name="categoria"
              value={selectedCategory.name}
              onClick={handleCategoryInputClick}
              onBlur={handleCategoryInputBlur}
              onKeyDown={handleCategoryInputKeyDown}
              readOnly
              placeholder="Seleccione una categoría"
              className="w-full border-b-2 border-transparent py-2 px-3 text-gray-900 focus:outline-none focus:border-blue-400 focus:border-b-2 hover:border-blue-200 transition-colors duration-200"
            />
            {/* Drop-down de categorías (máximo 6) */}
            {showCategories && categories.length > 0 && (
              <div className="mt-2 max-h-40 overflow-auto border border-gray-300 rounded-md shadow-md bg-white absolute w-full z-10">
                {categories.slice(0, 6).map(({ id, name }) => (
                  <div
                    key={id}
                    className="flex items-center p-2 cursor-pointer hover:bg-gray-100 text-gray-500"
                    onClick={() => handleCategorySelect(id, name)}
                  >
                    <div className="flex-grow">
                      <div className="text-sm">{name}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>




          {/* Mensaje de error si existe */}
          {/* Aquí podrías agregar un estado de error si fuera necesario */}


          {/* Botón de acción */}
          <div className="flex justify-end pt-4">
          <button
              type="submit"
              className="mt-4 py-2 px-6 bg-blue-500 text-white rounded-md"
              disabled={loading}
            >
              {loading ? "Guardando..." : productToEdit ? "Actualizar Producto" : "Añadir Producto"}
            </button>
          </div>
        </form>
        )}


      {activeTab === "atributos-variantes" && (
        <AttributesVariants  productId={productId}  />
      )}

        {/* Puedes agregar contenido adicional para las otras pestañas si es necesario */}
      </div>
    </div>
  );
}
