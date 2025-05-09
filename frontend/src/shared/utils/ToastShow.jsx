import { CircularProgress, ErrorOutline, CheckCircleOutline } from '@mui/icons-material';
import { toast } from 'sonner';
import React from 'react'; // Asegurate de importar React si usás JSX

const showToast = {
  showSuccessToast: (message) => {
    toast.success(message, {
      duration: 2500,
      icon: <CheckCircleOutline sx={{ color: "#3B82F6" }} />,
      style: {
        background: "#ffffff",
        color: "#1F2937",
        fontSize: "0.875rem",
        fontWeight: "500",
        border: "1px solid #3B82F6",
        borderRadius: "0.5rem",
        padding: "12px 16px",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        fontFamily: "Inter, sans-serif",
      },
    });
  },

  showErrorToast: (message) => {
    toast.error(message, {
      duration: 2500,
      icon: <ErrorOutline sx={{ color: "#EF4444" }} />,
      style: {
        background: "#ffffff",
        color: "#1F2937",
        fontSize: "0.875rem",
        fontWeight: "500",
        border: "1px solid #EF4444",
        borderRadius: "0.5rem",
        padding: "12px 16px",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        fontFamily: "Inter, sans-serif",
      },
    });
  },

  showLoadingToast: () => {
    return toast.loading("Cargando...", {
      duration: 0,
      style: {
        background: "#ffffff",
        color: "#1F2937",
        fontSize: "0.875rem",
        fontWeight: "500",
        border: "1px solid #3B82F6",
        borderRadius: "0.5rem",
        padding: "12px 16px",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        fontFamily: "Inter, sans-serif",
      },
    });
  },

  hideLoadingToast: (toastId) => {
    toast.dismiss(toastId);
  },

  // ✅ Nuevo toast con botón "Continuar"
  showSuccessToastWithButton: (message, onContinue) => {
    // Mostrar el toast sin necesidad de pasarle un callback complejo
    const toastId = toast.success(
      <div onClick={(e) => e.stopPropagation()}> {/* Evita que el clic en el toast cierre el toast */}
        <p>{message}</p>
        <button
          onClick={() => {
            toast.dismiss(toastId); // Cierra el toast al hacer clic en el botón
            if (typeof onContinue === 'function') onContinue(); // Ejecutar la acción del botón "Continuar"
          }}
          className="mt-2 px-3 py-1 text-sm font-semibold text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          Continuar
        </button>
      </div>,
      {
        duration: Infinity, // El toast permanece visible hasta que se haga clic en el botón
        icon: null,
        style: {
          background: "#ffffff",
          color: "#1F2937",
          fontSize: "0.875rem",
          fontWeight: "500",
          border: "1px solid #3B82F6",
          borderRadius: "0.5rem",
          padding: "12px 16px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          fontFamily: "Inter, sans-serif",
        },
      }
    );
  
    // Agregar listener para cerrar el toast si se hace clic fuera
    const handleClickOutside = () => {
      toast.dismiss(toastId);
      document.removeEventListener('click', handleClickOutside);
    };
  
    // Registrar el listener global
    setTimeout(() => {
      document.addEventListener('click', handleClickOutside);
    }, 0);
  },
};

export default showToast;
