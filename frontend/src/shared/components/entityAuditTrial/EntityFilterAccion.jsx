// components/entityAuditTrial/EntityFilterAccion.jsx
import React from 'react';

export default function EntityFilterAccion({ accion, setAccion }) {
  return (
    <div className="flex items-center min-w-[200px] flex-shrink-0">
      <label
        htmlFor="accion"
        className="text-sm font-semibold whitespace-nowrap mr-2"
        style={{ lineHeight: "1.75rem" }}
      >
        Filtrar por acción:
      </label>
      <select
        id="accion"
        value={accion}
        onChange={(e) => setAccion(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-200 focus:border-blue-400 text-sm"
        style={{ minWidth: "140px", height: "38px" }}
      >
        <option value="">Todos</option>
        <option value="create">Create</option>
        <option value="update">Update</option>
        <option value="delete">Delete</option>
      </select>
    </div>
  );
}
