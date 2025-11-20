import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom"; // Usamos Portal para que se vea siempre encima de todo
import Duda from "./../../img/landing/duda.png";

interface ModalInfoProps {
  open: boolean;
  onClose: () => void;
}

const MoreInfo: React.FC<ModalInfoProps> = ({ open, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  // Corregimos la lógica de apertura para evitar errores de renderizado
  useEffect(() => {
    if (open) {
      setIsVisible(true);
      setClosing(false);
      document.body.style.overflow = "hidden"; // Bloquea el scroll de la página de fondo
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [open]);

  const AnimationClose = () => {
    setClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 150);
  };

  if (!open && !isVisible) return null;

  // Usamos createPortal para que el modal flote correctamente sobre el sidebar o cualquier cosa
  return createPortal(
    <div
      onClick={AnimationClose}
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4
        ${closing ? "animate-fadeOut" : "animate-fadeIn"}`}
    >
      {/* CONTENEDOR DEL MODAL */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-white w-full max-w-2xl rounded-2xl shadow-[0_0_3px_1px_rgba(20,33,133,1)] font-poppins relative flex flex-col
            max-h-[90vh] overflow-y-auto  /* <--- ESTO ES LA CLAVE RESPONSIVE (Scroll si no cabe) */
            ${closing ? "animate-scaleOut" : "animate-scaleIn"}`}
      >

        {/* Cabecera con botón X pegajoso (sticky) para que siempre se vea al hacer scroll */}
        <div className="sticky top-0 right-0 bg-white/95 backdrop-blur-sm z-10 flex justify-end p-4 pb-2 border-b border-transparent">
          <button
            onClick={AnimationClose}
            className="text-4xl font-bold transition-transform text-blue-950 hover:scale-110 leading-none"
          >
            X
          </button>
        </div>

        {/* Contenido con Padding */}
        <div className="px-6 pb-8 md:px-8">

          <h1 className="mb-6 text-2xl md:text-3xl font-bold text-center text-blue-950">
            INSTRUCCIONES
          </h1>

          {/* Texto: text-lg en móvil, text-xl en PC (md) */}
          <div className="space-y-6 text-lg md:text-xl font-semibold text-slate-800">
            <p>
              1) El primer paso es hacer clic en el botón de{" "}
              <span className="text-blue-800">INICIO</span> para que aparezca el siguiente panel.
            </p>
            <p>
              2) En el panel debe ingresar su DNI. Si el número es válido, sus datos aparecerán en pantalla.
            </p>
            <p>
              3) Si aparece un mensaje de{" "}
              <span className="text-red-700">ERROR</span>, verifique que el DNI esté escrito correctamente (sin letras o símbolos).
            </p>
            <p>
              4) Si sus datos son correctos, presione el botón{" "}
              <span className="text-blue-800">INICIAR</span> para continuar.
            </p>
          </div>

          <div className="flex justify-center mt-10 mb-2">
            <img
              className="w-32 h-32 md:w-40 md:h-40 rounded-full shadow-md object-cover"
              src={Duda}
              alt="Duda icon"
            />
          </div>
        </div>
      </div>
    </div>,
    document.body // Renderizamos en el body para salirnos del Sidebar
  );
};

export default MoreInfo;