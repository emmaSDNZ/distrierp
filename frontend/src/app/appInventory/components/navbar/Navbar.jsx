"use client";

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import DropdownMenu from './DropdownMenu';

const InventoryNavbar = ({ onMenuChange }) => {
  const [openMenu, setOpenMenu] = useState(null);
  const menuRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMenuClick = (menu) => {
    const newMenu = openMenu === menu ? null : menu;
    setOpenMenu(newMenu);

    // ✅ Notificar cambio de menú al componente padre
    if (onMenuChange) {
      onMenuChange(newMenu); // puede ser null si se cerró
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(null);
        if (onMenuChange) onMenuChange(null);
      }
    };

    const handleScroll = () => {
      setOpenMenu(null);
      if (onMenuChange) onMenuChange(null);
    };

    if (openMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('scroll', handleScroll);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [openMenu, onMenuChange]);
  const menus = {
    operaciones: {
      width: 'w-48',
      items: [
        { label: 'Transferencias', isTitle: true },
        { href: '/inventory/operations?view=receptions', label: 'Recepciones' },
        { href: '/deliveries', label: 'Deliveries' },
        { href: '/appInventory/operations/internal', label: 'Interno' },
        { label: 'Adjustments', isTitle: true },
        { href: '/inventory/operations?view=physical', label: 'Physical Inventory' },
        { href: '/inventory/operations?view=discard', label: 'Desechar' },
        { label: 'Procurement', isTitle: true },
        { href: '/inventory/operations?view=replenishment', label: 'Reposición' },
        { href: '/inventory/operations?view=scheduler', label: 'Abastecimiento: ejecutar el programador' },
      ],
    },
    productos: {
      width: 'w-48',
      items: [
        { href: '/appInventory/products/', label: 'Productos' },
        { href: '/appInventory/products/productsvariants', label: 'Variantes de producto' },
        { href: '/inventory/products?view=serialnumbers', label: 'Lots / Serial Numbers' },
        { href: '/inventory/products?view=packages', label: 'Paquetes' },
      ],
    },
    informes: {
      width: 'w-48',
      items: [
        { href: '/inventory/reports', label: 'Stock' },
        { href: '/inventory/reports', label: 'Ubicaciones' },
        { href: '/appInventory/reports/movement', label: 'Historial de movimientos' },
        { href: '/inventory/reports', label: 'Moves Analysis' },
        { href: '/valoracion', label: 'Valoración' },
        { href: '/inventory/reports', label: 'Rendimiento' },
      ],
    },
    configuracion: {
      width: 'w-64',
      items: [
        { href: '/inventory/settings', label: 'Ajustes' },
        { label: 'Gestión de almacenes', isTitle: true },
        { href: '/inventory/settings?view=warehouses', label: 'Almacenes' },
        { href: '/inventory/settings?view=types', label: 'Tipos de operaciones' },
        { href: '/inventory/settings?view=locations', label: 'Ubicaciones' },
        { href: '/inventory/settings?view=routes', label: 'Rutas' },
        { href: '/inventory/settings?view=rules', label: 'Reglas' },
        { href: '/inventory/settings?view=storagecategories', label: 'Categorías de almacenamiento' },
        { href: '/inventory/settings?view=transferstrategy', label: 'Reglas de Estrategía de Traslado' },
        { label: 'Productos', isTitle: true },
        { href: '/inventory/settings?view=category', label: 'Categorías' },
        { href: '/inventory/settings?view=attribute', label: 'Atributos' },
        { href: '/unidades', label: 'Unidades y Paquetes' },
        { href: '/inventory/settings?view=barcode', label: 'Nomenclaturas de código de barras' },
        { label: 'Entrega', isTitle: true },
        { href: '/inventory/settings?view=deliverymethods', label: 'Delivery Methods' },
        { href: '/inventory/settings?view=packagetypes', label: 'Tipos de paquete' },
        { href: '/inventory/settings?view=zipprefix', label: 'Zip Prefix' },
      ],
    },
  };

  return (
    <nav className="bg-white relative z-10">
      <div className="container mx-auto px-4 py-3 flex items-center">
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

        <div className="flex items-center space-x-4">
          <Link href="/appInventory" className="text-gray-700 hover:text-blue-600">
            Información general
          </Link>

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
