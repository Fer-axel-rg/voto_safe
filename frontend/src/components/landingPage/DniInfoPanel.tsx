import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserCheck } from "lucide-react";

type DniInfoPanelProps = {
  onVolver: () => void;
};

interface UserData {
  DNI: string;
  Nombres: string;
  Apellidos: string;
  "Fecha Nac.": string;
  Tipo: string;
  Departamento: string;
}

const CargarDatosUsuario = (): UserData => {
  const datosGuardados = localStorage.getItem("usuarioActual");
  if (datosGuardados) {
    return JSON.parse(datosGuardados) as UserData;
  }
  return {
    DNI: "error",
    Nombres: "error",
    Apellidos: "error",
    "Fecha Nac.": "error",
    Tipo: "error",
    Departamento: "error",
  };
};

const DniInfoPanel = ({ onVolver }: DniInfoPanelProps) => {
  const navigate = useNavigate();
  const [formData] = useState<UserData>(CargarDatosUsuario);

  // Función unificada para manejar el inicio de sesión
  const handleStartSession = (): void => {
    console.log("Iniciando sesión como ", formData.Nombres);

    // Pequeña validación por seguridad
    if (formData.DNI === 'error') return;

    const tipo = formData.Tipo;
    if (tipo === "user") {
      navigate("/user");
    } else {
      navigate("/admin");
    }
  };

  return (
    // Contenedor principal con animación
    <div className="w-full flex justify-center animate-fadeIn px-4 md:px-0">

      {/* TARJETA RESPONSIVE */}
      <div className="bg-white w-full max-w-3xl rounded-[2rem] p-6 md:p-10 
                      border-2 border-blue-950/70 shadow-[5px_5px_2px_4px_rgba(0,35,99,0.8)] 
                      font-poppins flex flex-col items-center relative overflow-hidden">

        {/* Decoración de fondo (opcional) */}
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <UserCheck size={100} className="text-blue-950" />
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-blue-950 mb-8 text-center z-10">
          Datos Personales
        </h2>

        {/* GRID SYSTEM:
            - grid-cols-1: En celular, todo en una columna.
            - md:grid-cols-2: En PC, dos columnas para ahorrar espacio vertical.
        */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 w-full z-10">

          {/* Campo DNI */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-bold text-blue-950 uppercase tracking-wider opacity-80">DNI</label>
            <input
              type="text"
              value={formData.DNI}
              readOnly
              className="w-full py-2 text-lg font-semibold text-gray-800 border-b-2 border-gray-300 focus:outline-none focus:border-blue-950 bg-transparent transition-colors"
            />
          </div>

          {/* Campo Tipo */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-bold text-blue-950 uppercase tracking-wider opacity-80">Tipo de Usuario</label>
            <input
              type="text"
              value={formData.Tipo === 'user' ? 'Votante' : 'Administrador'} // Formato amigable
              readOnly
              className="w-full py-2 text-lg font-semibold text-gray-800 border-b-2 focus:outline-none focus:border-blue-950 border-gray-300 bg-transparent capitalize"
            />
          </div>

          {/* Campo Nombre (Ocupa 2 columnas en PC si quisieras, aquí lo dejo normal) */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-bold text-blue-950 uppercase tracking-wider opacity-80">Nombres</label>
            <input
              type="text"
              value={formData.Nombres}
              readOnly
              className="w-full py-2 text-lg font-semibold text-gray-800 border-b-2  border-gray-300 bg-transparent focus:outline-none focus:border-blue-950"
            />
          </div>

          {/* Campo Apellido */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-bold text-blue-950 uppercase tracking-wider opacity-80">Apellidos</label>
            <input
              type="text"
              value={formData.Apellidos}
              readOnly
              className="w-full py-2 text-lg font-semibold text-gray-800 border-b-2 focus:outline-none focus:border-blue-950 border-gray-300 bg-transparent"
            />
          </div>

          {/* Campo Fecha */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-bold text-blue-950 uppercase tracking-wider  opacity-80">Fecha de Nacimiento</label>
            <input
              type="text"
              value={formData["Fecha Nac."]}
              readOnly
              className="w-full py-2 text-lg font-semibold text-gray-800 border-b-2 focus:outline-none focus:border-blue-950 border-gray-300 bg-transparent"
            />
          </div>

          {/* Campo Departamento */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-bold text-blue-950 uppercase tracking-wider opacity-80">Departamento</label>
            <input
              type="text"
              value={formData.Departamento}
              readOnly
              className="w-full py-2 text-lg font-semibold text-gray-800 border-b-2 focus:outline-none focus:border-blue-950 border-gray-300 bg-transparent"
            />
          </div>

        </div>

        {/* Botones */}
        <div className="flex flex-col items-center w-full gap-4 mt-10 md:mt-12 z-10">

          {/* Botón Iniciar: Ancho completo en móvil, más contenido en PC */}
          <button
            onClick={handleStartSession}
            className="w-full md:w-1/2 py-4 bg-blue-950 text-white text-xl font-semibold rounded-2xl shadow-lg 
                       hover:bg-blue-900 hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
          >
            CONFIRMAR E INICIAR
          </button>

          {/* Botón Volver */}
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