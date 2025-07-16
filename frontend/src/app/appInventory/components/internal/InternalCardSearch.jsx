'use client';
import React, { useContext } from 'react';
import InputSugerenciasVisual from '@/shared/components/ui/InputSugerenciasVisual';
import { ApiUserContext } from '@/shared/context/UserContext';

export default function InternalCardSearch({onSelect}) {
  const { apiUsuariosProveedoresListaSearch } = useContext(ApiUserContext);
  return (
    <div className="p-4">
      <InputSugerenciasVisual
        placeholder="Nombre proveedor."
        fetchSugerencias={apiUsuariosProveedoresListaSearch}
        onSelect={onSelect}
        //onCreate={(nombre) => console.log('Crear nuevo proveedor:', nombre)}
      />
    </div>
  );
}
