"use client";
import React, { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";

export default function UsuarioForm({ nombrePlaceholder, nombre, onNombreChange, onSubmit, mode, informacionGeneral }) {
  const [activeTab, setActiveTab] = useState("informacion-general");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="p-6 bg-gray-100 h-auto flex justify-center items-start w-full">
        <div className="w-full max-w-4xl bg-white shadow-md rounded-md border border-gray-300 p-8">
          
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="text-lg font-medium"></div>
            <button
              type="button"
              onClick={() => console.log("Eliminar contacto")}
              className="text-gray-600 hover:text-red-600 transition"
              title="Eliminar CONTACTO"
            >
              <DeleteIcon />
            </button>
          </div>

          {/* Campo nombre del contacto */}
          <div>
            <label
              htmlFor="nombre"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Contacto
            </label>

            <input
              type="text"
              id="nombre"
              name="nombre"
              value={nombre}
              onChange={onNombreChange}
              placeholder={nombrePlaceholder || "Nombre..."}
              className="w-full border-b-2 border-transparent py-3 px-5 text-2xl text-gray-900 focus:outline-none transition-colors duration-200 focus:border-blue-400 hover:border-blue-200"
            />
          </div>

          {/* Tabs */}
          <div className="tabs-container mb-6 mt-4">
            <ul className="flex space-x-4 border-b-2 border-gray-300">
              {["informacion-general", "detalles", "auditoria"].map((tab) => (
                <li
                  key={tab}
                  className={`px-4 py-2 cursor-pointer text-sm font-medium border-b-2 transition-all ${
                    activeTab === tab
                      ? "border-blue-500 text-blue-500"
                      : "border-transparent text-gray-700 hover:border-gray-300 hover:text-gray-900"
                  }`}
                  onClick={() => handleTabChange(tab)}
                >
                  {tab === "informacion-general"
                    ? "Información General"
                    : tab === "detalles"
                    ? "Detalles Adicionales"
                    : "Auditoría"}
                </li>
              ))}
            </ul>
          </div>

          {/* Contenido de pestañas */}
          <div className="mt-4">
            {/* Informacion general*/}
              {activeTab === "informacion-general" && (
                <div className="mt-4 w-full">
                  <p className="text-gray-600 mb-2">Formulario de información general:</p>
                  <div className="w-full max-w-3xl mx-auto">
                    {informacionGeneral}
                  </div>
                </div>
              )}

              
            {activeTab === "detalles" && (
              <p className="text-gray-600">Formulario de detalles adicionales...</p>
            )}
            {activeTab === "auditoria" && (
              <p className="text-gray-600">Registro de auditoría del contacto...</p>
            )}
          </div>

          {/* Botón Guardar/Actualizar */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="mt-4 py-2 px-6 rounded-md transition-opacity duration-300 bg-blue-500 text-white"
            >
              {mode === "edit" ? "Actualizar" : "Agregar"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
