// components/ModuleCard.js
import Link from 'next/link';

export default function ModuleCard({ name, icon, link }) {
    return (
        <Link
            href={link}
            className="bg-white p-6 rounded-lg shadow-md text-center hover:bg-gray-200 transition-all flex flex-col items-center justify-center aspect-w-1 aspect-h-1"
        >
            {/* Renderizamos el icono de forma correcta */}
            {icon}
            <h2 className="text-lg text-gray-800">{name}</h2>
        </Link>
    );
}
