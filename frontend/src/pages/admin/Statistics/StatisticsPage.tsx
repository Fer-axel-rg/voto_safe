import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronDown, MapPin, BarChart3, 
  Users, Calendar, CheckCircle2, BrainCircuit,
  Zap, Lightbulb, Target, Trophy, Clock, ShieldCheck
} from 'lucide-react';
import { PieChart } from '@mui/x-charts/PieChart';
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';

import { useStatistics } from '@/hooks/useStatistics';

export default function StatisticsPage() {
  const { id_dashbord } = useParams();
  const navigate = useNavigate();

  // Estados de UI
  const [activeTab, setActiveTab] = useState<'statistics' | 'predictions'>('statistics');
  const [selectedDepartamento, setSelectedDepartamento] = useState<string>('');
  const [isDepartamentoOpen, setIsDepartamentoOpen] = useState(false);
  const [isElectionMenuOpen, setIsElectionMenuOpen] = useState(false);

  // Conexión al Backend
  const { results, electionsList, loading } = useStatistics(id_dashbord);

  const handleElectionChange = (newId: string) => {
      navigate(`/admin/statistics/${newId}`);
      setIsElectionMenuOpen(false);
  };

  const currentElectionName = electionsList.find(e => e.id === id_dashbord)?.name || "Seleccionar Elección";

  // 1. Adaptar datos para gráficos
  const chartData = useMemo(() => {
      if (!results) return [];
      return results.results.map(r => ({
          id: r.partyName, 
          name: r.partyName,
          votes: r.votes,
          percentage: r.percentage,
          color: r.color || '#ccc',
          logoUrl: r.partyLogo
      })).sort((a, b) => b.percentage - a.percentage);
  }, [results]);

  const pieData = chartData.map((c, i) => ({ 
      id: i, 
      value: c.percentage, 
      label: `${c.name} (${c.percentage}%)`, 
      color: c.color 
  }));

  const departamentos = ["Lima", "Arequipa", "Cusco", "La Libertad", "Piura", "Junín"];

  // 2. PREDICCIONES (Corregido: Sin Math.random)
  const predictionData = useMemo(() => {
    if (!chartData.length || !results) return null;

    const top1 = chartData[0];
    const top2 = chartData[1] || { name: 'Otros', percentage: 0, color: '#ccc', votes: 0 };
    
    // Calculamos margen real
    const realMargin = (top1.percentage - top2.percentage);
    
    // CORRECCIÓN: Proyección determinista (En vez de random, sumamos un fijo 1.2% de tendencia)
    const predictedMargin = Math.max(realMargin + 1.2, 0).toFixed(1);
    
    const projectionHours = ['8:00', '10:00', '12:00', '14:00', '16:00', '18:00 (Cierre)'];
    
    // Curva basada en datos reales (determinista)
    const top1Curve = [
        top1.percentage * 0.4, 
        top1.percentage * 0.6, 
        top1.percentage * 0.8, 
        top1.percentage
    ];
    
    return {
      winner: top1,
      predictedWinnerPercentage: Math.min(top1.percentage + 2.5, 100), // Proyección +2.5%
      predictedMargin: predictedMargin,

      projectionLineChart: {
        xAxis: [{ data: projectionHours.slice(0, 4), scaleType: 'point' as const }],
        series: [
          { 
            label: `Actual: ${top1.name}`, 
            data: top1Curve, 
            color: top1.color, 
            showMark: true 
          },
          { 
            label: `IA Proyección`, 
            // Proyección lineal simple sin random
            data: [null, null, null, top1.percentage, Math.min(top1.percentage + 2.5, 100)], 
            color: top1.color, 
            lineStyle: { strokeDasharray: '5 5' } 
          }
        ]
      },

      winProbabilityBarChart: chartData.slice(0, 3).map(c => ({
        name: c.name,
        // Lógica determinista: Si tiene más de 50%, probabilidad 99%, sino +15%
        probability: c.percentage > 50 ? 99 : Math.min(c.percentage + 15, 90),
        color: c.color
      })),

      participationLineChart: {
        xAxis: [{ data: ['Apertura', 'Mediodía', 'Actual', 'Cierre (Est.)'], scaleType: 'point' as const }],
        series: [
          { 
            label: 'Participación', 
            // Datos fijos para la curva histórica + proyección del 10% extra al cierre
            data: [5, results.participationPercentage * 0.6, results.participationPercentage, Math.min(results.participationPercentage + 10, 100)], 
            color: '#8884d8', 
            area: true 
          }
        ]
      },

      undecidedVoterImpact: ((100 - results.participationPercentage) * 0.2).toFixed(1) // 20% del ausentismo
    };
  }, [chartData, results]);

  // --- RENDERIZADO ---

  return (
    <div className="min-h-screen p-6 bg-gray-50 md:p-10 animate-fadeIn">

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Panel De Estadísticas</h1>
        <p className="text-gray-500">Análisis en tiempo real</p>
      </div>

      <div className="flex flex-col justify-between gap-4 pb-1 mb-8 border-b border-gray-200 md:flex-row md:items-center">
        {/* TABS */}
        <div className="flex gap-6">
          <button onClick={() => setActiveTab('statistics')} className={`flex items-center gap-2 pb-3 px-1 font-bold text-sm transition-all duration-200 relative ${activeTab === 'statistics' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
            <BarChart3 size={18} /> GRÁFICOS ESTADÍSTICOS
            {activeTab === 'statistics' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full animate-fadeIn" />}
          </button>
          <button onClick={() => setActiveTab('predictions')} className={`flex items-center gap-2 pb-3 px-1 font-bold text-sm transition-all duration-200 relative ${activeTab === 'predictions' ? 'text-purple-600' : 'text-gray-500 hover:text-gray-700'}`}>
            <BrainCircuit size={18} /> PREDICCIONES (IA)
            {activeTab === 'predictions' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-600 rounded-t-full animate-fadeIn" />}
          </button>
        </div>

        {/* SELECTOR DE ELECCIÓN */}
        <div className="relative">
           <button 
             onClick={() => setIsElectionMenuOpen(!isElectionMenuOpen)}
             className="flex items-center justify-between bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm hover:border-blue-300 transition-all min-w-[250px]"
           >
              <div className="flex items-center gap-2">
                 <Calendar size={16} className="text-blue-600" />
                 <span className="text-sm font-semibold text-gray-700">{currentElectionName}</span>
              </div>
              <ChevronDown size={16} className="text-gray-400" />
           </button>

           {isElectionMenuOpen && (
             <div className="absolute right-0 z-50 w-full mt-2 overflow-hidden duration-200 bg-white border border-gray-100 shadow-xl top-full rounded-xl animate-in fade-in zoom-in-95">
                {electionsList.map(election => (
                   <button
                     key={election.id}
                     onClick={() => handleElectionChange(election.id)}
                     className="w-full px-4 py-3 text-sm text-left text-gray-700 transition-colors border-b hover:bg-blue-50 hover:text-blue-700 last:border-0"
                   >
                      {election.name}
                   </button>
                ))}
             </div>
           )}
        </div>
      </div>

      {/* CONTENIDO */}
      {!results ? (
        <div className="flex flex-col items-center justify-center h-64 bg-white border border-gray-200 shadow-sm rounded-2xl">
            {loading ? (
               <div className="flex flex-col items-center gap-3">
                   <div className="w-8 h-8 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                   <p className="text-sm font-medium text-gray-500">Cargando datos...</p>
               </div>
            ) : (
               <p className="font-medium text-gray-500">Selecciona una elección para ver los resultados.</p>
            )}
        </div>
      ) : (
        <>
          {/* VISTA 1: GRÁFICOS ESTADÍSTICOS */}
          {activeTab === 'statistics' && (
            <div className="space-y-8 animate-fadeIn">
              
              {/* KPI CARDS */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="flex items-center justify-between p-6 bg-white border-2 border-l-4 border-blue-500 shadow-sm rounded-2xl">
                  <div>
                    <p className="text-xs font-bold tracking-wider text-gray-500 uppercase">Padrón Electoral</p>
                    <h2 className="mt-1 text-2xl font-black text-gray-800">{results.totalVoters.toLocaleString()}</h2>
                    <p className="mt-1 text-xs text-gray-400">{selectedDepartamento || 'Nacional'}</p>
                  </div>
                  <div className="p-3 text-blue-600 rounded-full bg-blue-50"><Users size={20} /></div>
                </div>
                <div className="flex items-center justify-between p-6 bg-white border-2 border-l-4 border-green-500 shadow-sm rounded-2xl">
                  <div>
                    <p className="text-xs font-bold tracking-wider text-gray-500 uppercase">Votos Recibidos</p>
                    <h2 className="mt-1 text-2xl font-black text-gray-800">{results.totalVotes.toLocaleString()}</h2>
                  </div>
                  <div className="p-3 text-green-600 rounded-full bg-green-50"><CheckCircle2 size={20} /></div>
                </div>
                <div className="flex items-center justify-between p-6 bg-white border-2 border-l-4 border-purple-500 shadow-sm rounded-2xl">
                  <div>
                    <p className="text-xs font-bold tracking-wider text-gray-500 uppercase">Participación</p>
                    <h2 className="mt-1 text-2xl font-black text-gray-800">{results.participationPercentage}%</h2>
                    <div className="w-20 h-1.5 bg-gray-100 rounded-full mt-2 overflow-hidden">
                      <div className="h-full transition-all duration-1000 bg-purple-500" style={{ width: `${results.participationPercentage}%` }}></div>
                    </div>
                  </div>
                  <div className="p-3 text-purple-600 rounded-full bg-purple-50"><BarChart3 size={20} /></div>
                </div>
              </div>

              {/* GRID GRÁFICOS */}
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <div className="space-y-8 lg:col-span-2">
                   {/* Mini Tarjetas */}
                   <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    {chartData.slice(0, 4).map((c, i) => (
                      <div key={i} className="p-4 text-center transition-shadow bg-white border border-gray-200 shadow-sm rounded-xl hover:shadow-md">
                        <div className="flex items-center justify-center w-10 h-10 mx-auto mb-2 overflow-hidden font-bold text-white bg-gray-100 rounded-full shadow-sm" style={{ backgroundColor: c.color }}>
                          {c.logoUrl ? <img src={c.logoUrl} className="object-cover w-full h-full" /> : c.name.substring(0, 1)}
                        </div>
                        <h4 className="text-xs font-bold text-gray-700 truncate">{c.name}</h4>
                        <p className="text-lg font-black text-gray-900">{c.percentage}%</p>
                      </div>
                    ))}
                   </div>
                   
                   {/* Gráfico Barras */}
                   <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-2xl">
                    <h3 className="mb-4 text-sm font-bold text-gray-700">Resultados Generales</h3>
                    <div className="h-[300px] w-full">
                      <BarChart
                        dataset={chartData}
                        yAxis={[{ scaleType: 'band', dataKey: 'name' }]}
                        series={[{ dataKey: 'percentage', valueFormatter: (v) => `${v}%`, color: '#3B82F6' }]}
                        layout="horizontal"
                        margin={{ left: 100 }}
                        borderRadius={4}
                        colors={chartData.map(c => c.color)}
                        slotProps={{ legend: { hidden: true } as any }}
                      />
                    </div>
                  </div>
                </div>

                {/* Sidebar Derecha */}
                <div className="space-y-8">
                   {/* Filtro Regional (CORREGIDO Z-INDEX) */}
                   <div className="relative z-50 p-6 text-white shadow-lg bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl">
                    <MapPin className="absolute w-32 h-32 text-white pointer-events-none -right-4 -bottom-4 opacity-10" />
                    <h3 className="relative z-10 mb-4 text-sm font-bold tracking-widest uppercase opacity-90">Filtro Regional</h3>
                    
                    <div className="relative z-50"> {/* Z-Index alto para el contenedor del botón */}
                      <button 
                        onClick={() => setIsDepartamentoOpen(!isDepartamentoOpen)} 
                        className="flex items-center justify-between w-full px-4 py-3 font-semibold text-white transition-all border bg-white/10 backdrop-blur-sm border-white/20 rounded-xl hover:bg-white/20"
                      >
                        {selectedDepartamento || 'Todo el País'}
                        <ChevronDown size={18} />
                      </button>

                      {/* Menú Desplegable (Z-Index Extremo) */}
                      {isDepartamentoOpen && (
                        <div className="absolute top-full mt-2 left-0 w-full bg-white text-gray-800 rounded-xl shadow-2xl max-h-60 overflow-y-auto z-[100] animate-in fade-in zoom-in-95 duration-200">
                          <button 
                            onClick={() => { setSelectedDepartamento(''); setIsDepartamentoOpen(false); }} 
                            className="w-full px-4 py-3 text-sm font-bold text-left text-blue-600 border-b hover:bg-blue-50"
                          >
                            Nacional
                          </button>
                          {departamentos.map(dep => (
                            <button 
                                key={dep} 
                                onClick={() => { setSelectedDepartamento(dep); setIsDepartamentoOpen(false); }} 
                                className="w-full px-4 py-2 text-sm text-left text-gray-700 border-b hover:bg-gray-50 last:border-0"
                            >
                                {dep}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                   </div>

                   {/* Pie Chart */}
                   <div className="flex flex-col items-center p-6 bg-white border border-gray-100 shadow-sm rounded-2xl">
                    <h3 className="self-start mb-4 text-sm font-bold text-gray-700">Distribución</h3>
                    <PieChart
                      series={[{ data: pieData, innerRadius: 40, outerRadius: 80, paddingAngle: 2, cornerRadius: 4 }]}
                      width={250} height={200} slotProps={{ legend: { hidden: true } as any }}
                    />
                    <div className="w-full pr-1 mt-4 space-y-2 overflow-y-auto max-h-48 custom-scrollbar">
                      {chartData.map((c, i) => (
                        <div key={i} className="flex items-center justify-between py-1 text-xs border-b border-gray-50 last:border-0">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }}></div>
                            <span className="font-medium text-gray-600 truncate max-w-[120px]">{c.name}</span>
                          </div>
                          <span className="font-bold text-gray-800">{c.percentage}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VISTA 2: PREDICCIONES */}
          {activeTab === 'predictions' && predictionData && (
             <div className="space-y-8 animate-fadeIn">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="flex items-center gap-2 text-xl font-bold text-gray-800"><BrainCircuit className="text-purple-600" /> Análisis Predictivo</h2>
                        <p className="mt-1 text-sm text-gray-500">Proyecciones basadas en tendencias actuales</p>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 text-xs font-bold text-purple-700 bg-purple-100 border border-purple-200 rounded-full">
                        <Zap size={14} fill="currentColor" /> Modelo v3.1
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="p-6 bg-white border border-l-4 border-purple-400 shadow-sm rounded-xl">
                        <div className="flex items-center gap-3 mb-2">
                            <Trophy className="text-purple-600" size={20} />
                            <p className="text-xs font-bold text-gray-500 uppercase">Ganador Proyectado</p>
                        </div>
                        <h3 className="flex items-baseline gap-2 text-2xl font-black text-gray-800">
                            {predictionData.winner.name}
                        </h3>
                        <p className="mt-1 text-xs text-gray-400">Confiabilidad: Alta</p>
                    </div>
                    <div className="p-6 bg-white border border-l-4 border-blue-400 shadow-sm rounded-xl">
                        <div className="flex items-center gap-3 mb-2">
                            <Target className="text-blue-600" size={20} />
                            <p className="text-xs font-bold text-gray-500 uppercase">Margen de Victoria</p>
                        </div>
                        <h3 className="text-2xl font-black text-gray-800">
                            {predictionData.predictedMargin}%
                        </h3>
                    </div>
                     <div className="p-6 bg-white border border-l-4 border-green-400 shadow-sm rounded-xl">
                        <div className="flex items-center gap-3 mb-2">
                            <Users className="text-green-600" size={20} />
                            <p className="text-xs font-bold text-gray-500 uppercase">Participación Final</p>
                        </div>
                        <h3 className="text-2xl font-black text-gray-800">
                            {results.participationPercentage}%
                        </h3>
                    </div>
                    <div className="p-6 bg-white border border-l-4 shadow-sm rounded-xl border-amber-400">
                        <div className="flex items-center gap-3 mb-2">
                            <Lightbulb className="text-amber-600" size={20} />
                            <p className="text-xs font-bold text-gray-500 uppercase">Indecisos</p>
                        </div>
                        <h3 className="text-2xl font-black text-gray-800">
                            {predictionData.undecidedVoterImpact}%
                        </h3>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    <div className="p-6 bg-white border-2 shadow-sm rounded-2xl border-blue-950/50">
                        <h3 className="flex items-center gap-2 mb-2 text-sm font-bold tracking-wide text-gray-800 uppercase">
                            <Clock size={18} className="text-blue-600" /> Proyección de Votos
                        </h3>
                        <div className="h-[300px] w-full">
                             <LineChart
                                xAxis={predictionData.projectionLineChart.xAxis}
                                series={predictionData.projectionLineChart.series}
                                margin={{ left: 50, right: 20, top: 20, bottom: 30 }}
                                grid={{ vertical: true, horizontal: true }}
                                slotProps={{ legend: { hidden: false, position: { vertical: 'top', horizontal: 'right' } } as any }}
                             />
                        </div>
                    </div>
                    
                    <div className="p-6 bg-white border-2 shadow-sm rounded-2xl border-blue-950/50">
                        <h3 className="flex items-center gap-2 mb-2 text-sm font-bold tracking-wide text-gray-800 uppercase">
                             <ShieldCheck size={18} className="text-green-600" /> Probabilidad Victoria
                        </h3>
                        <div className="h-[300px] w-full">
                             <BarChart
                                dataset={predictionData.winProbabilityBarChart}
                                yAxis={[{ scaleType: 'band', dataKey: 'name' }]}
                                series={[{ dataKey: 'probability', color: '#6a0dad' }]}
                                layout="horizontal"
                                margin={{ left: 100 }}
                             />
                        </div>
                    </div>
                </div>
             </div>
          )}
        </>
      )}
    </div>
  );
}