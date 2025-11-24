import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import OnpeLogo from './../img/landing/iconoonpe.png';
import ChatWidget from '../components/userDashbord/chatWidget';
import MoreInfoPostulante from '../components/userDashbord/moreInfoPostulante';
import { useUserVoting } from '@/hooks/useUserVoting';

// ============================================
// INTERFACES PARA UI
// ============================================
interface CandidateUI {
  id: string;
  name: string;
  avatarUrl: string;
  category: string;
  proposals: string[];
  partidoP: string;
}

// ============================================
// COMPONENTE: TARJETA DE CANDIDATO
// ============================================
const CandidateCard: React.FC<{
  candidate: CandidateUI;
  onClick: (id: string) => void;
  isSelected: boolean;
  onShowProposals: (candidate: CandidateUI) => void;
}> = ({ candidate, onClick, isSelected, onShowProposals }) => (
  <div
    className={`relative w-44 h-48 bg-[#0A2A66] rounded-lg shadow-md flex flex-col items-center justify-center p-2 cursor-pointer
    transition-all duration-200 ease-in-out transform
    ${isSelected ? 'border-4 border-blue-500 scale-105' : 'border border-gray-200 hover:shadow-lg'}`}
    onClick={() => onClick(candidate.id)}
  >
    {isSelected && (
      <div className="absolute p-1 text-white bg-blue-600 rounded-full top-2 left-2">
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
    )}

    <button
      onClick={(e) => {
        e.stopPropagation();
        onShowProposals(candidate);
      }}
      className="absolute p-2 text-white bg-red-500 rounded-full shadow-md top-2 right-2 hover:scale-110 active:scale-95"
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 3C6.48 3 2 6.92 2 11.5c0 2.26 1.14 4.34 3.07 5.86L4 21l4.02-1.7c1.01.28 2.09.43 3.23.43c5.52 0 10-3.92 10-8.5S17.52 3 12 3z" />
      </svg>
    </button>

    <div className="w-24 h-24 rounded-full border-2 border-[#4A6BB6] mb-2 bg-white overflow-hidden flex items-center justify-center">
      {candidate.avatarUrl ? (
        <img src={candidate.avatarUrl} alt={candidate.name} className="object-cover w-full h-full" />
      ) : (
        <span className="text-3xl font-bold text-gray-400">{candidate.name.charAt(0)}</span>
      )}
    </div>

    <p className="px-1 text-base font-semibold leading-tight text-center text-white font-poppins">
      {candidate.name}
    </p>
  </div>
);

