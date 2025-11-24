import React from "react";
import { useNavigate } from "react-router-dom";
import { UserCheck } from "lucide-react";
import type { User } from "@/types/auth.types";

type DniInfoPanelProps = {
  onVolver: () => void;
  user: User;
};

const DniInfoPanel = ({ onVolver, user }: DniInfoPanelProps) => {
  const navigate = useNavigate();

  const handleStartSession = (): void => {
    // Redirigir según el rol del usuario
    if (user.role === "admin") {
      navigate("/admin/dashboard");
    } else {
      navigate("/user/ballots"); // ✅ CORREGIDO: Primero va al selector de elecciones
    }
  };

  return (
    <div className="w-full flex justify-center animate-fadeIn px-4 md:px-0">
      <div className="bg-white w-full max-w-3xl rounded-[2rem] p-6 md:p-10
                      border-2 border-blue-950/70 shadow-[5px_5px_2px_4px_rgba(0,35,99,0.8)]
                      font-poppins flex flex-col items-center relative overflow-hidden">

        <div className="absolute top-0 right-0 p-4 opacity-10">
          <UserCheck size={100} className="text-blue-950" />
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-blue-950 mb-8 text-center z-10">
          Datos Personales
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 w-full z-10">

          {/* DNI */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-bold text-blue-950 uppercase tracking-wider opacity-80">DNI</label>
            <input
              type="text"
              value={user.id}
              readOnly
              className="w-full py-2 text-lg font-semibold text-gray-800 border-b-2 border-gray-300 bg-transparent focus:outline-none" 
            />
          </div>

          {/* TIPO */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-bold text-blue-950 uppercase tracking-wider opacity-80">Tipo de Usuario</label>
            <input
              type="text"
              value={user.role === 'user' ? 'Votante' : 'Administrador'}
              readOnly
              className="w-full py-2 text-lg font-semibold text-gray-800 border-b-2 border-gray-300 bg-transparent focus:outline-none capitalize" 
            />
          </div>

          {/* NOMBRES */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-bold text-blue-950 uppercase tracking-wider opacity-80">Nombres</label>
            <input
              type="text"
              value={user.names || user.fullName}
              readOnly
              className="w-full py-2 text-lg font-semibold text-gray-800 border-b-2 border-gray-300 bg-transparent focus:outline-none" 
            />
          </div>

          {/* APELLIDOS */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-bold text-blue-950 uppercase tracking-wider opacity-80">Apellidos</label>
            <input
              type="text"
              value={user.surnames || "-"}
              readOnly
              className="w-full py-2 text-lg font-semibold text-gray-800 border-b-2 border-gray-300 bg-transparent focus:outline-none" 
            />
          </div>

          {/* FECHA */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-bold text-blue-950 uppercase tracking-wider opacity-80">Fecha de Registro</label>
            <input
              type="text"
              value={user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}
              readOnly
              className="w-full py-2 text-lg font-semibold text-gray-800 border-b-2 border-gray-300 bg-transparent focus:outline-none" 
            />
          </div>

          {/* DEPARTAMENTO */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-bold text-blue-950 uppercase tracking-wider opacity-80">Departamento</label>
            <input
              type="text"
              value={user.department || "No especificado"}
              readOnly
              className="w-full py-2 text-lg font-semibold text-gray-800 border-b-2 border-gray-300 bg-transparent focus:outline-none" 
            />
          </div>

        </div>

        <div className="flex flex-col items-center w-full gap-4 mt-10 md:mt-12 z-10">
          <button
            onClick={handleStartSession}
            className="w-full md:w-1/2 py-4 bg-blue-950 text-white text-xl font-semibold rounded-2xl shadow-lg hover:bg-blue-900 hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
          >
            CONFIRMAR E INICIAR
          </button>
          <button
            onClick={onVolver}
            className="text-gray-500 font-medium hover:text-blue-950 hover:underline underline-offset-4 transition-colors"
          >
            No soy yo, volver
          </button>
        </div>

      </div>
    </div>
  );
};

export default DniInfoPanel;