"use client";
import React, { useState } from 'react';
import ProductsList from '../components/products/ProductList';
import ProductForm from '../components/products/ProductForm';
import EntityButton from '@/shared/components/entityGeneral/EntityButton';

export default function ProductPage() {
  const isListMode = "list";  
  const isViewMode = "view";
  const isEditMode = "edit";
  const isCreateMode = "create";

  const [isMode, setIsMode] = useState(isListMode);

  function handleToggleCreateList() {
    if (isMode === isListMode) {
      setIsMode(isCreateMode);
    } else {
      setIsMode(isListMode);
    }
  }

  if (isMode === isListMode) {
    return (
      <div>
        <EntityButton
          title="Agregar"
          onClick={handleToggleCreateList}
        />
        <ProductsList />
      </div>
    );
  }

  if (isMode === isCreateMode) {
    return (
      <div>
        <EntityButton
          title="Volver a la lista"
          onClick={handleToggleCreateList}
        />
        <ProductForm isMode={isCreateMode} setIsMode={setIsMode} />
      </div>
    );
  }

  
  if (isMode === isViewMode) {
    return (
      <div>
        <p>Vista de producto</p>
        <EntityButton
          title="Volver a la lista"
          onClick={() => setIsMode(isListMode)}
        />
      </div>
    );
  }

  return <div>Error: modo inválido</div>;
}
