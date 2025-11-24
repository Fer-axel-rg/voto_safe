// src/services/userVotingService.ts
// Servicio para manejar la votación del usuario (conectado a Spring Boot)

const API_BASE_URL = 'http://localhost:8080/api/v1';

// ============================================
// INTERFACES
// ============================================

export interface ElectionDTO {
  id_eleccion: string;
  nombre: string;
  descripcion?: string;
  tipo_eleccion: 'Presidencial' | 'Municipal' | 'Otros';
  fecha_inicio: string;
  fecha_fin: string;
  estado: 'active' | 'upcoming' | 'finished';
  categorias: CategoryDTO[];
}

export interface CategoryDTO {
  id_categorias: string;
  nombre: string;
  descripcion?: string;
}

export interface PartyDTO {
  id_partido: string;
  nombre: string;
  descripcion?: string;
  url_logo?: string;
  id_eleccion: string;
}

export interface VoteSubmissionDTO {
  id_usuario: string;
  dni_usuario: string;
  id_eleccion: string;
  nombre_eleccion: string;
  votos: VoteDetailDTO[];
}

export interface VoteDetailDTO {
  id_categoria: string;
  nombre_categoria: string;
  id_partido: string;
  nombre_partido: string;
}

export interface VoteResponse {
  success: boolean;
  message: string;
  id_voto?: string;
}

// ============================================
// SERVICIO: ELECCIONES
// ============================================

export const electionService = {
  /**
   * Obtener elecciones activas para votar
   */
  getActiveElections: async (token: string): Promise<ElectionDTO[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/elections/active`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      });

      if (!response.ok) {
        throw new Error('Error al cargar elecciones');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en getActiveElections:', error);
      throw error;
    }
  },

  /**
   * Obtener una elección específica con sus categorías
   */
  getElectionById: async (electionId: string, token: string): Promise<ElectionDTO> => {
    try {
      const response = await fetch(`${API_BASE_URL}/elections/${electionId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      });

      if (!response.ok) {
        throw new Error('Error al cargar la elección');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en getElectionById:', error);
      throw error;
    }
  }
};

// ============================================
// SERVICIO: PARTIDOS
// ============================================

export const partyService = {
  /**
   * Obtener partidos de una elección específica
   */
  getPartiesByElection: async (electionId: string, token: string): Promise<PartyDTO[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/parties/election/${electionId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      });

      if (!response.ok) {
        throw new Error('Error al cargar partidos');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en getPartiesByElection:', error);
      throw error;
    }
  }
};

// ============================================
// SERVICIO: VOTACIÓN
// ============================================

export const voteService = {
  /**
   * Verificar si el usuario ya votó en esta elección
   */
  checkIfUserVoted: async (userId: string, electionId: string, token: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/votes/check/${userId}/${electionId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      });

      if (!response.ok) {
        throw new Error('Error al verificar voto');
      }

      const data = await response.json();
      return data.hasVoted;
    } catch (error) {
      console.error('Error en checkIfUserVoted:', error);
      return false;
    }
  },

  /**
   * Enviar el voto del usuario
   */
  submitVote: async (voteData: VoteSubmissionDTO, token: string): Promise<VoteResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/votes/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify(voteData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al enviar el voto');
      }

      return data;
    } catch (error: any) {
      console.error('Error en submitVote:', error);
      throw error;
    }
  },

  /**
   * Obtener votos del usuario
   */
  getUserVotes: async (userId: string, token: string): Promise<any[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/votes/user/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      });

      if (!response.ok) {
        throw new Error('Error al cargar votos del usuario');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en getUserVotes:', error);
      throw error;
    }
  }
};

// ============================================
// UTILIDADES
// ============================================

export const votingUtils = {
  /**
   * Validar que todos los votos estén completos
   */
  validateVotes(
    categories: CategoryDTO[],
    selectedVotes: Record<string, string | null>
  ): { valid: boolean; message: string } {
    const allVoted = categories.every(cat => !!selectedVotes[cat.id_categorias]);

    if (!allVoted) {
      return {
        valid: false,
        message: 'Debe votar en todas las categorías'
      };
    }

    return { valid: true, message: '' };
  },

  /**
   * Formatear fecha para mostrar
   */
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  },

  /**
   * Verificar si una elección está activa ahora
   */
  isElectionActive(election: ElectionDTO): boolean {
    const now = new Date();
    const start = new Date(election.fecha_inicio);
    const end = new Date(election.fecha_fin);

    return election.estado === 'active' && now >= start && now <= end;
  }
};