
import React, {useEffect,useState} from 'react'
import GeneralInformationForm from './GeneralInformationForm';
import PurchaseForm from '../purchase/PurchaseForm';
import AuditTrail from '../movement/AuditTrail';
import Sales from './Sales';
import FormTabs from '@/shared/components/entityForm/FormTabs';
import FormInput from '@/shared/components/entityForm/FormInput';


export default function ProductForm({isMode, setIsMode, productData}) {

    const [mode, setMode] =useState("create")
    const isViewMode = mode === "view"
    const isEditMode = mode === "edit"
    const isCreateMode = mode === "create"
    const isEditable = isEditMode || isCreateMode;
    const [producto, setProducto] = useState([])

    const [productoPrecios, setProductosPrecios] = useState(null);
    const [activeTab, setActiveTab] = useState("informacion-general");
    const [nameData, setNameData] = useState({nombre_base_producto:""});
    
    useEffect(() => {
    
        if (!productData || !productData.data) {
        console.log("⏳ Esperando productData...");
        return;
       }

      const { success, message, data } = productData;

      const {
        id_producto_template,
        id_producto_producto,
        nombre_base_producto,
        producto_productos,
      } = data;


      console.log("✅ Producto desestructurado:", {
        id_producto_template,
        nombre_base_producto,
        id_producto_producto,
        producto_productos,
      });
      setProducto(producto_productos)      

      if (productData) {
        setMode("view")
        setNameData({ nombre_base_producto: nombre_base_producto });
      } else{
        setMode("create")
        setNameData({nombre_base_producto:""})
        setProductosPrecios(null)
      }
    }, [productData]);

  const handleOnDoubleClick = () => {
    if(isViewMode) {
      setMode("edit")
    }}

  const handleProductName = async (e) => {
    if(isEditable){
      const newName = e.target.value;
      setNameData({ ...nameData, nombre_base_producto: newName });
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };


    const classNameInputNombre = `w-full border-b-2 border-transparent py-3 px-5 text-2xl text-gray-900 focus:outline-none transition-colors duration-200 
        ${isViewMode? 'cursor-default bg-blue-100' : 'focus:border-blue-400 hover:border-blue-200'}`

  return (
    <div className="p-6 bg-gray-100 h-auto flex justify-center items-start w-full">
      <div className="w-full max-w-4xl bg-white shadow-md rounded-md border border-gray-300 p-8">
      
        {/* Nombre del Producto */}
        <FormInput
          label="Producto"
          type="text"
          id={nameData.nombre_base_producto}
          name={nameData.nombre_base_producto}
          placeholder="Ej: Camiseta de Algodón"
          value={nameData.nombre_base_producto}
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
            productoProductoData = {productData?.data}
            nameData={nameData} 
            setNameData={setNameData}
            mode={mode} 
            setMode={setMode}
          />
        )}

        {activeTab === "compra" && (
          <PurchaseForm 
          propertyProduct={productoPrecios}
          idProducto ={producto[0].id_producto_producto}/>
        )}
        {activeTab === "ventas" && (
          <Sales
          idProducto ={producto[0].id_producto_producto}
          />
        )}
        {activeTab === "auditoria" && (
          <AuditHistory productDetail={productPrecios}/>
        )}

      </div>
    </div>
  )
}