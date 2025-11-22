import { User, AlertCircle, Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import type { User as UserType } from '@/types/auth.types';

type PanelDniProps = {
  onVolver: () => void;
  onUsuarioEncontrado: (user: UserType) => void; // Callback para enviar datos al padre
}

const PanelDni = ({ onVolver, onUsuarioEncontrado }: PanelDniProps) => {
  const [dni, setDni] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false); // Nuevo estado visual
  
  const { login } = useAuth(); // Usamos el Hook real

  useEffect(() => {
    const validarDni = async () => {
      if (dni.length === 8) {
        setIsValidating(true);
        setError(null);

        // ⚠️ ATENCIÓN: Aquí simulamos login usando el DNI como contraseña
        // Esto es común en prototipos o kioscos de votación simples.
        const result = await login({ id: dni, password: dni });

        if (result.success) {
          // Pequeño delay para que se vea la animación de carga
          setTimeout(() => {
             // Obtenemos el usuario desde el hook o del localStorage que useAuth actualizó
             // Pero para ser más limpios, useAuth debería devolver el usuario en el login.
             // Como tu useAuth devuelve {success, message}, leeremos del localStorage temporalmente
             // O mejor, asumimos que useAuth actualizó el estado global.
             const userStored = localStorage.getItem('votosafe_user');
             if(userStored) {
                 onUsuarioEncontrado(JSON.parse(userStored));
             }
          }, 800);
        } else {
          setError(result.message || "DNI no encontrado o credenciales inválidas");
          setIsValidating(false);
        }
      } else {
        setError(null);
      }
    };

    validarDni();
  }, [dni, login, onUsuarioEncontrado]);

  const handleDniChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valorNumerico = e.target.value.replace(/[^0-9]/g, '');
    setDni(valorNumerico);
    if (error) setError(null);
  };

  return (
    <div className="flex items-center justify-center w-full animate-fadeIn">
      <div className="bg-white w-full max-w-sm md:max-w-md rounded-[2rem] shadow-2xl p-8 flex flex-col items-center border border-blue-50">

        {/* Icono (Cambia si está cargando) */}
        <div className="flex items-center justify-center w-20 h-20 rounded-full mb-6 bg-blue-950 shadow-lg shadow-blue-900/30 transition-all">
          {isValidating ? (
             <Loader2 className="text-blue-50 w-10 h-10 animate-spin" />
          ) : (
             <User className="text-blue-50 w-10 h-10" />
          )}
        </div>

        <h2 className="text-xl md:text-2xl font-bold text-blue-950 font-poppins mb-8 text-center">
          INGRESE SU DNI
        </h2>

        <div className="w-full relative mb-2">
          <input
            type="text"
            className={`w-full h-14 text-center text-2xl tracking-[0.5em] font-bold text-gray-700 
                        border-b-2 border-b-black/50 focus:outline-none transition-all duration-300
                        placeholder:text-gray-300 placeholder:tracking-normal placeholder:text-lg
                        disabled:opacity-50
                        ${error ? 'border-red-500 text-red-600 animate-shake' : 'border-gray-300 focus:border-blue-950'}`}
            value={dni}
            onChange={handleDniChange}
            maxLength={8}
            inputMode="numeric"
            placeholder="00000000"
            autoFocus
            disabled={isValidating} // Bloquear input mientras carga
          />

          {error && (
            <div className="absolute left-0 right-0 -bottom-8 flex justify-center items-center gap-1 text-red-500 text-xs font-medium animate-fadeIn">
              <AlertCircle size={14} />
              <span>{error}</span>
            </div>
          )}
        </div>

        <div className="flex flex-col items-center w-full gap-6 mt-10">
          <div className="bg-blue-50 text-blue-900 px-4 py-2 rounded-xl text-sm font-medium text-center w-full shadow-sm border border-blue-100">
            {isValidating ? "Verificando en padrón..." : "Ingrese los 8 dígitos numéricos"}
          </div>
          <button
            className="text-gray-500 font-medium hover:text-blue-950 hover:underline underline-offset-4 transition-colors text-sm md:text-base"
            onClick={onVolver}
            disabled={isValidating}
          >
            Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
};

export default PanelDni;