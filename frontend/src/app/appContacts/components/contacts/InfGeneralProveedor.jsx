"use client";

import React, { useEffect, useContext, useState } from 'react';
import { ApiUserContext } from "@/shared/context/UserContext";
import DropdownInput from '@/shared/components/DropdownInput';

export default function InfGeneralProveedor() {
  const { apiUsuariosLista } = useContext(ApiUserContext);
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await apiUsuariosLista();
      const usuariosActivos = response.results.filter((user) => user.activo);
      setUsuarios(usuariosActivos);
    };
    fetchData();
  }, []);

  const handleUserSelect = (user) => {
    console.log("Usuario seleccionado:", user);
    // Aquí puedes guardar en un estado padre si lo necesitas
  };

  return (
    <div>
      <DropdownInput
        items={usuarios}
        labelKey="nombre_usuario"
        onSelect={handleUserSelect}
      />
    </div>
  );
}