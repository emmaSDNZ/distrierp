"use client";

import { useEffect, useState } from 'react';

function Auditoria() {
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuditoria = async () => {
      try {
        console.log("Haciendo solicitud a la API..."); // Log antes de la solicitud
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api_distrimed_productos/audit/product/list`);
        
        console.log("Respuesta recibida:", response); // Log después de recibir la respuesta

        if (!response.ok) {
          console.error('Error al obtener los registros de auditoría', response);
          throw new Error('Error al obtener los registros de auditoría');
        }
        
        const data = await response.json();
        console.log("Datos de la auditoría:", data); // Log los datos recibidos
        
        setRegistros(data);
      } catch (error) {
        console.error('Error al obtener los registros de auditoría:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAuditoria();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full border-t-transparent border-primary"></div>
      </div>
    );
  }

  console.log("Registros cargados:", registros); // Log después de cargar los registros

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-4">Historial de Auditoría Productos</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">Fecha y Hora</th>
              <th className="px-4 py-2 text-left">Modelo</th>
              <th className="px-4 py-2 text-left">Nombre del Registro</th>
              <th className="px-4 py-2 text-left">ID Registro</th>
              <th className="px-4 py-2 text-left">Acción</th>
              
            </tr>
          </thead>
          <tbody>
            {registros.map((registro) => (
              <tr key={registro.id}>
                <td className="px-4 py-2">{registro.fecha_hora}</td>
                <td className="px-4 py-2">{registro.modelo}</td>
                <td className="px-4 py-2">{registro.registro_nombre}</td>                
                <td className="px-4 py-2">{registro.registro_id}</td>
                <td className="px-4 py-2">{registro.accion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Auditoria;
