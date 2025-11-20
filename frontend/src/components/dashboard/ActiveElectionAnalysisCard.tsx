// src/components/dashboard/ActiveElectionAnalysisCard.tsx
import { BarChart3 } from "lucide-react";
import type { Election } from "@/types/election.types";

interface ActiveElectionAnalysisCardProps {
  election: Election | null;
}

export default function ActiveElectionAnalysisCard({
  election,
}: ActiveElectionAnalysisCardProps) {
  if (!election) {
    return (
      <div className="bg-[#eaf2fc] rounded-2xl sm:rounded-[30px] p-4 sm:p-6 shadow-[0_4px_12px_rgba(182,187,211,0.3)] flex items-center justify-center min-h-[100px]">
        <p className="text-gray-500 text-sm sm:text-base text-center">
          No hay elecciones activas.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#eaf2fc] rounded-2xl sm:rounded-[30px] p-4 sm:p-6 shadow-[0_4px_12px_rgba(182,187,211,0.3)] flex items-center justify-between gap-3 transition-transform hover:scale-[1.02]">

      {/* Lado Izquierdo: Texto */}
      <div className="flex flex-col items-start overflow-hidden">
        {/* truncate: corta el texto con '...' si es muy largo para el celular */}
        <h4 className="font-semibold text-gray-800 mb-1 sm:mb-2 text-sm sm:text-lg truncate w-full max-w-[150px] sm:max-w-none">
          {election.name}
        </h4>

        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500 text-white shadow-sm">
          <span className="w-1.5 h-1.5 bg-white rounded-full mr-1.5 animate-pulse"></span>
          Activa
        </span>
      </div>

      {/* Lado Derecho: Icono (Responsive) */}
      {/* w-10 h-10 en móvil, w-16 h-16 en PC (sm) */}
      <div className="bg-blue-100/50 p-2 rounded-full sm:bg-transparent sm:p-0">
        <BarChart3 className="text-[#0f366d] w-8 h-8 sm:w-16 sm:h-16" />
      </div>

    </div>
  );
}