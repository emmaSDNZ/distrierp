import { CalendarMonth, People, ShoppingCart, Receipt, Inventory2, Settings } from "@mui/icons-material";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ModuleCard from "./components/ModuleCard";

const modules = [
    { name: "Calendario", icon: <CalendarMonth className="text-yellow-500 text-3xl mb-2" />, link: "/calendario" },
    { name: "Contactos", icon: <People className="text-purple-500 text-3xl mb-2" />, link: "/contactos" },
    { name: "Ventas", icon: <ShoppingCart className="text-red-500 text-3xl mb-2" />, link: "/ventas" },
    { name: "Facturación", icon: <Receipt className="text-green-500 text-3xl mb-2" />, link: "/facturacion" },
    { name: "Inventario", icon: <Inventory2 className="text-blue-600 text-3xl mb-2" />, link: "/inventory" },
    { name: "Ajustes", icon: <Settings className="text-gray-600 text-3xl mb-2" />, link: "/ajustes" },
];

export default function Home() {
    return (
        <div className="min-h-screen bg-gray-100 p-8 flex flex-col">
            {/* Header */}
            <Header/>

            {/* Contenedor para los Módulos */}
            <div className="flex flex-col justify-start items-center flex-grow mt-20"> {/* Ajustamos el mt-8 aquí */}
                {/* Grid de Módulos */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-4xl mx-auto w-full">
                    {modules.map(({ name, icon, link }) => (
                        <ModuleCard key={link} name={name} icon={icon} link={link} />
                    ))}
                </div>
            </div>

            {/* Footer */}
            <Footer className="mt-auto"/> {/* Esto asegura que el footer esté pegado al fondo */}
        </div>
    );
}
