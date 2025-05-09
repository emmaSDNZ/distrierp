"use client";
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import UploadIcon from '@mui/icons-material/Upload';
import InternalForm from '../../components/internal/InternalForm';

export default function FileUpload() {
  const [file, setFile] = useState(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [fileUploaded, setFileUploaded] = useState(false);

  const onDrop = (acceptedFiles) => {
    const selectedFile = acceptedFiles[0]
    if (selectedFile) {
      setFile(selectedFile);  
      setFileUploaded(true);  // Cambiar el estado de FileUploaded a true
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
  });


  return (
    <div className="flex justify-center items-start w-full mt-10">
    {!fileUploaded? (
        <div
        {...getRootProps()}
        className={`w-full max-w-3xl px-10 py-16 bg-white border-2 rounded-md shadow-sm transition-all duration-200
          ${isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}
      >
        <input {...getInputProps()} />
        {file ? (
          <div className="text-center">
            <p className="text-gray-900 text-base font-semibold mb-1">Archivo seleccionado:</p>
            <p className="text-blue-600 font-medium">{file.name}</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center space-y-2">
            <div className="flex items-center space-x-2">
              <UploadIcon className="text-blue-500 text-3xl" />
              <p className="text-lg text-gray-800 font-bold">Arrastre o suba el archivo</p>
            </div>
            <p className="text-sm text-gray-600 max-w-md">
              Se recomienda utilizar archivos de Excel (.xlsx) por su formato automático. También se aceptan archivos .csv.
            </p>
            <p className="text-sm text-blue-500 font-medium underline hover:text-blue-600 cursor-pointer">
              Subir archivos de datos
            </p>
          </div>
        )}
      </div>
        ):(
          <div className="mt-6 w-full max-w-3xl">
          <InternalForm file={file} /> {/* Pasa el archivo al componente InternalForm */}
        </div>
        )}
    </div>
  );
}
