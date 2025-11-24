// src/hooks/useUserVoting.ts
// Hook personalizado para manejar toda la lógica de votación del usuario

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import {
  electionService,
  partyService,
  voteService,
  votingUtils,
  type ElectionDTO,
  type PartyDTO,
  type VoteSubmissionDTO
} from '@/services/userVotingService';

export const useUserVoting = (electionId: string) => {
  const { user, token } = useAuth();

  // Estados principales
  const [election, setElection] = useState<ElectionDTO | null>(null);
  const [parties, setParties] = useState<PartyDTO[]>([]);
  const [selectedVotes, setSelectedVotes] = useState<Record<string, string | null>>({});
  const [activeCategory, setActiveCategory] = useState<string>('');

  // Estados UI
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);

  // ============================================
  // CARGAR DATOS INICIALES
  // ============================================
  const loadElectionData = useCallback(async () => {
    if (!token || !electionId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // 1. Verificar si ya votó
      if (user?.id) {
        const voted = await voteService.checkIfUserVoted(user.id, electionId, token);
        if (voted) {
          setHasVoted(true);
          setError('Ya has votado en esta elección');
          setLoading(false);
          return;
        }
      }

      // 2. Cargar elección
      const electionData = await electionService.getElectionById(electionId, token);
      
      // Validar que esté activa
      if (!votingUtils.isElectionActive(electionData)) {
        setError('Esta elección no está disponible para votar');
        setLoading(false);
        return;
      }

      setElection(electionData);

      // 3. Establecer primera categoría como activa
      if (electionData.categorias.length > 0) {
        setActiveCategory(electionData.categorias[0].id_categorias);
      }

      // 4. Cargar partidos
      const partiesData = await partyService.getPartiesByElection(electionId, token);
      setParties(partiesData);

    } catch (err: any) {
      console.error('Error cargando datos:', err);
      setError(err.message || 'Error al cargar datos de la elección');
    } finally {
      setLoading(false);
    }
  }, [electionId, token, user?.id]);

  useEffect(() => {
    loadElectionData();
  }, [loadElectionData]);

  // ============================================
  // MANEJADORES DE VOTACIÓN
  // ============================================

  const selectParty = (categoryId: string, partyId: string) => {
    setSelectedVotes(prev => ({
      ...prev,
      [categoryId]: prev[categoryId] === partyId ? null : partyId
    }));
  };

  const selectBlankVote = (categoryId: string) => {
    setSelectedVotes(prev => ({
      ...prev,
      [categoryId]: 'VOTO_BLANCO'
    }));
  };

  const changeCategory = (categoryId: string) => {
    setActiveCategory(categoryId);
  };

  // ============================================
  // VALIDACIÓN Y ENVÍO
  // ============================================

  const canSubmit = (): boolean => {
    if (!election) return false;
    
    const validation = votingUtils.validateVotes(election.categorias, selectedVotes);
    return validation.valid;
  };

  const submitVote = async (): Promise<{ success: boolean; message: string }> => {
    if (!election || !user || !token) {
      return { success: false, message: 'Faltan datos necesarios' };
    }

    const validation = votingUtils.validateVotes(election.categorias, selectedVotes);
    if (!validation.valid) {
      return { success: false, message: validation.message };
    }

    try {
      setSubmitting(true);
      setError(null);

      // Preparar datos del voto
      const voteData: VoteSubmissionDTO = {
        id_usuario: user.id,
        dni_usuario: user.id, // Asumiendo que el id es el DNI
        id_eleccion: election.id_eleccion,
        nombre_eleccion: election.nombre,
        votos: Object.entries(selectedVotes).map(([categoryId, partyId]) => {
          const category = election.categorias.find(c => c.id_categorias === categoryId);
          const party = parties.find(p => p.id_partido === partyId);

          return {
            id_categoria: categoryId,
            nombre_categoria: category?.nombre || 'Desconocido',
            id_partido: partyId || 'blanco',
            nombre_partido: partyId === 'VOTO_BLANCO' ? 'Voto en Blanco' : party?.nombre || 'Desconocido'
          };
        })
      };

      // Enviar al backend
      const response = await voteService.submitVote(voteData, token);

      if (response.success) {
        setHasVoted(true);
        // Limpiar selecciones
        setSelectedVotes({});
        return { success: true, message: response.message };
      } else {
        throw new Error(response.message);
      }

    } catch (err: any) {
      const errorMsg = err.message || 'Error al enviar el voto';
      setError(errorMsg);
      return { success: false, message: errorMsg };
    } finally {
      setSubmitting(false);
    }
  };

  // ============================================
  // UTILIDADES
  // ============================================

  const getPartiesForCategory = (categoryId: string): PartyDTO[] => {
    // Por ahora retornamos todos los partidos (ajustar si hay filtro por categoría)
    return parties;
  };

  const isVoteComplete = (): boolean => {
    if (!election) return false;
    return election.categorias.every(cat => !!selectedVotes[cat.id_categorias]);
  };

  const getCategoryVote = (categoryId: string): string | null => {
    return selectedVotes[categoryId] || null;
  };

  // ============================================
  // RETURN
  // ============================================

  return {
    // Datos
    election,
    parties,
    selectedVotes,
    activeCategory,
    user,

    // Estados
    loading,
    submitting,
    error,
    hasVoted,

    // Acciones
    selectParty,
    selectBlankVote,
    changeCategory,
    submitVote,
    refreshData: loadElectionData,

    // Utilidades
    canSubmit: canSubmit(),
    isVoteComplete: isVoteComplete(),
    getPartiesForCategory,
    getCategoryVote
  };
};