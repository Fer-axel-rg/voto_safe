// src/components/dashboard/StatCard.tsx
// Tarjeta para "Elecciones Vigentes" y "Total de Usuarios"

import { ArrowUp } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  trend?: string; // Para mostrar el "+10M"
}

export default function StatCard({ title, value, trend }: StatCardProps) {
  return (
    <div className="bg-[#eaf2fc] rounded-[10px] font-poppins border-2 min-h-fit min-w-fit p-10 border-blue-950/50 shadow-[0_4px_12px_rgba(182,187,211,0.3)]">
      <h3 className="text-base text-gray-900 font-medium mb-2">{title}</h3>
      {trend ? (
        <div className="flex items-center gap-2">
          <ArrowUp className="text-green-600" size={32} />
          <p className="text-5xl font-bold text-gray-800">{trend}</p>
        </div>
      ) : (
        <p className="text-5xl font-bold text-gray-800">{value}</p>
      )}
    </div>
  );
}