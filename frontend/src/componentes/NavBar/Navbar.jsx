"use client";

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

// Componente para un elemento de menú (enlace o título)
const MenuItem = ({ href, children, isTitle }) => {
  const className = `block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${
    isTitle ? 'font-semibold text-gray-800 mt-2' : ''
  }`;
  if (href) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }
  return <div className={className}>{children}</div>;
};

// Componente para un menú desplegable
const DropdownMenu = ({ items }) => {
  return (
    <div className="py-1">
      {items.map((item, index) => (
        <MenuItem key={index} href={item.href} isTitle={item.isTitle}>
          {item.label}
        </MenuItem>
      ))}
    </div>
  );
};

const Navbar = ({ onMenuClick }) => {
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
      { href: '/recepciones', label: 'Recepciones' }, { href: '/deliveries', label: 'Deliveries' },
      { href: '/interno', label: 'Interno' }, { label: 'Adjustments', isTitle: true },
      { href: '/physical-inventory', label: 'Physical Inventory' },
      { href: '/desechar', label: 'Desechar' }, { label: 'Procurement', isTitle: true },
      { href: '/reposicion', label: 'Reposición' },
      { href: '/abastecimiento', label: 'Abastecimiento: ejecutar el programador' }, ], },

    productos: { width: 'w-48', items: [
      { href: '/inventario/productos', label: 'Productos' },
      { href: '/variantes', label: 'Variantes de producto' },
      { href: '/lots', label: 'Lots / Serial Numbers' },
      { href: '/paquetes', label: 'Paquetes' }, ], },

    informes: { width: 'w-48', items: [
      { href: '/stock', label: 'Stock' },
      { href: '/ubicaciones', label: 'Ubicaciones' },
      { href: '/historial', label: 'Historial de movimientos' },
      { href: '/moves-analysis', label: 'Moves Analysis' }, { href: '/valoracion', label: 'Valoración' },
      { href: '/rendimiento', label: 'Rendimiento' }, ], },

    configuracion: { width: 'w-64', items: [
      { href: '/ajustes', label: 'Ajustes' },
      { label: 'Gestión de almacenes', isTitle: true },
      { href: '/almacenes', label: 'Almacenes' },
      { href: '/tipos-operaciones', label: 'Tipos de operaciones' },
      { href: '/ubicaciones-almacen', label: 'Ubicaciones' },
      { href: '/rutas', label: 'Rutas' }, { href: '/reglas', label: 'Reglas' },
      { href: '/categorias-almacen', label: 'Categorías de almacenamiento' },
      { href: '/reglas-estrategia', label: 'Reglas de Estrategía de Traslado' },
      { label: 'Productos', isTitle: true }, { href: '/categorias-productos', label: 'Categories' },
      { href: '/atributos', label: 'Atributos' }, { href: '/unidades', label: 'Units & Packagings' },
      { href: '/nomenclaturas', label: 'Nomenclaturas de código de barras' }, { label: 'Entrega', isTitle: true },
      { href: '/metodos-entrega', label: 'Delivery Methods' }, { href: '/tipos-paquete', label: 'Tipos de paquete' },
      { href: '/zip-prefix', label: 'Zip Prefix' }, ], },
  };

  return (
    <nav className="bg-white relative z-10">
      <div className="container mx-auto px-4 py-3 flex items-center">
        {/* Logo e ícono de Inventario */}
        <Link href="/" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
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
          <Link href="/general" className="text-gray-700 hover:text-blue-600">
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

export default Navbar;