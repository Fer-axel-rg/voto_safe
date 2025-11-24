// Tarjeta de partido con menú 3 puntos
// src/components/parties/PartyCard.tsx

import { useState } from "react";
import { MoreVertical, Edit, Trash2 } from "lucide-react";
import type { Party } from "@/types/party.types";

interface PartyCardProps {
  party: Party;
  onEdit: (party: Party) => void;
  onDelete: (partyId: string) => void;
}

export default function PartyCard({ party, onEdit, onDelete }: PartyCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    // CAMBIOS PRINCIPALES:
    // 1. Fondo blanco (bg-white) para un look más limpio.
    // 2. Esquinas redondeadas estándar (rounded-xl) y p-6.
    // 3. Sombra estándar de Tailwind (shadow-lg) para un look profesional.
    // 4. Se añade una transición sutil para darle vida al hover.
    <div 
      className="relative p-6 transition duration-300 bg-white border border-gray-100 shadow-lg rounded-xl hover:shadow-xl"
    >
      
      {/* Menú de 3 puntos (Dropdown) */}
      <div className="absolute z-20 top-4 right-4"> {/* z-index alto para flotar */}
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="flex items-center justify-center w-8 h-8 text-gray-500 transition rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <MoreVertical size={20} />
        </button>
        
        {showMenu && (
          <div className="absolute right-0 z-30 mt-2 overflow-hidden bg-white border border-gray-200 rounded-lg shadow-xl w-36">
            
            {/* Botón Modificar */}
            <button
              onClick={() => {
                onEdit(party);
                setShowMenu(false);
              }}
              className="flex items-center w-full gap-2 px-4 py-2 text-sm text-gray-700 transition duration-150 hover:bg-blue-50 hover:text-blue-600"
            >
              <Edit size={16} />
              Modificar
            </button>
            
            {/* Botón Eliminar */}
            <button
              onClick={() => {
                onDelete(party.id);
                setShowMenu(false);
              }}
              className="flex items-center w-full gap-2 px-4 py-2 text-sm text-left text-red-600 transition duration-150 hover:bg-red-50"
            >
              <Trash2 size={16} />
              Eliminar
            </button>
          </div>
        )}
      </div>

      {/* Logo del Partido */}
      <div className="flex justify-center pt-4 mb-6"> {/* Aumentamos el espacio y movemos el padding abajo */}
        {/* Se usa ring/shadow para destacar el logo */}
        <div className="w-24 h-24 overflow-hidden border-4 border-white rounded-full shadow-md bg-gray-50">
          <img 
            src={party.logoUrl || "https://via.placeholder.com/96"} 
            alt={party.name}
            className="object-cover w-full h-full"
            // Se puede añadir una clase para manejar la carga de la imagen
          />
        </div>
      </div>

      {/* Información del Partido */}
      <div className="text-center">
        {/* Título: Texto más grande y prominente */}
        <h3 className="mb-1 text-xl font-bold text-gray-900 truncate" title={party.name}>
          {party.name}
        </h3>
        
        {/* Representante: Destacado pero discreto */}
        <p className="mb-2 text-sm text-gray-600">
          Representante: <span className="font-medium text-gray-700">{party.representative}</span>
        </p>
        
        {/* Candidatos: Texto pequeño y sutil, estilo badge */}
        <div className="inline-block px-3 py-1 mt-3 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full">
          {party.candidates.length} candidato{party.candidates.length !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
  );
}