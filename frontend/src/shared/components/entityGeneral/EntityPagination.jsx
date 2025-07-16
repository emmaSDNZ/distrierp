import React, { useContext } from "react";
import { ApiProductContext } from "@/shared/context/ProductContext";
import EntityButton from "../entityGeneral/EntityButton";

export default function EntityPagination({nextUrl, prevUrl,onPageChange}) {

  async function handlePagination(url) {
    if (url && onPageChange) {
      await onPageChange(url);
    }
  };

  function prevPagination(prevUrl){
    return handlePagination(prevUrl)
  }
  return (
    <div className="flex items-center gap-2 flex-shrink-0 min-w-[200px]">
      <EntityButton
        title="Anterior"
        onClick={() => handlePagination(prevUrl)}
        disabled={!prevUrl}
      />
      <EntityButton
        title="Siguiente"
        onClick={() => handlePagination(nextUrl)}
        disabled={!nextUrl}
        className="px-4 bg-blue-400 text-white rounded-md disabled:opacity-50 hover:bg-blue-500 active:bg-blue-400"
        style={{ height: "38px", minWidth: "90px" }}
      />
    </div>
  );
}
