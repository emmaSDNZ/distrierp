"use client";
import React, { useEffect, useContext, useState } from 'react';
import { ApiUserContext } from "@/shared/context/UserContext";
import DropdownInput from '@/shared/components/DropdownInput';

export default function Sales() {
  const { apiUsuariosProveedoresLista } = useContext(ApiUserContext);
  const [usuarios, setUsuarios] = useState([]);

    useEffect(() => {
    const fetchData = async () => {
        const response = await apiUsuariosProveedoresLista();
        console.log("Respuesta completa de la API:", response);
        setUsuarios(response.results);
    };
    fetchData();
    }, []);

  const handleUserSelect = (user) => {
    console.log("Usuario seleccionado:", user);

  };

  return (
    <div>
      <DropdownInput
        items={usuarios}
        labelKey="nombre_proveedor"
        onSelect={handleUserSelect}
      />
    </div>
  );
}