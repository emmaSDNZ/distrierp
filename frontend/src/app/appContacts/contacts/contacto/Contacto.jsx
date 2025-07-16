// Contacto.jsx (componente padre)
"use client";
import React, { useState,useContext, useEffect } from "react";
import UsuarioForm from "../../components/contacts/UsuarioForm";
import { ApiUserContext } from "@/shared/context/UserContext";

export default function Contacto() {
  const [nombre, setNombre] = useState("");
  const [mode, setMode] = useState("create");

  const { apiUsuarioAgregar } = useContext(ApiUserContext);

  const handleNombreChange = (e) => {
    setNombre(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mode === "create") {
      const newUser = {
        nombre_usuario: nombre,
      };
      const response = await apiUsuarioAgregar(newUser);
      if (response) {
        //setNombre("");
        console.log("Usuario agregado:", response);
      } else {
        console.error("Error al agregar el usuario");
      }
      console.log("Agregado:", nombre);
      setMode("create"); 
    } 
  };

  return (
    <div>
      <UsuarioForm
        nombrePlaceholder={"Nombre del contacto"}
        nombre={nombre}
        onNombreChange={handleNombreChange}
        onSubmit={handleSubmit}
        mode={mode}
      />
    </div>
  );
}
