import React from 'react'

export default function EntityHeaderList({name, setName}) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-6">
    {/* Filtro por nombre */}
    <div className="flex-grow min-w-[200px]">
        <SearchBar value={name} onSearch={setName} />
    </div>

    {/* Filtro por acción */}
    <div className="flex items-center min-w-[200px] flex-shrink-0">
        <label
        htmlFor="accion"
        className="text-sm font-semibold whitespace-nowrap mr-2"
        style={{ lineHeight: '1.75rem' }}
        >
        Filtrar por acción:
        </label>
        <select
        id="accion"
        value={accion}
        onChange={(e) => setAccion(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-200 focus:border-blue-400 text-sm"
        style={{ minWidth: '140px', height: '38px' }}
        >
        <option value="">Todos</option>
        <option value="create">Create</option>
        <option value="update">Update</option>
        <option value="delete">Delete</option>
        </select>
    </div>

    {/* Botones de paginación */}
    <div className="flex items-center gap-2 flex-shrink-0 min-w-[200px]">
        <EntityButton
        title="Anterior"
        onClick={() => handlePagination(previousUrl)}
        disabled={!previousUrl}
        />
        <EntityButton
        title="Siguiente"
        onClick={() => handlePagination(nextUrl)}
        disabled={!nextUrl}
        className="px-4 bg-blue-400 text-white rounded-md disabled:opacity-50 hover:bg-blue-500 active:bg-blue-400"
        style={{ height: '38px', minWidth: '90px' }}
        />
    </div>
    </div>
  )
}
