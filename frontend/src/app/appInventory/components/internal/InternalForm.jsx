"use client";
import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import showToast from "../../../../shared/utils/ToastShow";
import InternalCard from "./InternalCard";

export default function InternalForm({ file }) {
  const [headers, setHeaders] = useState();

  useEffect(() => {
    if (!file) return;

    const toastId = showToast.showLoadingToast();

    const processFile = async () => {
      try {
        const reader = new FileReader();

        reader.onload = async (e) => {
          const dataArray = new Uint8Array(e.target.result);
          const workbook = XLSX.read(dataArray, { type: "array" });

          const sheet = workbook.Sheets[workbook.SheetNames[0]];
          const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
          const firstRow = rows[0] || [];
          setHeaders(firstRow);

          showToast.hideLoadingToast(toastId);
          showToast.showSuccessToast("Archivo procesado correctamente");
        };

        reader.onerror = () => {
          showToast.hideLoadingToast(toastId);
          showToast.showErrorToast("Error al leer el archivo");
        };

        reader.readAsArrayBuffer(file);
      } catch (error) {
        showToast.hideLoadingToast(toastId);
        showToast.showErrorToast("Error al procesar el archivo");

      }
    };
    processFile();
  }, [file]);

  return (
    <InternalCard headers={headers} file={file}/>
  );
}