// ============================================
// COMPONENTE PRINCIPAL: UserDashboard
// ============================================
const UserDashbord: React.FC = () => {
  const navigate = useNavigate();
  const { electionId } = useParams<{ electionId: string }>();

  // Hook personalizado con toda la lógica
  const {
    election,
    parties,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    selectedVotes,
    activeCategory,
    loading,
    submitting,
    error,
    hasVoted,
    selectParty,
    selectBlankVote,
    changeCategory,
    submitVote,
    canSubmit,
    getCategoryVote
  } = useUserVoting(electionId || '');

  // Estados UI locales
  const [modalCandidate, setModalCandidate] = useState<CandidateUI | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // ============================================
  // MANEJADORES
  // ============================================
  const handleCandidateClick = (partyId: string) => {
    if (!activeCategory) return;
    selectParty(activeCategory, partyId);
  };

  const handleBlankVote = () => {
    if (!activeCategory) return;
    selectBlankVote(activeCategory);
  };

  const handleShowProposals = (candidate: CandidateUI) => {
    setModalCandidate(candidate);
  };

  const handleSubmitVote = async () => {
    if (!canSubmit) {
      Swal.fire({
        title: 'Atención',
        text: 'Debes votar en todas las categorías',
        icon: 'warning',
        confirmButtonText: 'Entendido'
      });
      return;
    }

    // Confirmación
    const confirm = await Swal.fire({
      title: '¿Confirmar voto?',
      text: 'Una vez enviado, no podrás modificarlo',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, enviar',
      cancelButtonText: 'Revisar'
    });

    if (!confirm.isConfirmed) return;

    // Enviar
    const result = await submitVote();

    if (result.success) {
      await Swal.fire({
        title: '¡VOTO REGISTRADO!',
        text: result.message,
        icon: 'success',
        showConfirmButton: false,
        timer: 2000
      });
      navigate('/user/ballots');
    } else {
      Swal.fire({
        title: 'Error',
        text: result.message,
        icon: 'error',
        confirmButtonText: 'Entendido'
      });
    }
  };

  // ============================================
  // MAPEO DE DATOS (Backend → UI)
  // ============================================
  const candidatesUI: CandidateUI[] = parties.map(party => ({
    id: party.id_partido,
    name: party.nombre,
    avatarUrl: party.url_logo || '',
    category: '',
    partidoP: party.nombre,
    proposals: party.descripcion ? [party.descripcion] : ['Ver plan de gobierno']
  }));

  // ============================================
  // RENDERIZADO
  // ============================================

  // Loading
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
          <p className="text-gray-600">Cargando elección...</p>
        </div>
      </div>
    );
  }

  // Error o ya votó
  if (error || hasVoted) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="max-w-md p-8 text-center bg-white rounded-lg shadow-xl">
          <div className="w-16 h-16 mx-auto mb-4 text-red-500">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
          </div>
          <h2 className="mb-2 text-2xl font-bold text-gray-800">
            {hasVoted ? 'Ya has votado' : 'Error'}
          </h2>
          <p className="mb-6 text-gray-600">{error || 'No puedes votar nuevamente en esta elección'}</p>
          <button
            onClick={() => navigate('/user/ballots')}
            className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  // Sin elección
  if (!election) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">No se encontró la elección</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen pb-8 bg-gray-100">
      
      {/* Header */}
      <header className="w-full bg-white py-2 px-6 flex justify-between items-center border-b-2 border-[#0A2A66] drop-shadow-[0px_10px_30px_rgba(0,0,0,0.15)]">
        <img src={OnpeLogo} alt="ONPE Logo" className="object-contain w-auto h-12" />
        <button
          className="flex items-center bg-[#0A2A66] text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-[#0C357F] transition-colors"
          onClick={() => navigate('/user/ballots')}
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Cancelar
        </button>
      </header>

      {/* Título */}
      <h1 className="mt-8 mb-6 text-3xl font-extrabold tracking-wide text-center uppercase text-blue-950">
        {election.nombre}
      </h1>

      {/* Botones de Categoría */}
      <nav className="flex flex-row justify-center gap-3 px-4 py-4 mb-8 w-[80%] flex-wrap">
        {election.categorias.map(category => {
          const isActive = activeCategory === category.id_categorias;
          const hasVote = !!getCategoryVote(category.id_categorias);

          return (
            <button
              key={category.id_categorias}
              onClick={() => changeCategory(category.id_categorias)}
              className={`px-6 py-2 text-white font-semibold rounded-full text-base transition-all duration-300 ease-in-out transform flex items-center justify-center gap-2
                ${isActive ? 'bg-blue-950 shadow-xl scale-105' : 'bg-gray-400 hover:bg-gray-500'}`}
            >
              {hasVote && (
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
              {category.nombre.toUpperCase()}
            </button>
          );
        })}
      </nav>

      {/* Candidatos */}
      <div className="flex flex-row justify-center items-center gap-10 flex-wrap w-[50%] m-0">
        {candidatesUI.map(candidate => (
          <CandidateCard
            key={candidate.id}
            candidate={candidate}
            onClick={handleCandidateClick}
            isSelected={getCategoryVote(activeCategory) === candidate.id}
            onShowProposals={handleShowProposals}
          />
        ))}

        {/* Voto en Blanco */}
        <div
          className={`relative w-44 h-48 bg-[#E4E9F2] rounded-lg shadow-md flex flex-col items-center justify-center p-2 cursor-pointer transition-all duration-200 ease-in-out transform
            ${getCategoryVote(activeCategory) === 'VOTO_BLANCO' ? 'border-4 border-[#4ECDE6] scale-105' : 'border border-[#4ECDE6] hover:shadow-lg'}`}
          onClick={handleBlankVote}
        >
          <p className="text-xl font-bold text-center text-blue-900">
            VOTO<br />EN BLANCO
          </p>
        </div>
      </div>

      {/* Botón Enviar */}
      <div className="w-[300px] max-w-4xl px-4 mt-[7%] mb-0">
        <button
          onClick={handleSubmitVote}
          disabled={!canSubmit || submitting}
          className={`w-full py-4 text-xl font-bold text-white border-2 border-blue-300/50 uppercase rounded-xl shadow-xl transition-all duration-300 ease-in-out transform
            ${!canSubmit || submitting ? 'bg-gray-500 cursor-not-allowed opacity-70' : 'bg-blue-950 hover:scale-[1.02]'}`}
        >
          {submitting ? 'Enviando...' : !canSubmit ? 'Debe votar en todas las categorías' : 'Enviar Voto'}
        </button>
      </div>

      {/* Chat Widget */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 bg-[#0A2A66] text-white p-4 rounded-full shadow-lg shadow-blue-900/40 hover:scale-110 active:scale-95 transition-transform"
        >
          <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3C6.48 3 2 6.92 2 11.5c0 2.26 1.14 4.34 3.07 5.86L4 21l4.02-1.7c1.01.28 2.09.43 3.23.43c5.52 0 10-3.92 10-8.5S17.52 3 12 3z" />
          </svg>
        </button>
      )}
      {isChatOpen && <ChatWidget onClose={() => setIsChatOpen(false)} />}

      {/* Modal Detalles */}
      {modalCandidate && (
        <MoreInfoPostulante candidate={modalCandidate} onClose={() => setModalCandidate(null)} />
      )}
    </div>
  );
};

export default UserDashbord;