import { User, AlertCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react';

// Props
type PanelDniProps = {
  onVolver: () => void;
  onIngresar: () => void;
}

interface UsuarioData {
  DNI: string;
  [key: string]: any;
}

const PanelDni = ({ onVolver, onIngresar }: PanelDniProps) => {
  const [dni, setDni] = useState("");
  const [error, setError] = useState<string | null>(null); // Estado para mensajes de error visuales

  // Efecto para validar automáticamente al llegar a 8 dígitos
  useEffect(() => {
    if (dni.length === 8) {
      const usuariosGuardados = localStorage.getItem('usuariosData');

      if (!usuariosGuardados) {
        setError("No hay base de datos de usuarios cargada.");
        return;
      }

      try {
        const users: UsuarioData[] = JSON.parse(usuariosGuardados);
        const usuarioEncontrado = users.find(user => user.DNI === dni);

        if (usuarioEncontrado) {
          localStorage.setItem('usuarioActual', JSON.stringify(usuarioEncontrado));
          setError(null);
          // Pequeño delay para que el usuario vea que se completó antes de cambiar
          setTimeout(() => {
            onIngresar();
          }, 200);
        } else {
          setError("DNI no encontrado en el padrón.");
        }
      } catch (e) {
        console.error("Error al procesar datos: ", e);
        setError("Error al leer datos del sistema.");
      }
    } else {
      // Limpiamos el error si el usuario borra números
      setError(null);
    }
  }, [dni, onIngresar]);

  const handleDniChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Filtramos para solo números
    const valorNumerico = e.target.value.replace(/[^0-9]/g, '');
    setDni(valorNumerico);
    if (error) setError(null); // Limpiar error al escribir
  };

  return (
    <div className="flex items-center justify-center w-full animate-fadeIn">

      {/* TARJETA RESPONSIVE:
          - w-full: Ocupa todo el ancho en móvil.
          - max-w-sm md:max-w-md: Limita el ancho en PC para que parezca tarjeta.
          - bg-white rounded-3xl: Mantenemos tu estilo redondeado.
      */}
      <div className="bg-white w-full max-w-sm md:max-w-md rounded-[2rem] shadow-2xl p-8 flex flex-col items-center border border-blue-50">

        {/* Icono Circular */}
        <div className="flex items-center justify-center w-20 h-20 rounded-full mb-6 bg-blue-950 shadow-lg shadow-blue-900/30">
          <User className="text-blue-50 w-10 h-10" />
        </div>

        <h2 className="text-xl md:text-2xl font-bold text-blue-950 font-poppins mb-8 text-center">
          INGRESE SU DNI
        </h2>

        {/* Input Container */}
        <div className="w-full relative mb-2">
          <input
            type="text"
            className={`w-full h-14 text-center text-2xl tracking-[0.5em] font-bold text-gray-700 
                        border-b-2 border-b-black/50 focus:outline-none transition-all duration-300
                        placeholder:text-gray-300 placeholder:tracking-normal placeholder:text-lg
                        ${error
                ? 'border-red-500 text-red-600 animate-shake'
                : 'border-gray-300 focus:border-blue-950'
              }`}
            value={dni}
            onChange={handleDniChange}
            maxLength={8}
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="00000000"
            autoFocus
          />

          {/* Mensaje de Error Flotante */}
          {error && (
            <div className="absolute left-0 right-0 -bottom-8 flex justify-center items-center gap-1 text-red-500 text-xs font-medium animate-fadeIn">
              <AlertCircle size={14} />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Sección Informativa y Botón Volver */}
        <div className="flex flex-col items-center w-full gap-6 mt-10">

          {/* Pill Informativa */}
          <div className="bg-blue-50 text-blue-900 px-4 py-2 rounded-xl text-sm font-medium text-center w-full shadow-sm border border-blue-100">
            Ingrese los 8 dígitos numéricos
          </div>

          {/* Botón Volver */}
          <button
            className="text-gray-500 font-medium hover:text-blue-950 hover:underline underline-offset-4 transition-colors text-sm md:text-base"
            onClick={onVolver}
          >
            Volver al inicio
          </button>
        </div>

      </div>
    </div>
  );
};

export default PanelDni;