// Contacto.jsx (componente padre)
"use client";
import React, { useState,useContext, useEffect, use } from "react";
import UsuarioForm from "../../components/contacts/UsuarioForm";
import { ApiUserContext } from "@/shared/context/UserContext";
import InfGeneralProveedor from "../../components/contacts/InfGeneralProveedor";

export default function Proveedor() {
  const [nombre, setNombre] = useState("");
  const [mode, setMode] = useState("create");

  const { apiUsuariProveedorAgregar, apiUsuariosProveedoresLista } = useContext(ApiUserContext);
  useEffect(() => {
    
    const fetchData = async () => {
      const response = await apiUsuariosProveedoresLista();
      console.log("Lista de proveedores:", response);
    };
    fetchData();
  }, []);

  const handleNombreChange = (e) => {
    setNombre(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mode === "create") {
      const newUser = {
        nombre_proveedor: nombre,
      };
      const response = await apiUsuariProveedorAgregar(newUser);
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
        nombrePlaceholder={"Nombre del proveedor"}
        nombre={nombre}
        onNombreChange={handleNombreChange}
        onSubmit={handleSubmit}
        mode={mode}
        informacionGeneral ={ <InfGeneralProveedor />}
      />
    </div>
  );
}
