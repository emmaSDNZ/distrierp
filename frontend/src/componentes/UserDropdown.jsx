"use client";

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

// Componente reutilizable para menús desplegables
const Dropdown = ({ isOpen, items, onClose, anchorRef }) => {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !anchorRef.current.contains(event.target)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, anchorRef]);

  if (!isOpen) return null;

  return (
    <div ref={dropdownRef} className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
      <div className="py-1">
        {items.map((item, index) => (
          <div key={index}>
            {item.isTitle ? (
              <div className="px-4 py-2 font-semibold text-sm text-gray-800">{item.label}</div>
            ) : (
              <Link
                href={item.href || '#'}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                {item.label}
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const UserDropdown = () => {
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [isActivitiesOpen, setIsActivitiesOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const messagesRef = useRef(null);
  const activitiesRef = useRef(null);
  const userMenuRef = useRef(null);

  const toggleMessages = () => {
    setIsMessagesOpen(!isMessagesOpen);
    setIsActivitiesOpen(false);
    setIsUserMenuOpen(false);
  };

  const toggleActivities = () => {
    setIsActivitiesOpen(!isActivitiesOpen);
    setIsMessagesOpen(false);
    setIsUserMenuOpen(false);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
    setIsMessagesOpen(false);
    setIsActivitiesOpen(false);
  };

  const messagesItems = [
    { label: 'Todos' },
    { label: 'Chats' },
    { label: 'Canales' },
    { label: 'Mensaje nuevo' },
  ];

  const activitiesItems = [
    { label: 'Mostrar todas las actividades' },
    // Aquí puedes agregar la lista de actividades desde la API
  ];

  const userMenuItems = [
    { href: '/documentacion', label: 'Documentación' },
    { href: '/soporte', label: 'Soporte' },
    { label: 'Atajos CTRL+K' },
    { label: 'Modo oscuro' },
    { href: '/integracion', label: 'Integración' },
    { href: '/perfil', label: 'Mi perfil' },
    { href: '/bases-datos', label: 'Mis bases de datos' },
    { href: '/suscripcion', label: 'Mi suscripción' },
    { href: '/instalar', label: 'Instalar aplicación' },
    { href: '/logout', label: 'Cerrar sesión' },
  ];

  return (
    <div className="flex items-center space-x-6 mr-4"> {/* space-x-6 y mr-4 */}
      {/* Icono de Mensajes */}
      <div ref={messagesRef} className="relative group">
        <MailOutlineIcon
          className="h-7 w-7 cursor-pointer text-gray-700 hover:text-blue-500" // h-7 w-7
          onClick={toggleMessages}
        />
        <Dropdown
          isOpen={isMessagesOpen}
          items={messagesItems}
          onClose={() => setIsMessagesOpen(false)}
          anchorRef={messagesRef}
        />
      </div>

      {/* Icono de Actividades */}
      <div ref={activitiesRef} className="relative group">
        <AccessTimeIcon
          className="h-7 w-7 cursor-pointer text-gray-700 hover:text-blue-500" // h-7 w-7
          onClick={toggleActivities}
        />
        <Dropdown
          isOpen={isActivitiesOpen}
          items={activitiesItems}
          onClose={() => setIsActivitiesOpen(false)}
          anchorRef={activitiesRef}
        />
      </div>

      {/* Menú de Usuario */}
      <div ref={userMenuRef} className="relative group">
        <AccountCircleIcon
          className="h-9 w-9 rounded-full cursor-pointer text-gray-700 hover:text-blue-500" // h-9 w-9
          onClick={toggleUserMenu}
        />
        <Dropdown
          isOpen={isUserMenuOpen}
          items={userMenuItems}
          onClose={() => setIsUserMenuOpen(false)}
          anchorRef={userMenuRef}
        />
      </div>
    </div>
  );
};

export default UserDropdown;