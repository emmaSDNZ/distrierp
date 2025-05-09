"use client";
import React, { useState, useEffect } from 'react';
import InternalCardSearch from './InternalCardSearch';
import ValidationBotton from './ValidationBotton';

export default function InternalCard({ headers, file }) {
  useEffect(() => {
    setValidationData(prev => ({
      ...prev,
      file: file,
    }));
  }, [file]);
  const [validationData, setValidationData] = useState({
    file: file,
    dataUser: null,
  });

  const handleDataValidation = (userData) => {
    console.log('Información del usuario recibida en el padre:', userData);
    setValidationData(prevData => ({
      ...prevData,
      dataUser: userData,
    }));
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-700">Columnas del archivo</h2>
        <div>
          <InternalCardSearch onUserSelect={handleDataValidation} />
        </div>
        <div>
          <ValidationBotton validationData={validationData} />
        </div>
      </div>
      {headers && headers.length > 0 ? (
        <div className="w-full py-3 px-5 text-2xl text-gray-900">
          <div className="flex flex-col gap-4 p-3">
            {headers.map((column, index) => (
              <div
                key={index}
                className="flex justify-between items-center text-base text-gray-800 w-full py-2 px-4 border-b border-gray-200 transition-colors duration-200 hover:bg-gray-50 cursor-default"
              >
                <span>{column}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-4">No se detectaron columnas en el archivo.</p>
      )}
    </div>
  );
}
