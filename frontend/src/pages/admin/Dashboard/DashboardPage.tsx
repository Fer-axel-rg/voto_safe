import { useDashboardStats } from "@/hooks/useDashboardStats";
import { useNavigate } from "react-router-dom";
import StatCard from "@/components/dashboard/StatCard";
import VoterChartCard from "@/components/dashboard/VoterChartCard";
import UpcomingElectionCard from "@/components/dashboard/UpcomingElectionCard";
import ActiveElectionAnalysisCard from "@/components/dashboard/ActiveElectionAnalysisCard";

export default function DashboardPage() {
  // El hook ahora trae 'activeElections' (Array)
  const { stats, loading } = useDashboardStats();
  const navigate = useNavigate();

  const formatUserCount = (count: number) => {
    if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1).replace('.0', '')}M`;
    if (count >= 1_000) return `${(count / 1_000).toFixed(1).replace('.0', '')}K`;
    return count.toString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 w-full">
        <p className="text-gray-500 animate-pulse">Cargando estadísticas...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1350px] mx-auto px-4 sm:px-6 pb-10 animate-fadeIn">

      {/* --- 1. SECCIÓN SUPERIOR: SALUDO Y ESTADÍSTICAS --- */}
      <div className="mb-8 md:mb-12 border-2 border-blue-950/30 p-4 md:p-6 rounded-2xl bg-white/50 shadow-sm">
        <h1 className="text-2xl md:text-3xl font-bold text-blue-950 mb-6 text-center md:text-left">
          Hola, {stats.adminName}
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 items-center">
          <StatCard
            title="Elecciones Vigentes"
            value={stats.activeElectionsCount}
          />
          <StatCard
            title="Total de Usuarios"
            value={stats.totalUsersCount}
            trend={`+${formatUserCount(stats.totalUsersCount)}`}
          />
          <div className="sm:col-span-2 lg:col-span-1 w-full">
            <VoterChartCard
              title="Votos vs Usuarios"
              percentage={stats.voterPercentage}
              subtitle="Del total de usuarios"
            />
          </div>
        </div>
      </div>

      {/* --- 2. SECCIÓN PRÓXIMAS ELECCIONES --- */}
      <section className="mb-8 md:mb-12 border-2 border-blue-950/30 p-4 md:p-6 rounded-2xl bg-white/50">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-6">
          Próximas Elecciones
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.upcomingElections.length > 0 ? (
            stats.upcomingElections.map((election) => (
              <UpcomingElectionCard key={election.id} election={election} />
            ))
          ) : (
            <>
              <UpcomingElectionCard election={null} />
              <UpcomingElectionCard election={null} />
              <UpcomingElectionCard election={null} />
            </>
          )}
          {/* Placeholders de relleno visual */}
          {stats.upcomingElections.length === 1 && (
            <div className="hidden md:block"><UpcomingElectionCard election={null} /></div>
          )}
          {stats.upcomingElections.length === 2 && (
            <div className="hidden lg:block"><UpcomingElectionCard election={null} /></div>
          )}
        </div>
      </section>

      {/* --- 3. SECCIÓN ANÁLISIS POR ELECCIONES (MAPEO CORREGIDO) --- */}
      <section className="border-2 border-blue-950/30 p-4 md:p-6 rounded-2xl bg-white/50">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-6">
          Análisis por Elecciones Vigentes
        </h2>

        {/* Grid Responsivo: 1 columna en móvil, 2 en desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* AQUÍ ESTÁ EL MAPEO */}
          {stats.activeElections.length > 0 ? (
            stats.activeElections.map((election) => (
              <button
                key={election.id}
                className="w-full bg-white rounded-xl border border-blue-100 shadow-sm 
                                   hover:border-blue-300 hover:shadow-md hover:-translate-y-1 
                                   transition-all duration-200 text-left group focus:outline-none"
                onClick={() => navigate(`/admin/statistics/${election.id}`)}
              >
                <div className="p-2 md:p-4">
                  <ActiveElectionAnalysisCard election={election} />
                </div>
              </button>
            ))
          ) : (
            // Mensaje si no hay ninguna elección activa
            <div className="col-span-full py-10 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
              <p className="font-medium">No hay elecciones activas en este momento.</p>
            </div>
          )}

        </div>
      </section>

    </div>
  );
}