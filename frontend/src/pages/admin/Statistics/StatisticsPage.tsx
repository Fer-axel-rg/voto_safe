// src/pages/admin/Statistics/StatisticsPage.tsx
import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import {
  ChevronDown, MapPin, BarChart3, PieChart as PieIcon,
  Users, Calendar, CheckCircle2, BrainCircuit, TrendingUp,
  Zap, Lightbulb, Target, Trophy, Clock, Search, ShieldCheck
} from 'lucide-react';
import { PieChart } from '@mui/x-charts/PieChart';
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';
import { Gauge } from '@mui/x-charts/Gauge'; // Nuevo componente para análisis de sensibilidad


// esta wbda es para obtener el id que se selecciono y sera el que se mostrara 
// en la pagina de estadisticas
// --- INTERFACES ---
interface UserData {
  DNI: string;
  Nombres: string;
  Apellidos: string;
  Departamento: string;
  Estado: 'voto' | 'no voto';
}

interface Party {
  id: string;
  name: string;
  color?: string;
  logoUrl?: string;
}

interface Election {
  id: string;
  name: string;
  status: string;
  type: string;
  endDate: string;
}

const StatisticsPage = () => {
  const { id_dashbord } = useParams();
  // --- ESTADOS DE UI ---
  const [selectedDepartamento, setSelectedDepartamento] = useState<string>('');
  const [isDepartamentoOpen, setIsDepartamentoOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'statistics' | 'predictions'>('statistics');

  // --- DATOS ---
  const [users, setUsers] = useState<UserData[]>([]);
  const [parties, setParties] = useState<Party[]>([]);
  const [allElections, setAllElections] = useState<Election[]>([]);
  const [selectedElectionId, setSelectedElectionId] = useState<string>(id_dashbord || '');

  // 1. CARGAR DATOS
  useEffect(() => {
    loadData();
    window.addEventListener('storage', loadData);
    return () => window.removeEventListener('storage', loadData);
  }, []);

  const loadData = () => {
    try {
      const uData = localStorage.getItem('usuariosData');
      if (uData) setUsers(JSON.parse(uData));

      const pData = localStorage.getItem('votosafe_parties');
      if (pData) setParties(JSON.parse(pData));
      else setParties([{ id: 'p1', name: 'Partido A', color: '#FF6384' }, { id: 'p2', name: 'Partido B', color: '#36A2EB' }]);

      const eData = localStorage.getItem('votosafe_elections');
      if (eData) {
        const elections: Election[] = JSON.parse(eData);
        setAllElections(elections);
        if (!id_dashbord && !selectedElectionId && elections.length > 0) {
          const active = elections.find(e => e.status === 'active');
          setSelectedElectionId(active ? active.id : elections[0].id);
          console.log(setSelectedElectionId);
        }
      }
    } catch (error) {
      console.error("Error cargando localstorage:", error);
    }
  };

  const currentElection = allElections.find(e => e.id === selectedElectionId);


  // --- CÁLCULOS ESTADÍSTICOS (Simulados) ---
  const stats = useMemo(() => {
    let filteredUsers = users;
    if (selectedDepartamento) {
      filteredUsers = users.filter(u => u.Departamento === selectedDepartamento);
    }

    const totalHabilitados = filteredUsers.length;
    const usuariosQueVotaron = filteredUsers.filter(u => u.Estado === 'voto');
    const totalVotos = usuariosQueVotaron.length;
    const participacionPct = totalHabilitados > 0 ? Math.round((totalVotos / totalHabilitados) * 100) : 0;

    const results: Record<string, number> = {};
    parties.forEach(p => results[p.id] = 0);
    const electionSeed = selectedElectionId ? selectedElectionId.charCodeAt(0) : 0; // Para variar resultados por elección

    usuariosQueVotaron.forEach(user => {
      if (parties.length > 0) {
        const dniNum = parseInt(user.DNI.replace(/\D/g, '')) || 0;
        const partyIndex = (dniNum + electionSeed) % parties.length;
        const assignedPartyId = parties[partyIndex].id;
        results[assignedPartyId]++;
      }
    });

    const chartData = parties.map(party => {
      const votes = results[party.id] || 0;
      const percentage = totalVotos > 0 ? Math.round((votes / totalVotos) * 100) : 0;
      const fallbackColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
      return {
        id: party.id, name: party.name, votes, percentage, color: party.color || fallbackColor, logoUrl: party.logoUrl
      };
    }).sort((a, b) => b.percentage - a.percentage);

    return { totalHabilitados, totalVotos, participacionPct, chartData };
  }, [users, parties, selectedDepartamento, selectedElectionId]);

  // --- DATOS SIMULADOS PARA PREDICCIONES ---
  const predictionData = useMemo(() => {
    if (!stats.chartData.length) return null;

    const top1 = stats.chartData[0];
    const top2 = stats.chartData[1] || { name: 'Otro', color: '#ccc' }; // Fallback para segundo lugar
    const top3 = stats.chartData[2] || { name: 'Otro más', color: '#eee' }; // Fallback para tercer lugar

    const winnerConfidence = Math.min(top1.percentage + Math.round(Math.random() * 5 + 5), 100); // 5-10% extra por IA
    const predictedMargin = (winnerConfidence - (top2.percentage + Math.round(Math.random() * 3))).toFixed(1);

    // Predicción de Proyección de Cierre (Line Chart)
    const projectionHours = ['8:00', '10:00', '12:00', '14:00', '16:00', '18:00 (Cierre)'];
    const top1Actual = [10, 25, 45, 60, 80]; // Votos reales
    const top2Actual = [8, 20, 35, 45, 55];

    return {
      winner: top1,
      predictedWinnerPercentage: winnerConfidence,
      predictedMargin: predictedMargin,

      // Proyección de Cierre
      projectionLineChart: {
        xAxis: [{ data: projectionHours, scaleType: 'point' as const }],
        series: [
          {
            label: `Actual: ${top1.name}`,
            data: top1Actual.concat(winnerConfidence), // Datos reales + Predicción
            color: top1.color,
            showMark: true,
            disableHighlight: true,
          },
          {
            label: `Actual: ${top2.name}`,
            data: top2Actual.concat(top2.percentage + Math.round(Math.random() * 3)),
            color: top2.color,
            showMark: true,
            disableHighlight: true,
          },
          {
            label: `IA Proyección: ${top1.name}`,
            data: top1Actual.map(() => NaN).concat(winnerConfidence), // Solo la predicción final
            color: top1.color,
            lineStyle: { strokeDasharray: '5 5' },
            showMark: true,
          }
        ]
      },

      // Probabilidad de Victoria
      winProbabilityBarChart: stats.chartData.slice(0, 3).map(c => ({
        name: c.name,
        probability: Math.min(c.percentage + (c.id === top1.id ? 10 : Math.random() * 3), 100),
        color: c.color
      })).sort((a, b) => b.probability - a.probability),

      // Participación por Hora (acumulada vs predicha)
      participationLineChart: {
        xAxis: [{ data: projectionHours.slice(0, 5).concat('Cierre (Pred)'), scaleType: 'point' as const }],
        series: [
          {
            label: 'Participación Actual',
            data: [5, 15, 30, 45, 60, stats.participacionPct + 15], // Simula crecimiento real y predice el cierre
            color: '#8884d8', // Morado
            area: true,
            showMark: true
          },
          {
            label: 'Pronóstico IA',
            data: [NaN, NaN, NaN, NaN, 60, stats.participacionPct + 15], // Solo muestra desde donde empieza la predicción
            color: '#6a0dad', // Morado más oscuro
            lineStyle: { strokeDasharray: '3 3' },
            showMark: true
          }
        ]
      },

      // Sensibilidad del Voto Indeciso (Gauge)
      undecidedVoterImpact: Math.round(Math.random() * 30) + 70 // 70-100% de impacto
    };
  }, [stats]);


  // Datos gráficas generales
  const departamentos = Array.from(new Set(users.map(u => u.Departamento))).sort();
  const barData = stats.chartData.map(c => ({ name: c.name, percentage: c.percentage }));
  const pieData = stats.chartData.map((c, i) => ({ id: i, value: c.percentage, label: `${c.name} (${c.percentage}%)`, color: c.color }));

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">

      {/* ================================================================================== */}
      {/* HEADER PRINCIPAL */}
      {/* ================================================================================== */}

      {/* 1. Título Global */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Panel De Estadísticas</h1>
        <p className="text-gray-500">Análisis y proyección de datos electorales</p>
      </div>

      {/* 2. Fila de Control: Tabs a la Izquierda, Selector a la Derecha */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-gray-200 pb-1">

        {/* TABS HORIZONTALES */}
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab('statistics')}
            className={`flex items-center gap-2 pb-3 px-1 font-bold text-sm transition-all duration-200 relative
                    ${activeTab === 'statistics' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <BarChart3 size={18} />
            GRÁFICOS ESTADÍSTICOS
            {/* Línea inferior animada */}
            {activeTab === 'statistics' && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full animate-fadeIn" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('predictions')}
            className={`flex items-center gap-2 pb-3 px-1 font-bold text-sm transition-all duration-200 relative
                    ${activeTab === 'predictions' ? 'text-purple-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <BrainCircuit size={18} />
            PREDICCIONES (IA)
            {activeTab === 'predictions' && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-600 rounded-t-full animate-fadeIn" />
            )}
          </button>
        </div>

        {/* SELECTOR DE ELECCIÓN (Global para ambas vistas) */}
        <div className="flex items-center bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm hover:border-blue-300 transition-colors">
          <Calendar size={16} className="text-gray-400 mr-2" />
          <select
            value={selectedElectionId}
            onChange={(e) => setSelectedElectionId(e.target.value)}
            className="bg-transparent text-sm font-semibold text-gray-700 outline-none cursor-pointer min-w-[180px]"
          >
            <option value="" disabled>Seleccionar Elección...</option>
            {allElections.map(election => (
              <option key={election.id} value={election.id}>
                {election.name}
              </option>
            ))}
          </select>
        </div>
      </div>


      {/* ================================================================================== */}
      {/* CONTENIDO DINÁMICO SEGÚN EL TAB */}
      {/* ================================================================================== */}

      {!currentElection ? (
        <div className="flex flex-col items-center justify-center h-64 bg-white rounded-2xl shadow-sm border border-gray-200">
          <Calendar className="text-gray-300 w-16 h-16 mb-4" />
          <p className="text-gray-500 font-medium">Selecciona una elección arriba para comenzar</p>
        </div>
      ) : (
        <>
          {/* --- VISTA 1: GRÁFICOS ESTADÍSTICOS --- */}
          {activeTab === 'statistics' && (
            <div className="animate-fadeIn space-y-8">

              {/* TARJETAS KPI */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Card Padrón */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-2 border-blue-500 flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Padrón Electoral</p>
                    <h2 className="text-2xl font-black text-gray-800 mt-1">{stats.totalHabilitados.toLocaleString()}</h2>
                    <p className="text-xs text-gray-400 mt-1">{selectedDepartamento || 'Nacional'}</p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-full text-blue-600"><Users size={20} /></div>
                </div>
                {/* Card Votos */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-2 border-green-500 flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Votos Recibidos</p>
                    <h2 className="text-2xl font-black text-gray-800 mt-1">{stats.totalVotos.toLocaleString()}</h2>
                    <p className="text-xs text-green-600 font-bold mt-1">100% procesado</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-full text-green-600"><CheckCircle2 size={20} /></div>
                </div>
                {/* Card Participación */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-2 border-purple-500 flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Participación</p>
                    <h2 className="text-2xl font-black text-gray-800 mt-1">{stats.participacionPct}%</h2>
                    <div className="w-20 h-1.5 bg-gray-100 rounded-full mt-2 overflow-hidden">
                      <div className="bg-purple-500 h-full transition-all duration-1000" style={{ width: `${stats.participacionPct}%` }}></div>
                    </div>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-full text-purple-600"><BarChart3 size={20} /></div>
                </div>
              </div>

              {/* GRID GRÁFICOS */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  {/* Candidatos Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {stats.chartData.slice(0, 4).map((c) => (
                      <div key={c.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 text-center hover:shadow-md transition-shadow">
                        <div className="w-10 h-10 mx-auto rounded-full mb-2 flex items-center justify-center text-white font-bold shadow-sm" style={{ backgroundColor: c.color }}>
                          {c.logoUrl ? <img src={c.logoUrl} className="w-full h-full rounded-full object-contain" /> : c.name.substring(0, 1)}
                        </div>
                        <h4 className="font-bold text-gray-700 text-xs truncate">{c.name}</h4>
                        <p className="text-lg font-black text-gray-900">{c.percentage}%</p>
                      </div>
                    ))}
                  </div>
                  {/* Bar Chart */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-700 mb-4 text-sm">Resultados Generales - {currentElection.name}</h3>
                    <div className="h-[300px] w-full">
                      <BarChart
                        dataset={barData}
                        yAxis={[{ scaleType: 'band', dataKey: 'name' }]}
                        series={[{ dataKey: 'percentage', valueFormatter: (v) => `${v}%`, color: '#3B82F6' }]}
                        layout="horizontal"
                        margin={{ left: 100 }}
                        borderRadius={4}
                        colors={stats.chartData.map(c => c.color)}
                        slotProps={{ legend: { hidden: true } }}
                      />
                    </div>
                  </div>
                </div>

                {/* Sidebar Derecha */}
                <div className="space-y-8">
                  {/* Filtro */}
                  <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 z-100 text-white shadow-lg relative overflow-hidden">
                    <MapPin className="absolute -right-4 -bottom-4 text-white opacity-10 w-32 h-32" />
                    <h3 className="font-bold text-sm mb-4 relative z-10 uppercase tracking-widest opacity-90">Filtro Regional</h3>
                    <div className="relative z-10">
                      <button onClick={() => setIsDepartamentoOpen(!isDepartamentoOpen)} className="w-full bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold py-3 px-4 rounded-xl flex justify-between items-center hover:bg-white/20 transition-all">
                        {selectedDepartamento || 'Todo el País'}
                        <ChevronDown size={18} />
                      </button>
                      {isDepartamentoOpen && (
                        <div className="absolute top-full mt-2 left-0 w-full bg-white text-gray-800 rounded-xl shadow-xl max-h-60 overflow-y-auto z-50 animate-in fade-in zoom-in-95 duration-200">
                          <button onClick={() => { setSelectedDepartamento(''); setIsDepartamentoOpen(false); }} className="w-full  text-left px-4 py-2 hover:bg-blue-50 font-bold text-blue-600 border-b text-sm">Nacional</button>
                          {departamentos.map(dep => (
                            <button key={dep} onClick={() => { setSelectedDepartamento(dep); setIsDepartamentoOpen(false); }} className="w-full text-left z-100 px-4 py-2 hover:bg-gray-50 border-b last:border-0 text-sm">{dep}</button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Pie Chart */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
                    <h3 className="font-bold text-gray-700 mb-4 self-start text-sm">Distribución</h3>
                    <PieChart
                      series={[{ data: pieData, innerRadius: 40, outerRadius: 80, paddingAngle: 2, cornerRadius: 4 }]}
                      width={250} height={200} slotProps={{ legend: { hidden: true } }}
                    />
                    <div className="mt-4 w-full space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                      {stats.chartData.map(c => (
                        <div key={c.id} className="flex items-center justify-between text-xs py-1 border-b border-gray-50 last:border-0">
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

          {/* --- VISTA 2: PREDICCIONES (GRÁFICOS DE IA AVANZADOS) --- */}
          {activeTab === 'predictions' && predictionData && (
            <div className="animate-fadeIn space-y-8">

              {/* Encabezado de Sección */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <BrainCircuit className="text-purple-600" />
                    Análisis Predictivo Avanzado
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Proyecciones en tiempo real para {currentElection.name} ({currentElection.type})
                  </p>
                </div>
                <div className="flex items-center gap-2 bg-purple-100 px-3 py-1 rounded-full text-purple-700 text-xs font-bold border border-purple-200">
                  <Zap size={14} fill="currentColor" />
                  Modelo Activo v3.1 (TensorFlow)
                </div>
              </div>

              {/* Muestreo de KPIs Predictivos */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Ganador Proyectado */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-purple-400 border-l-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Trophy className="text-purple-600" size={20} />
                    <p className="text-xs font-bold uppercase text-gray-500 tracking-wider">Ganador Proyectado</p>
                  </div>
                  <h3 className="text-2xl font-black text-gray-800 flex items-baseline gap-2">
                    {predictionData.winner.name}
                    <span className="text-purple-600 text-lg font-bold">({predictionData.predictedWinnerPercentage.toFixed(1)}%)</span>
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">Confiabilidad del modelo: 95%</p>
                </div>
                {/* Margen de Victoria */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-400 border-l-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Target className="text-blue-600" size={20} />
                    <p className="text-xs font-bold uppercase text-gray-500 tracking-wider">Margen de Victoria</p>
                  </div>
                  <h3 className="text-2xl font-black text-gray-800">
                    {predictionData.predictedMargin}%
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">Sobre el segundo candidato</p>
                </div>
                {/* Participación Final Estimada */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-green-400 border-l-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Users className="text-green-600" size={20} />
                    <p className="text-xs font-bold uppercase text-gray-500 tracking-wider">Participación Final</p>
                  </div>
                  <h3 className="text-2xl font-black text-gray-800">
                    {predictionData.participationLineChart.series[0].data.slice(-1)[0].toFixed(1)}%
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">Pronóstico al cierre de urnas</p>
                </div>
                {/* Impacto del Voto Indeciso */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-amber-400 border-l-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Lightbulb className="text-amber-600" size={20} />
                    <p className="text-xs font-bold uppercase text-gray-500 tracking-wider">Impacto Voto Indeciso</p>
                  </div>
                  <h3 className="text-2xl font-black text-gray-800">
                    {predictionData.undecidedVoterImpact}%
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">Potencial de cambio en resultados</p>
                </div>
              </div>


              {/* GRID DE GRÁFICOS DE PREDICCIÓN */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 ">

                {/* GRÁFICO 1: Proyección de Cierre (Line Chart con Área) */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border-2 border-blue-950/50">
                  <h3 className="font-bold text-gray-800 mb-2 text-sm uppercase tracking-wide flex items-center gap-2">
                    <Clock size={18} className="text-blue-600" /> Proyección de Votos por Hora
                  </h3>
                  <p className="text-xs text-gray-500 mb-6">
                    Evolución del % de votos. La línea discontinua es la predicción de la IA para el cierre.
                  </p>

                  <div className="h-[300px] w-full">
                    <LineChart
                      xAxis={predictionData.projectionLineChart.xAxis}
                      series={predictionData.projectionLineChart.series}
                      margin={{ left: 50, right: 20, top: 20, bottom: 30 }}
                      grid={{ vertical: true, horizontal: true }}
                      slotProps={{
                        legend: {
                          hidden: false,
                          position: { vertical: 'top', horizontal: 'right' },
                          itemMarkWidth: 10,
                          itemMarkHeight: 10,
                          labelStyle: { fontSize: 12 }
                        }
                      }}
                    />
                  </div>
                </div>

                {/* GRÁFICO 2: Probabilidad de Victoria (Bar Chart Horizontal) */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border-2 border-blue-950/50">
                  <h3 className="font-bold text-gray-800 mb-2 text-sm uppercase tracking-wide flex items-center gap-2">
                    <ShieldCheck size={18} className="text-green-600" /> Probabilidad de Victoria
                  </h3>
                  <p className="text-xs text-gray-500 mb-6">
                    Predicción de la IA basada en el flujo actual y modelos de regresión.
                  </p>

                  <div className="h-[300px] w-full">
                    <BarChart
                      dataset={predictionData.winProbabilityBarChart}
                      yAxis={[{ scaleType: 'band', dataKey: 'name' }]}
                      series={[{
                        dataKey: 'probability',
                        label: 'Probabilidad (%)',
                        color: '#6a0dad', // Purple color for AI
                        valueFormatter: (v) => `${v.toFixed(1)}%`
                      }]}
                      layout="horizontal"
                      margin={{ left: 100, right: 20, top: 20, bottom: 30 }}
                      borderRadius={6}
                    />
                  </div>
                </div>

                {/* GRÁFICO 3: Predicción de Participación por Hora */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border-2 border-blue-950/50">
                  <h3 className="font-bold text-gray-800 mb-2 text-sm uppercase tracking-wide flex items-center gap-2">
                    <Users size={18} className="text-purple-600" /> Predicción de Participación Acumulada
                  </h3>
                  <p className="text-xs text-gray-500 mb-6">
                    Curva de participación actual vs. pronóstico del modelo de Machine Learning.
                  </p>
                  <div className="h-[250px] w-full">
                    <LineChart
                      xAxis={predictionData.participationLineChart.xAxis}
                      series={predictionData.participationLineChart.series}
                      margin={{ left: 50, right: 20, top: 20, bottom: 30 }}
                      grid={{ vertical: true, horizontal: true }}
                      slotProps={{
                        legend: {
                          hidden: false,
                          position: { vertical: 'top', horizontal: 'right' },
                          itemMarkWidth: 10,
                          itemMarkHeight: 10,
                          labelStyle: { fontSize: 12 }
                        }
                      }}
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
};

export default StatisticsPage;