
import React, {act, useEffect,useState} from 'react'
import DeleteIcon from '@mui/icons-material/Delete';
import GeneralInformationForm from './GeneralInformationForm';
import PurchaseForm from './PurchaseForm';


export default function ProductForm({ productDetail, mode, setMode }) {
  const [propertyProduct, setPropertyProduct] = useState(null);
  const [activeTab, setActiveTab] = useState("informacion-general");
  const [deleteHandlerFromChild, setDeleteHandlerFromChild] = useState(null);
  const [nameData, setNameData] = useState({
    name: ""
  });

  const handleOnDoubleClick = (e) => {
    if(mode == "view") {
      setMode("edit")
      }
  }

  const handleProductName = async (e) => {
    if(mode != "view"){

      const newName = e.target.value;
      setNameData({ ...nameData, name: newName });
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    if (productDetail && productDetail.name) {
      setNameData({ name: productDetail.name });
      setPropertyProduct(productDetail);
      console.log("esto es setPropertyProduct", propertyProduct)
    }
  }, [productDetail]);

  const handleDeleteClick = () => {
    if (deleteHandlerFromChild) {
      deleteHandlerFromChild(); // ejecuta función del hijo
    } else {
      console.warn("deleteHandlerFromChild no está definido");
    }
  };


  return (

<div className="p-6 bg-gray-100 h-auto flex justify-center items-start w-full">
  <div className="w-full max-w-4xl bg-white shadow-md rounded-md border border-gray-300 p-8">
    
    {/* Contenedor del encabezado del formulario */}
    <div className="flex justify-between items-center mb-6">
      <div className="text-lg font-medium"></div>

      {/* Botón de eliminar dentro del flujo del formulario */}
      <button
        onClick={handleDeleteClick} // Tu función para eliminar el producto
        className="text-gray-600 hover:text-red-600 transition"
        title="Eliminar producto"
      >
        <DeleteIcon />
      </button>
    </div>

    {/* Nombre del Producto */}
    <div>
      <label
        htmlFor="nombre"
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        Producto:
      </label>
      <input
        type="text"
        id="name"
        name="name"
        placeholder="Nombre del Producto"
        value={nameData.name}
        onChange={handleProductName}
        required
        readOnly={mode === 'view'}
        onDoubleClick={handleOnDoubleClick}
        className={`w-full border-b-2 border-transparent py-3 px-5 text-2xl text-gray-900 focus:outline-none transition-colors duration-200 
          ${mode === 'view' ? 'cursor-default bg-blue-100' : 'focus:border-blue-400 hover:border-blue-200'}`}
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

    {/* Información General */}
    {activeTab === "informacion-general" && (
      <GeneralInformationForm
        setPropertyProduct = {setPropertyProduct}
        nameData={nameData} 
        setNameData={setNameData}
        productDetail={productDetail}
        mode={mode} 
        setMode={setMode}
        setDeleteHandler={setDeleteHandlerFromChild}
      />
    )}

    {activeTab === "compra" && (
      <PurchaseForm propertyProduct={propertyProduct}/>
    )}
  </div>
</div>
  )
}