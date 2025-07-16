"use client";
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import UserDropdown from '@/componentsGlobals/UserDropdown';

const menus = {
  contactos: {
    width: 'w-64',
    items: [
    { label: 'Gestión', isTitle: true },
    { href: '/appContacts/contacts/contacto', label: 'Crear Contacto'},
    { href: '/appContacts/contacts/proveedor', label: 'Crear Proveedor' },
    { label: 'Contactos', isTitle: true },
    { href: '/contacts/cliente', label: 'Clientes' },
    { href: '/contacts/proveedor', label: 'Proveedores'},
    { href: '/contacts/companies', label: 'Empresas' },
    { href: '/contacts/blacklist', label: 'Lista negra' },
    { label: 'Configuración', isTitle: true },
    { href: '/contacts/settings/tags', label: 'Etiquetas' },
    { href: '/contacts/settings/titles', label: 'Títulos' },
    { href: '/contacts/settings/country-settings', label: 'Configuración País / Estado' },
    ],
  },
};

// COMPONENTE MENU ITEM con tus estilos exactos
function MenuItem({ href, children, isTitle, onClick }) {
  const className = `block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${
    isTitle ? 'font-semibold text-gray-800 mt-2' : ''
  }`;

  if (href) {
    return (
      <Link href={href} className={className} onClick={onClick}>
        {children}
      </Link>
    );
  }
  return <div className={className}>{children}</div>;
}
// COMPONENTE DROPDOWN MENU
function DropdownMenu({ items, onItemClick }) {
  return (
    <div className="py-1">
      {items.map((item, index) => (
        <MenuItem
          key={index}
          href={item.href}
          isTitle={item.isTitle}
          onClick={onItemClick}
        >
          {item.label}
        </MenuItem>
      ))}
    </div>
  );
}
export default function ContactsNavBar() {
  const [openMenu, setOpenMenu] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(null);
      }
    }
    if (openMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openMenu]);

  const handleMenuClick = (menuKey) => {
    setOpenMenu(openMenu === menuKey ? null : menuKey);
  };

  return (
    <nav className="bg-white relative z-10 shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Izquierda: Logo */}
        <Link href="/home" passHref>
          <div
            className="flex items-center cursor-pointer relative mr-6"
            onMouseEnter={() => isClient && setIsHovered(true)}
            onMouseLeave={() => isClient && setIsHovered(false)}
          >
            <div
              className={`transition-all duration-300 ${
                isClient && isHovered ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
              }`}
            >
              <PeopleAltIcon className="h-8 w-8 mr-2 text-blue-600" />
            </div>
            <div
              className={`absolute transition-all duration-300 ${
                isClient && isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
              }`}
            >
              <ArrowBackIosIcon className="h-8 w-8 mr-2 text-blue-600" />
            </div>
            <span className="font-semibold text-lg text-gray-800 ml-2">Contactos</span>
          </div>
        </Link>

        {/* Centro: Links y menú */}
        <div className="flex items-center space-x-6 flex-grow">
          <Link href="/appContacts" className="text-gray-700 hover:text-blue-600">
            Información general
          </Link>

          {Object.entries(menus).map(([menuKey, menuConfig]) => (
            <div
              key={menuKey}
              className="relative"
              ref={openMenu === menuKey ? menuRef : null}
            >
              <button
                onClick={() => handleMenuClick(menuKey)}
                className="text-gray-700 hover:text-blue-600 focus:outline-none"
                type="button"
              >
                {menuKey.charAt(0).toUpperCase() + menuKey.slice(1)}
              </button>

              {openMenu === menuKey && (
                <div
                  className={`absolute left-0 mt-2 bg-white rounded-md shadow-lg ${menuConfig.width} z-20 transition-all duration-300 ease-in-out transform 
                    ${openMenu === menuKey ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}
                  `}
                >
                  <DropdownMenu
                    items={menuConfig.items}
                    onItemClick={() => setOpenMenu(null)}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Derecha: UserDropdown */}
        <div className="ml-auto">
          <UserDropdown />
        </div>
      </div>
    </nav>
  );
}
