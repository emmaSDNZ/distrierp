"use client"
import React, {useContext, useEffect, useState} from 'react'
import { useParams } from 'next/navigation'
import { ApiProductContext } from '@/shared/context/ProductContext';
import ProductForm from '../../components/products/ProductForm';

export default function Id_Product() {
    const {id_product} = useParams();
    const {productDetail, apiProductDetail} = useContext(ApiProductContext)
    const [mode, setMode] = useState("view")

    useEffect(() => {
        apiProductDetail(id_product); 
      }, [apiProductDetail]);


    if(!productDetail){
        return <p>Cargando detalle del producto...</p>
    }
    
  return (
    <ProductForm productDetail={productDetail} mode={mode} setMode={setMode}/>
  
  )
}

/*
      <ProductForm/>
      <h2>Detalle del Producto</h2>
      <p>Nombre: {productDetail.name}</p>
      <p>Precio: {productDetail.price}</p>

*/
