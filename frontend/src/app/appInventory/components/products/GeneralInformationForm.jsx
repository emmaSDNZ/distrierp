"use client"
import React, {use, useContext, useEffect} from 'react';
import { useRouter } from 'next/navigation'; 
import { ApiProductContext } from "@/shared/context/ProductContext";
import showToast from '@/shared/utils/ToastShow';

export default function GeneralInformationForm({nameData, mode, productDetail, setMode, setDeleteHandler, setPropertyProduct }) {

    const {apiAddProduct, apiProductUpdate, apiProductDelete} = useContext(ApiProductContext)
    const router = useRouter();

    const successProductForm=(data)=>{
        if (data && data.message){
            return showToast.showSuccessToast(data.message)
        }
        else{
            const messageError = "Error al agregar el producto"
            return showToast.showErrorToast(messageError)
        }
    }
    
    const handleSubmit = async (e) => {
      e.preventDefault();
      const formattedData = {
        name: nameData.name
      };
    
      let data;
      if (mode === "edit") {
        data = await apiProductUpdate(productDetail.id, formattedData);
        successProductForm(data);
        setMode("view");
      } else {
        data = await apiAddProduct(formattedData);
        successProductForm(data);
        setPropertyProduct(data);
        console.log("Esto es setPropertyProduct", data)
      }
    };


    useEffect(() => {
      if (setDeleteHandler) {
        setDeleteHandler(() => async () => {
          const data = await apiProductDelete(productDetail.id);
          successProductForm(data);
          
          if (data.success) {
            // Redirigir después de eliminar el producto
            router.push('/appInventory/products?view=new');
          }
        });
      }
    }, [productDetail?.id, setDeleteHandler, router]); // Aseguramos que `router` está en la lista de dependencias
  

  return (
    <div>
    <form  onSubmit={handleSubmit} className="space-y-4">
          {/* Sección de información */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Descripción */}
            <div>
              <label
                htmlFor="descripcion"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Descripción:
              </label>
              <input
                type="text"
                id="descripcion"
                name="descripcion"
                value={""}

                className="w-full border-b-2 border-transparent py-2 px-3 text-gray-900 focus:outline-none focus:border-blue-400 focus:border-b-2 hover:border-blue-200 transition-colors duration-200"
              />
            </div>
            
            {/* Presentación */}
            <div>
              <label
                htmlFor="presentacion"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Presentación:
              </label>
              <input
                type="text"
                id="presentacion"
                name="presentacion"
                value={""}
  
                className="w-full border-b-2 border-transparent py-2 px-3 text-gray-900 focus:outline-none focus:border-blue-400 focus:border-b-2 hover:border-blue-200 transition-colors duration-200"
              />
            </div>
            {/* Precio venta */}
            <div>
              <label
                htmlFor="precio_venta"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Precio venta:
              </label>
              <input
                type="text"
                id="precio_venta"
                name="precio_venta"
                value={""}

                className="w-full border-b-2 border-transparent py-2 px-3 text-gray-900 focus:outline-none focus:border-blue-400 focus:border-b-2 hover:border-blue-200 transition-colors duration-200"
              />
            </div>
            {/* Precio Coste */}
            <div>
              <label
                htmlFor="precio_coste"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Coste:
              </label>
              <input
                type="text"
                id="precio_coste"
                name="precio_coste"
                value={""}

                className="w-full border-b-2 border-transparent py-2 px-3 text-gray-900 focus:outline-none focus:border-blue-400 focus:border-b-2 hover:border-blue-200 transition-colors duration-200"
              />
            </div>
            {/* Referencia */}
            <div>
              <label
                htmlFor="referencia"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Referencia:
              </label>
              <input
                type="text"
                id="referencia"
                name="referencia"
                value={""}

                className="w-full border-b-2 border-transparent py-2 px-3 text-gray-900 focus:outline-none focus:border-blue-400 focus:border-b-2 hover:border-blue-200 transition-colors duration-200"
              />
            </div>

            {/* Codigo de Barra */}
            <div>
              <label
                htmlFor="precio_coste"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Codigo de barras:
              </label>
              <input
                type="text"
                id="cod_barras"
                name="cod_barras"
                value={""}

                className="w-full border-b-2 border-transparent py-2 px-3 text-gray-900 focus:outline-none focus:border-blue-400 focus:border-b-2 hover:border-blue-200 transition-colors duration-200"
              />
            </div>    
            {/*  Codigo Producto Proveedor */}
            <div>
              <label
                htmlFor="precio_coste"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Codigo producto proveedor:
              </label>
              <input
                type="text"
                id="cod_prod_proveedor"
                name="cod_prod_proveedor"
                value={""}
                className="w-full border-b-2 border-transparent py-2 px-3 text-gray-900 focus:outline-none focus:border-blue-400 focus:border-b-2 hover:border-blue-200 transition-colors duration-200"
              />
            </div>
            {/*  Codigo NCM */}
            <div>
              <label
                htmlFor="precio_coste"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Codigo NCM:


              </label>
              <input
                type="text"
                id="cod_ncm"
                name="cod_ncm"
                value={""}

                className="w-full border-b-2 border-transparent py-2 px-3 text-gray-900 focus:outline-none focus:border-blue-400 focus:border-b-2 hover:border-blue-200 transition-colors duration-200"
              />
            </div>
          </div>
          {/* Mensaje de error si existe */}

          {/* Botón de acción */}
          <div className="flex justify-end pt-4">
          <button
              type="submit"
              className={`mt-4 py-2 px-6 rounded-md transition-opacity duration-300 ${
                mode === "view" ? "opacity-0 pointer-events-none" : "bg-blue-500 text-white"
              }`}
            >
              {mode === "edit" ? "Actualizar" : "Agregar"}
          </button>
          </div>
        </form>
        
    </div>
  )
}
