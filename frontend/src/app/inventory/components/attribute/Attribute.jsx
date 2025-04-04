"use client";
import { useContext, useEffect } from "react";
import { ProductContext } from "@/context/ProductContext";

export default function Attribute() {
  const { attributeName, attributesValues, loading } = useContext(ProductContext);

  if (!attributeName || attributeName.length === 0) {
    return <p>No se encontraron atributos</p>;
  }

  return (
    <div>
      <ul>
        {attributeName.map((attributeName) => (
          <li key={attributeName.id} className="grid grid-cols-5 gap-4 p-3 border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200">
            <div className="text-base text-gray-800">{attributeName.name_attr}</div>
            <div className="text-base text-gray-800">{attributeName.id}</div>
          </li>
        ))}
      </ul>
      <ul>
      <ul>
        {attributesValues.map((attributeValue) => (
          <li key={attributeValue.id} className="grid grid-cols-5 gap-4 p-3 border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200">
            <div className="text-base text-gray-800">{attributeValue.value}</div>
            <div className="text-base text-gray-800">{attributeValue.id}</div>
          </li>
        ))}
      </ul>
      </ul>
    </div>
  );
}