import React, { useEffect, useState } from 'react';
import GeneralInformationForm from './GeneralInformationForm';
import PurchaseForm from '../purchase/PurchaseForm';
import AuditTrail from '../movement/AuditTrail';
import Sales from './Sales';
import FormTabs from '@/shared/components/entityForm/FormTabs';
import FormInput from '@/shared/components/entityForm/FormInput';

export default function ProductForm({ isMode, setIsMode, productData }) {
  const [mode, setMode] = useState("create");
  const isViewMode = mode === "view";
  const isEditMode = mode === "edit";
  const isCreateMode = mode === "create";
  const isEditable = isEditMode || isCreateMode;

  const [activeTab, setActiveTab] = useState("informacion-general");
  const [productoTemplate, setProductoTemplate] = useState(null);
  
  const formatoProductoTemplate = {
  id_producto_template: null,
  nombre_base_producto: "",
  principio_activo: "",
  create_date: null,
};
useEffect(() => {
  if (!productData || Object.keys(productData).length === 0) {
    setMode("create");
    setProductoTemplate(formatoProductoTemplate);
    return;
  }

  setMode("view");
  setProductoTemplate(productData.producto_template || formatoProductoTemplate);
}, [productData]);

  const handleOnDoubleClick = () => {
    if (isViewMode) {
      setMode("edit");
    }
  };

  const handleProductName = async (e) => {
    if (isEditable) {
      const newName = e.target.value;
      setProductoTemplate({ ...productoTemplate, nombre_base_producto: newName });
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const classNameInputNombre = `w-full border-b-2 border-transparent py-3 px-5 text-2xl text-gray-900 focus:outline-none transition-colors duration-200 
    ${isViewMode ? 'cursor-default bg-blue-100' : 'focus:border-blue-400 hover:border-blue-200'}`;

  if (!productoTemplate) {
    return <p>Cargando producto...</p>;
  }

  return (
    <div className="p-6 bg-gray-100 h-auto flex justify-center items-start w-full">
      <div className="w-full max-w-4xl bg-white shadow-md rounded-md border border-gray-300 p-8">

        {/* Nombre del Producto */}
        <FormInput
          label="Producto"
          type="text"
          id={productoTemplate.nombre_base_producto}
          name={productoTemplate.nombre_base_producto}
          placeholder="Ej: Camiseta de Algodón"
          value={productoTemplate.nombre_base_producto}
          onChange={handleProductName}
          required
          readOnly={isViewMode}
          onDoubleClick={handleOnDoubleClick}
          className={classNameInputNombre}
        />

        <FormTabs
          activeTab={activeTab}
          handleTabChange={handleTabChange}
        />

        {/* Información General */}
        {activeTab === "informacion-general" && (
          <GeneralInformationForm
            productData={productData}
            nameData={productoTemplate}
            setNameData={setProductoTemplate}
            mode={mode}
            setMode={setMode}
          />
        )}

        {activeTab === "compra" && (
          <PurchaseForm
            propertyProduct={productoPrecios}
            idProducto={productData?.producto_productos?.id_producto_producto}
          />
        )}

        {activeTab === "ventas" && (
          <Sales
            idProducto={productData?.producto_productos?.id_producto_producto}
          />
        )}

        {activeTab === "auditoria" && (
          <AuditTrail productDetail={productoPrecios} />
        )}

      </div>
    </div>
  );
}
