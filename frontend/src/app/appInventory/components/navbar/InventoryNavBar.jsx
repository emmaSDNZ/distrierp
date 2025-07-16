import React from 'react'
import Navbar from './Navbar'

import UserDropdown from '@/componentsGlobals/UserDropdown'

export default function InventoryNavBar() {
  return (
    <div className="bg-white flex flex-col items-center mt-0">
      
      {/** NavBar de Inventario */}
      <div className="w-full flex justify-between items-center py-2">
        <Navbar /> {/* Esto se alinea a la izquierda */}
        <UserDropdown />
      </div>
      {/** Barra de Busqueda */}
      <div className="w-full flex justify-center py-2">
      </div>
        
    </div>  
  )
}
