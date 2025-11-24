import { useState, useEffect } from 'react';
import { Search, Filter, Download, Users } from 'lucide-react';
import { useVoters } from '@/hooks/useVoters'; 

const VotersPage = () => {
  // 1. Hook Conectado
  const { voters, stats, loading, searchVoters } = useVoters();

  // 2. Estados locales
  const [searchTerm, setSearchTerm] = useState('');
  const [filterUserType, setFilterUserType] = useState<string>('all');
  const [filterVoteStatus, setFilterVoteStatus] = useState<string>('all');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  // 3. Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 15;

  // 4. Manejo de Búsqueda (Debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      searchVoters(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, searchVoters]);

  // 5. Filtrado en Cliente
  const filteredVoters = voters.filter((v) => {
    const matchType = filterUserType === 'all' || v.tipo === filterUserType;
    let matchStatus = true;
    if (filterVoteStatus !== 'all') {
      matchStatus = v.estado === filterVoteStatus;
    }
    const matchDept = filterDepartment === 'all' || v.departamento === filterDepartment;
    return matchType && matchStatus && matchDept;
  });

  // --- CORRECCIÓN AQUÍ (Faltaba definir endIndex) ---
  const totalPages = Math.ceil(filteredVoters.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE; // <--- ESTA LÍNEA FALTABA
  const currentVoters = filteredVoters.slice(startIndex, endIndex);

  const uniqueDepartaments = Array.from(new Set(voters.map(v => v.departamento))).sort();

  // Exportar CSV
  const handleExportCSV = () => {
    const headers = ['DNI','Nombres','Apellidos', 'Fecha Nac.', 'Tipo','Departamento','Estado','Eleccion'];
    const csvContent = [
      headers.join(','),
      ...filteredVoters.map((v) => [
        v.dni,
        v.nombres,
        v.apellidos,
        v.fechaNacimiento,
        v.tipo,
        v.departamento,
        v.estado,
        v.eleccion
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], {type: 'text/csv;charset=utf-8;'});
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `votantes_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="mx-auto max-w-7xl animate-fadeIn">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-gray-800">Lista de Usuarios Votantes</h1>
            <p className="text-gray-600">Gestiona y visualiza todos los votantes registrados</p>
          </div>
          <button onClick={handleExportCSV} className="flex items-center gap-2 px-6 py-3 text-white transition-colors bg-green-600 rounded-lg shadow-md hover:bg-green-700">
            <Download size={20} /> Exportar CSV
          </button>
        </div>

        {/* Tarjetas de Estadísticas */}
        <div className="grid grid-cols-2 gap-4 mb-6 md:grid-cols-5">
          <StatCard color="blue" title="Total" value={stats.total} />
          <StatCard color="green" title="Votaron" value={stats.votaron} />
          <StatCard color="red" title="No Votaron" value={stats.noVotaron} />
          <StatCard color="purple" title="Admins" value={stats.admins} />
          <StatCard color="yellow" title="Users" value={stats.users} />
        </div>

        {/* Buscador y Filtros */}
        <div className="p-4 bg-white shadow-md rounded-xl">
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" size={20} />
              <input
                type="text"
                placeholder="Buscar por DNI, nombre o apellido..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-3 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 px-6 py-3 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200">
              <Filter size={20} /> Filtros
            </button>
          </div>

          {showFilters && (
             <div className="grid grid-cols-1 gap-4 pt-4 border-t border-gray-200 md:grid-cols-3">
               <div>
                 <label className="block mb-2 text-sm font-medium text-gray-700">Tipo de Usuario</label>
                 <select value={filterUserType} onChange={(e) => setFilterUserType(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                   <option value="all">Todos</option>
                   <option value="admin">Admin</option>
                   <option value="user">User</option>
                 </select>
               </div>
               <div>
                 <label className="block mb-2 text-sm font-medium text-gray-700">Estado de Voto</label>
                 <select value={filterVoteStatus} onChange={(e) => setFilterVoteStatus(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                   <option value="all">Todos</option>
                   <option value="voto">Votaron</option>
                   <option value="no voto">No Votaron</option>
                 </select>
               </div>
               <div>
                 <label className="block mb-2 text-sm font-medium text-gray-700">Departamento</label>
                 <select value={filterDepartment} onChange={(e) => setFilterDepartment(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                   <option value="all">Todos</option>
                   {uniqueDepartaments.map((dep) => (
                      <option key={dep} value={dep}>{dep}</option>
                   ))}
                 </select>
               </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-hidden bg-white shadow-md rounded-xl">
        {loading ? (
            <div className="p-10 text-center text-gray-500">Cargando datos...</div>
        ) : (
            <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                    {['DNI', 'Nombres', 'Apellidos', 'Fecha Nac.', 'Tipo', 'Departamento', 'Estado', 'Elección'].map(h => (
                        <th key={h} className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase">{h}</th>
                    ))}
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                {currentVoters.map((voter) => (
                    <tr key={voter.dni} className="transition-colors hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">{voter.dni}</td>
                    <td className="px-6 py-4 text-sm text-black whitespace-nowrap">{voter.nombres}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">{voter.apellidos}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                        {voter.fechaNacimiento ? new Date(voter.fechaNacimiento).toLocaleDateString('es-PE') : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            voter.tipo === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                        {voter.tipo}
                        </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">{voter.departamento}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            voter.estado === 'voto' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                        {voter.estado === 'voto' ? 'Votó' : 'No Votó'}
                        </span>
                    </td>
                    <td className="max-w-xs px-6 py-4 text-sm text-gray-700 truncate">
                        {voter.estado === 'no voto' ? 'Pendiente' : voter.eleccion}
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        )}
        
        {/* Footer con Paginación */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
                <p className="text-sm text-gray-700">
                    Mostrando <span className="font-semibold">{startIndex + 1}</span> a{' '}
                    <span className="font-semibold">{Math.min(endIndex, filteredVoters.length)}</span> de{' '}
                    <span className="font-semibold">{filteredVoters.length}</span> votantes
                </p>
                <div className="flex gap-2">
                    <button disabled={currentPage===1} onClick={() => setCurrentPage(p => p-1)} className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50">Anterior</button>
                    <span>{currentPage} / {totalPages}</span>
                    <button disabled={currentPage===totalPages} onClick={() => setCurrentPage(p => p+1)} className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50">Siguiente</button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

// --- COMPONENTE StatCard CORREGIDO (Tailwind Friendly) ---
const colorMap: Record<string, string> = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    red: "from-red-500 to-red-600",
    purple: "from-purple-500 to-purple-600",
    yellow: "from-yellow-500 to-yellow-600",
};

interface StatCardProps {
    title: string;
    value: string | number;
    color: string;
}

const StatCard = ({ color, title, value }: StatCardProps) => (
    <div className={`bg-gradient-to-br ${colorMap[color] || 'from-gray-300 to-gray-500'} rounded-xl p-4 text-white shadow-lg`}>
        <div className="flex items-center gap-2 mb-2">
            <Users size={20} />
            <span className="text-sm font-medium opacity-90">{title}</span>
        </div>
        <p className="text-3xl font-bold">{value}</p>
    </div>
);

export default VotersPage;