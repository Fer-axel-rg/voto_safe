// src/pages/ElectionSelectorPage.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, CheckCircle, ChevronRight, Lock, Vote, UserCircle } from 'lucide-react';

// --- INTERFACES ---
interface UserData {
  id: string;
  fullName: string;
  email: string;
  role: string;
}

interface Election {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: string;
  type: string;
}

const ElectionSelectorPage = () => {
  const navigate = useNavigate();
  
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [elections, setElections] = useState<Election[]>([]);
  const [loading, setLoading] = useState(true);
  const [userVotes, setUserVotes] = useState<string[]>([]); // IDs de elecciones donde ya votó

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // 1. Cargar Usuario de Sesión
      const userRaw = localStorage.getItem('votosafe_user');
      const token = localStorage.getItem('votosafe_token');
      
      if (!userRaw || !token) {
        navigate('/');
        return;
      }

      const user = JSON.parse(userRaw);
      setCurrentUser(user);

      // 2. Cargar Elecciones Activas desde Backend
      const electionsResponse = await fetch('http://localhost:8080/api/v1/elections/active', {
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        }
      });

      if (electionsResponse.ok) {
        const electionsData = await electionsResponse.json();
        
        // Mapear de backend a frontend
        const mappedElections = electionsData.map((e: any) => ({
          id: e.id_eleccion,
          name: e.nombre,
          startDate: e.fecha_inicio,
          endDate: e.fecha_fin,
          status: e.estado,
          type: e.tipo_eleccion
        }));
        
        setElections(mappedElections);
      }

      // 3. Verificar en qué elecciones ya votó
      const votesResponse = await fetch(`http://localhost:8080/api/v1/votes/user/${user.id}`, {
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        }
      });

      if (votesResponse.ok) {
        const votes = await votesResponse.json();
        const votedElectionIds = votes.map((v: any) => v.id_eleccion || v.idEleccion);
        setUserVotes(votedElectionIds);
      }

    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Validar si la elección está activa
  const isElectionActive = (election: Election) => {
    const now = new Date();
    const start = new Date(election.startDate);
    const end = new Date(election.endDate);
    end.setHours(23, 59, 59);
    return now >= start && now <= end && election.status === 'active';
  };

  // Verificar si el usuario ya votó en esta elección
  const hasVotedInElection = (electionId: string) => {
    return userVotes.includes(electionId);
  };

  const handleSelectElection = (election: Election) => {
    // Navegar al dashboard con el ID de la elección
    navigate(`/user/dashboard/${election.id}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('votosafe_user');
    localStorage.removeItem('votosafe_token');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
          <p className="text-gray-600">Cargando elecciones...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) return null;

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 font-poppins">
      
      {/* HEADER USUARIO */}
      <div className="w-full px-8 py-6 mb-10 text-white bg-blue-950">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white rounded-full">
              <UserCircle className='text-blue-950' size={32} />
            </div>
            <div>
              <h2 className="text-xl font-bold">Hola, {currentUser.fullName}</h2>
              <p className="text-sm text-blue-200">{currentUser.email}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="px-4 py-2 text-lg font-semibold transition-colors bg-white border-2 rounded-lg font-poppins text-blue-950 hover:bg-blue-950 hover:text-white hover:border-white/50"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div className="w-full max-w-4xl px-6">
        <h1 className="pl-4 mb-2 text-3xl font-bold text-gray-900 border-l-4 border-blue-950 font-poppins">
          Elecciones Disponibles
        </h1>
        <p className="pl-5 mb-8 font-semibold text-gray-700 font-poppins">
          Selecciona una elección para emitir tu voto electrónico.
        </p>

        {elections.length === 0 ? (
          <div className="py-20 text-center bg-white border border-gray-200 shadow-sm rounded-xl">
            <p className="text-lg text-gray-400">No hay elecciones activas en el sistema.</p>
          </div>
        ) : (
          <div className="grid gap-6 rounded-2xl">
            {elections.map((election) => {
              const active = isElectionActive(election);
              const hasVoted = hasVotedInElection(election.id);
              const canVote = active && !hasVoted;

              return (
                <div 
                  key={election.id} 
                  className={`
                    relative bg-white rounded-2xl p-6 shadow-sm border-2 transition-all duration-300
                    ${canVote ? 'border-blue-950/40 hover:border-blue-950 hover:shadow-lg' : 'border-blue-950/40 hover:border-blue-950'}
                  `}
                >
                  <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
                    
                    {/* INFO IZQUIERDA */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${
                          active ? 'bg-green-200 text-green-800' : 'bg-red-100 text-red-700'
                        }`}>
                          {active ? 'En Curso' : 'Cerrada'}
                        </span>
                        <span className="px-2 py-1 text-xs font-bold text-gray-900 uppercase rounded bg-gray-400/70">
                          {election.type}
                        </span>
                      </div>
                      <h3 className="mb-2 text-xl font-bold text-gray-800">{election.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-800">
                        <Calendar size={16} />
                        <span>{election.startDate} - {election.endDate}</span>
                      </div>
                    </div>

                    {/* BOTONES DE ACCIÓN */}
                    <div className="flex items-center w-full gap-4 md:w-auto">
                      {hasVoted ? (
                        <div className="flex items-center justify-center w-full gap-2 px-6 py-3 border border-2 shadow-inner border-blue-950/20 bg-blue-950/15 text-blue-950 rounded-xl md:w-auto">
                          <CheckCircle size={24} />
                          <div>
                            <span className="block font-bold leading-none">Voto Emitido</span>
                            <span className="text-xs">Gracias por participar</span>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleSelectElection(election)}
                          disabled={!canVote}
                          className={`
                            flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-bold text-lg w-full md:w-auto transition-all
                            ${canVote 
                              ? 'bg-blue-950 text-white hover:bg-blue-950 shadow-lg hover:scale-105' 
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
                          `}
                        >
                          {!active ? (
                            <><Lock size={20}/> No Disponible</>
                          ) : (
                            <><Vote size={20}/> Votar Ahora</>
                          )}
                          {canVote && <ChevronRight size={20} />}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ElectionSelectorPage;