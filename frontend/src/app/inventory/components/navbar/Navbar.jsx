"use client";

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import DropdownMenu from './DropdownMenu';

// Componente para un menú desplegable

const InventoryNavbar = ({ onMenuClick }) => {
  const [openMenu, setOpenMenu] = useState(null);
  const menuRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMenuClick = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(null);
      }
    };

    if (openMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openMenu]);

  const menus = {
    operaciones: { width: 'w-48', items: [
      { label: 'Transferencias', isTitle: true },
      { href: '/inventory/operations', label: 'Recepciones' }, { href: '/deliveries', label: 'Deliveries' },
      { href: '/inventory/operations', label: 'Interno' }, { label: 'Adjustments', isTitle: true },
      { href: '/inventory/operations', label: 'Physical Inventory' },
      { href: '/inventory/operations', label: 'Desechar' }, { label: 'Procurement', isTitle: true },
      { href: '/inventory/operations', label: 'Reposición' },
      { href: '/inventory/operations', label: 'Abastecimiento: ejecutar el programador' }, ], },

    productos: { width: 'w-48', items: [
      { href: '/inventory/products', label: 'Productos' },
      { href: '/inventory/products', label: 'Variantes de producto' },
      { href: '/inventory/products', label: 'Lots / Serial Numbers' },
      { href: '/inventory/products', label: 'Paquetes' }, ], },

    informes: { width: 'w-48', items: [
      { href: '/inventory/reports', label: 'Stock' },
      { href: '/inventory/reports', label: 'Ubicaciones' },
      { href: '/inventory/reports', label: 'Historial de movimientos' },
      { href: '/inventory/reports', label: 'Moves Analysis' }, { href: '/valoracion', label: 'Valoración' },
      { href: '/inventory/reports', label: 'Rendimiento' }, ], },

    configuracion: { width: 'w-64', items: [
      { href: '/inventory/settings', label: 'Ajustes' },
      { label: 'Gestión de almacenes', isTitle: true },
      { href: '/inventory/settings', label: 'Almacenes' },
      { href: '/inventory/settings', label: 'Tipos de operaciones' },
      { href: '/inventory/settings', label: 'Ubicaciones' },
      { href: '/inventory/settings', label: 'Rutas' }, { href: '/inventory/settings', label: 'Reglas' },
      { href: '/inventory/settings', label: 'Categorías de almacenamiento' },
      { href: '/inventory/settings', label: 'Reglas de Estrategía de Traslado' },
      { label: 'Productos', isTitle: true }, { href: '/inventory/settings', label: 'Categories' },
      { href: '/inventory/settings', label: 'Atributos' }, { href: '/unidades', label: 'Units & Packagings' },
      { href: '/inventory/settings', label: 'Nomenclaturas de código de barras' }, { label: 'Entrega', isTitle: true },
      { href: '/inventory/settings', label: 'Delivery Methods' }, { href: '/inventory/settings', label: 'Tipos de paquete' },
      { href: '/inventory/settings', label: 'Zip Prefix' }, ], },
  };

  return (
    <nav className="bg-white relative z-10">
      <div className="container mx-auto px-4 py-3 flex items-center">
        {/* Logo e ícono de Inventario */}
        <Link href="/home" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
          <div className="flex items-center mr-6">
            <div className={`relative transition-all duration-300 ${isHovered ? 'opacity-0 transform scale-0' : 'opacity-100 transform scale-100'}`}>
              <Inventory2Icon className="h-8 w-8 mr-2 text-blue-600" />
            </div>
            <div className={`absolute transition-all duration-300 ${isHovered ? 'opacity-100 transform scale-100' : 'opacity-0 transform scale-0'}`}>
              <ArrowBackIosIcon className="h-8 w-8 mr-2 text-blue-600" />
            </div>
            <span className="font-semibold text-lg text-gray-800 mr-4">Inventario</span>
          </div>
        </Link>

        {/* Enlaces de navegación */}
        <div className="flex items-center space-x-4">
          <Link href="/inventory" className="text-gray-700 hover:text-blue-600">
            Información general
          </Link>

          {/* Menús desplegables */}
          {Object.entries(menus).map(([menuKey, menuConfig]) => (
            <div key={menuKey} className="relative" ref={openMenu === menuKey ? menuRef : null}>
              <Link
                href={`/${menuKey}`}
                className="text-gray-700 hover:text-blue-600"
                onClick={(e) => {
                  e.preventDefault();
                  handleMenuClick(menuKey);
                }}
              >
                {menuKey.charAt(0).toUpperCase() + menuKey.slice(1)}
              </Link>
              {openMenu === menuKey && (
                <div className={`absolute left-0 mt-2 bg-white rounded-md shadow-lg ${menuConfig.width} z-20`}>
                  <DropdownMenu items={menuConfig.items} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default InventoryNavbar;