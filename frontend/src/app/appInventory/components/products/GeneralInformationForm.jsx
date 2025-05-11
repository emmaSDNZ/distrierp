"use client"
import React, {useState, useContext, useEffect} from 'react';
import { useRouter } from 'next/navigation'; 
import { ApiProductContext } from "@/shared/context/ProductContext";
import showToast from '@/shared/utils/ToastShow';

export default function GeneralInformationForm({nameData, mode, productDetail, setMode, setDeleteHandler, setPropertyProduct }) {
  
    const {apiAddProduct, apiProductUpdate, apiProductDelete} = useContext(ApiProductContext)
    const router = useRouter();
    const isReadOnly = mode === 'view';
    const [formData, setFormData] = useState({
      description : "",
      presentation: "",
      price: 0,
      price_sale: 0,
      price_cost: 0,
      reference_code: "",
      bar_code: "",
      internal_code: "",
      proveedor_code: "",
      ncm_code: "", 
      niprod_code: "", 
    })

    const handleChange= e=>{
      const { name, value } = e.target;

      setFormData({
        ...formData,
        [name]: value
      })
    }

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
        ...formData,
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
  
    useEffect(() => {
      console.log('productDetail', productDetail); // Verifica que `productDetail` tenga los valores correctos
      if (productDetail) {

        setFormData({
          description: productDetail.description || "",
          presentation: productDetail.presentation || "",
          price: productDetail.price || "",
          price_sale: productDetail.price_sale || "",
          price_cost: productDetail.price_cost || "",
          reference_code: productDetail.reference_code || "",
          bar_code: productDetail.bar_code || "",
          internal_code: productDetail.internal_code || "",
          proveedor_code: productDetail.proveedor_code || "",
          ncm_code: productDetail.ncm_code || "",
          niprod_code: productDetail.niprod_code || "",
        });
      }
    }, [productDetail]); 

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
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                readOnly={isReadOnly}

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
                id="presentation"
                name="presentation"
                value={formData.presentation}
                onChange={handleChange}
                readOnly={isReadOnly}
  
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
                type="number"
                id="price_sale"
                name="price_sale"
                value={formData.price_sale}
                onChange={handleChange}
                readOnly={isReadOnly}
                className="w-full border-b-2 border-transparent py-2 px-3 text-gray-900 focus:outline-none focus:border-blue-400 focus:border-b-2 hover:border-blue-200 transition-colors duration-200"
              />
            </div>

            {/* Precio Coste */}
            <div>
              <label
                htmlFor="precio_coste"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Precio coste:
              </label>
              <input
                type="number"
                id="price_cost"
                name="price_cost"
                value={formData.price_cost}
                onChange={handleChange}
                readOnly={isReadOnly}
                className="w-full border-b-2 border-transparent py-2 px-3 text-gray-900 focus:outline-none focus:border-blue-400 focus:border-b-2 hover:border-blue-200 transition-colors duration-200"
              />
            </div>

            {/* Precio*/}
            <div>
              <label
                htmlFor="precio_coste"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Precio:
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                readOnly={isReadOnly}

                className="w-full border-b-2 border-transparent py-2 px-3 text-gray-900 focus:outline-none focus:border-blue-400 focus:border-b-2 hover:border-blue-200 transition-colors duration-200"
              />
            </div>

            {/* Referencia */}
            <div>
              <label
                htmlFor="referencia"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Codigo de referencia:
              </label>
              <input
                type="text"
                id="reference_code"
                name="reference_code"
                value={formData.reference_code}
                onChange={handleChange}
                readOnly={isReadOnly}

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
                id="bar_code"
                name="bar_code"
                value={formData.bar_code}
                onChange= {handleChange}
                readOnly={isReadOnly}

                className="w-full border-b-2 border-transparent py-2 px-3 text-gray-900 focus:outline-none focus:border-blue-400 focus:border-b-2 hover:border-blue-200 transition-colors duration-200"
              />

            </div>    
            {/*  Codigo interno del producto */}
            <div>
              <label
                htmlFor="precio_coste"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Codigo interno del producto:
              </label>
              <input
                type="text"
                id="internal_code"
                name="internal_code"
                value={formData.internal_code}
                onChange={handleChange}
                readOnly={isReadOnly}
                className="w-full border-b-2 border-transparent py-2 px-3 text-gray-900 focus:outline-none focus:border-blue-400 focus:border-b-2 hover:border-blue-200 transition-colors duration-200"
              />
            </div>
            {/*  Codigo interno del proveedor */}
            <div>
              <label
                htmlFor="precio_coste"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Codigo interno del proveedor:


              </label>
              <input
                type="text"
                id="proveedor_code"
                name="proveedor_code"
                value={formData.proveedor_code}
                onChange={handleChange}
                readOnly={isReadOnly}

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
                id="ncm_code"
                name="ncm_code"
                value={formData.ncm_code}
                onChange={handleChange}
                readOnly={isReadOnly}
                className="w-full border-b-2 border-transparent py-2 px-3 text-gray-900 focus:outline-none focus:border-blue-400 focus:border-b-2 hover:border-blue-200 transition-colors duration-200"
              />
            </div>

                        {/*   Codigo niprod */}
            <div>
              <label
                htmlFor="precio_coste"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Codigo Niprod:


              </label>
              <input
                type="text"
                id="niprod_code"
                name="niprod_code"
                value={formData.niprod_code}
                onChange={handleChange}
                readOnly={isReadOnly}
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
