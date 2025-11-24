import { useState } from "react";
import { Search, Filter } from "lucide-react";

// 👇 AQUÍ ESTABA EL ERROR: Faltaba el 'export'
export interface ElectionFiltersState {
  name: string;
  status: string;
}

interface Props {
  onFilterChange: (filters: ElectionFiltersState) => void;
}

export default function ElectionFilters({ onFilterChange }: Props) {
  const [filters, setFilters] = useState<ElectionFiltersState>({
    name: "",
    status: "all",
  });

  const handleChange = (key: keyof ElectionFiltersState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="p-4 mb-6 bg-white border border-gray-100 shadow-sm rounded-xl animate-fadeIn">
      <div className="flex flex-col items-center gap-4 md:flex-row">
        
        <div className="relative flex-1 w-full">
          <Search className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" size={20} />
          <input
            type="text"
            placeholder="Buscar elección..."
            value={filters.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
          />
        </div>

        <div className="flex items-center w-full gap-2 md:w-auto">
          <Filter size={20} className="text-gray-500" />
          <select
            value={filters.status}
            onChange={(e) => handleChange("status", e.target.value)}
            className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 md:w-48"
          >
            <option value="all">Todos los estados</option>
            <option value="active">Activa</option>
            <option value="upcoming">Por Comenzar</option>
            <option value="finished">Finalizada</option>
          </select>
        </div>
      </div>
    </div>
  );
}