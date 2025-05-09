"use client";

import React, { useEffect, useContext } from "react";
import Link from "next/link";
import { ApiProductContext } from "@/shared/context/ProductContext";
import ProductCard from "./ProductCard";

export default function ProductsList() {
  const { productsList, apiProductList } = useContext(ApiProductContext);


  useEffect(() => {
    apiProductList(); 
    console.log(productsList)
  }, [apiProductList]);


  if (!productsList || productsList.length === 0) {
    return <p>Cargando datos...</p>;
  }

  return (
    <div>
      {productsList.map((product) => (
       <Link key= {product.id}  href={`/appInventory/products/${product.id}`} >
        <ProductCard key={product.id} product={product} /> 
       </Link>
      ))}
    </div>
  );
}

