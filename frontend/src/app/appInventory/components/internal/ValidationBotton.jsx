"use client";
import React, { useState, useEffect } from 'react';
import showToast from '@/shared/utils/ToastShow';

export default function ValidationBotton({ validationData }) {
  const [buttonDataValidations, setButtonDataValidations] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true); // Por defecto desactivado
  const [bottonDataResponse, setBottonDataResponse] = useState(false); // Valor inicial en false

  // useEffect para habilitar o deshabilitar el botón basado en validationData
  useEffect(() => {
    if (validationData?.file && validationData?.dataUser?.id) {
      setButtonDisabled(false); // 🔓 Desbloquear el botón si hay datos
    } else {
      setButtonDisabled(true);  // 🔒 Bloquear el botón si faltan datos
    }
  }, [validationData]);  // Se ejecuta cada vez que validationData cambia

  const handlePostValidation = async () => {
    if (!validationData?.file || !validationData?.dataUser?.id) {
      console.error("Faltan datos requeridos");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file_product", validationData.file);
      formData.append("name_supplier_id", validationData.dataUser.id);

      // Realizar la solicitud POST para subir el archivo
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api_distrimed_productos/products/upload/veryfy/`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (Array.isArray(data.message)) {
          setButtonDisabled(true); // Deshabilitar el botón si hay errores
          data.message.forEach((msg) => {
            showToast.showErrorToast(msg);
          });
        } else {
          showToast.showErrorToast("Ocurrió un error inesperado.");
        }
        throw new Error('Error al subir el archivo');
      }

      setButtonDataValidations(response.ok);
      showToast.showSuccessToast(data.message); // Mostrar toast de éxito

      // Mostrar el toast con el botón para continuar
      showToast.showSuccessToastWithButton("Procesar Archivo", continuarProceso);

    } catch (error) {
      console.log(error)
      console.error('Error al enviar el archivo:', error);
    }
  };

  const handlePostAprobation = async () => {
    if (!validationData?.file || !validationData?.dataUser?.id) {
      console.error("Faltan datos requeridos en handlePostAprobation");
      return;
    }
  
    try {
      const formDataAprobation = new FormData();
      formDataAprobation.append("file_product", validationData.file);
      formDataAprobation.append("name_supplier_id", validationData.dataUser.id);
  
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api_distrimed_productos/products/upload/create/`,
        {
          method: 'POST',
          body: formDataAprobation,
        }
      );
  
      if (!response.ok) {
        throw new Error('Error al procesar la aprobación');
      }
  
      // ⚠️ Aquí manejamos la respuesta como archivo
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
  
      const a = document.createElement('a');
      a.href = url;
      a.download = 'archivo_procesado.xlsx';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
  
      console.log("Archivo descargado correctamente");
  
    } catch (error) {
      console.log('Error al procesar la aprobación:', error);
    }
  };

  useEffect(() => {
    if (bottonDataResponse) {
      showToast.showSuccessToast("¡Validación exitosa! El archivo ha sido procesado.");
    }
  }, [bottonDataResponse]);

  const continuarProceso = () => {
    if (!validationData || !validationData.file || !validationData.dataUser?.id) {
      console.error("Faltan datos en validationData");
      return;
    }
    handlePostAprobation(); // Llamar a la función para procesar la aprobación
  };

  return (
    <button
      type="submit"
      onClick={handlePostValidation}
      disabled={buttonDisabled}
      className={`py-2 px-6 rounded-md transition-opacity duration-300 text-white font-semibold
        ${buttonDisabled ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
    >
      Validar
    </button>
  );
}
