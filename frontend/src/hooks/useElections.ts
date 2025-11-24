// src/hooks/useElections.ts
import { useState, useEffect, useCallback } from 'react';
import type { Election, ElectionFilters } from '@/types/election.types';

const API_URL = 'http://localhost:8080/api/v1/elections';

export const useElections = () => {
  const [elections, setElections] = useState<Election[]>([]);
  const [filteredElections, setFilteredElections] = useState<Election[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estado de filtros
  const [filters, setFilters] = useState<ElectionFilters>({
    name: '',
    type: 'all',
    status: 'all',
    startDate: '',
    endDate: ''
  });

  // Obtener token de autenticación
  const getToken = () => localStorage.getItem('votosafe_token');

  // Cargar elecciones al montar
  useEffect(() => {
    loadElections();
  }, []);

  // Aplicar filtros cuando cambien
  useEffect(() => {
    applyFilters();
  }, [filters, elections]);

  // ============================================
  // CARGAR ELECCIONES
  // ============================================
  const loadElections = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const token = getToken();
      if (!token) {
        throw new Error('No hay sesión activa');
      }

      console.log('📡 Cargando elecciones desde backend...');

      const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error('Sesión expirada. Por favor inicia sesión nuevamente.');
        }
        throw new Error('Error al cargar elecciones');
      }

      const data = await response.json();
      console.log('📥 Datos recibidos del backend:', data);

      // ✅ Mapear datos del backend (snake_case) al formato del frontend (camelCase)
      const mappedElections: Election[] = data.map((e: any) => ({
        id: e.id_eleccion,
        name: e.nombre,
        type: e.tipo_eleccion,
        startDate: e.fecha_inicio,
        endDate: e.fecha_fin,
        status: e.estado,
        allowNullVote: e.allow_null_vote ?? true,
        requireMinimumCategory: e.require_minimum_category ?? false,
        allowMultipleVotes: e.allow_multiple_votes ?? false,
        autoSendVote: e.auto_send_vote ?? false,
        categories: (e.categorias || []).map((cat: any) => ({
          id: cat.id_categorias,
          name: cat.nombre,
          description: cat.descripcion
        })),
        createdAt: e.created_at || new Date().toISOString()
      }));

      console.log('✅ Elecciones mapeadas:', mappedElections);
      setElections(mappedElections);
      setError(null);

    } catch (err: any) {
      console.error('❌ Error cargando elecciones:', err);
      setError(err.message || 'Error al cargar elecciones');
      setElections([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // ============================================
  // APLICAR FILTROS
  // ============================================
  const applyFilters = () => {
    let filtered = [...elections];

    if (filters.name.trim()) {
      filtered = filtered.filter(e =>
        e.name.toLowerCase().includes(filters.name.toLowerCase())
      );
    }

    if (filters.type !== 'all') {
      filtered = filtered.filter(e => e.type === filters.type);
    }

    if (filters.status !== 'all') {
      filtered = filtered.filter(e => e.status === filters.status);
    }

    if (filters.startDate) {
      filtered = filtered.filter(e =>
        new Date(e.startDate) >= new Date(filters.startDate)
      );
    }

    if (filters.endDate) {
      filtered = filtered.filter(e =>
        new Date(e.endDate) <= new Date(filters.endDate)
      );
    }

    setFilteredElections(filtered);
  };

  // ============================================
  // ACTUALIZAR FILTROS
  // ============================================
  const updateFilters = (newFilters: Partial<ElectionFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFilters({
      name: '',
      type: 'all',
      status: 'all',
      startDate: '',
      endDate: ''
    });
  };

  // ============================================
  // AGREGAR ELECCIÓN
  // ============================================
  const addElection = async (electionData: Omit<Election, 'id' | 'createdAt'>) => {
    setLoading(true);
    setError(null);

    try {
      const token = getToken();
      if (!token) {
        throw new Error('No hay sesión activa');
      }

      console.log('📤 Enviando elección al backend:', electionData);

      // ✅ Mapear datos del frontend (camelCase) al formato del backend (snake_case)
      const backendData = {
        nombre: electionData.name,
        descripcion: electionData.name, // Usar name como descripción si no hay
        tipo_eleccion: electionData.type,
        fecha_inicio: electionData.startDate,
        fecha_fin: electionData.endDate,
        estado: electionData.status,
        categorias: electionData.categories.map(cat => ({
          nombre: cat.name,
          descripcion: cat.description || cat.name
        }))
      };

      console.log('📦 Payload para backend:', backendData);

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify(backendData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Error del backend:', errorData);
        throw new Error(errorData.message || 'Error al crear elección');
      }

      const newElection = await response.json();
      console.log('✅ Elección creada:', newElection);

      // ✅ Mapear respuesta del backend al formato del frontend
      const mappedElection: Election = {
        id: newElection.id_eleccion,
        name: newElection.nombre,
        type: newElection.tipo_eleccion,
        startDate: newElection.fecha_inicio,
        endDate: newElection.fecha_fin,
        status: newElection.estado,
        allowNullVote: newElection.allow_null_vote ?? true,
        requireMinimumCategory: newElection.require_minimum_category ?? false,
        allowMultipleVotes: newElection.allow_multiple_votes ?? false,
        autoSendVote: newElection.auto_send_vote ?? false,
        categories: (newElection.categorias || []).map((cat: any) => ({
          id: cat.id_categorias,
          name: cat.nombre,
          description: cat.descripcion
        })),
        createdAt: newElection.created_at || new Date().toISOString()
      };

      setElections(prev => [...prev, mappedElection]);
      setError(null);

    } catch (err: any) {
      console.error('❌ Error agregando elección:', err);
      setError(err.message || 'Error al crear elección');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // ACTUALIZAR ELECCIÓN
  // ============================================
  const updateElection = async (id: string, electionData: Partial<Election>) => {
    setLoading(true);
    setError(null);

    try {
      const token = getToken();
      if (!token) {
        throw new Error('No hay sesión activa');
      }

      console.log('🔄 Actualizando elección:', id, electionData);

      // ✅ Mapear datos del frontend al backend
      const backendData: any = {};
      if (electionData.name) backendData.nombre = electionData.name;
      if (electionData.type) backendData.tipo_eleccion = electionData.type;
      if (electionData.startDate) backendData.fecha_inicio = electionData.startDate;
      if (electionData.endDate) backendData.fecha_fin = electionData.endDate;
      if (electionData.status) backendData.estado = electionData.status;
      if (electionData.name) backendData.descripcion = electionData.name;

      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify(backendData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al actualizar elección');
      }

      const updatedElection = await response.json();
      console.log('✅ Elección actualizada:', updatedElection);

      // ✅ Mapear respuesta
      const mappedElection: Election = {
        id: updatedElection.id_eleccion,
        name: updatedElection.nombre,
        type: updatedElection.tipo_eleccion,
        startDate: updatedElection.fecha_inicio,
        endDate: updatedElection.fecha_fin,
        status: updatedElection.estado,
        allowNullVote: updatedElection.allow_null_vote ?? true,
        requireMinimumCategory: updatedElection.require_minimum_category ?? false,
        allowMultipleVotes: updatedElection.allow_multiple_votes ?? false,
        autoSendVote: updatedElection.auto_send_vote ?? false,
        categories: (updatedElection.categorias || []).map((cat: any) => ({
          id: cat.id_categorias,
          name: cat.nombre,
          description: cat.descripcion
        })),
        createdAt: updatedElection.created_at || updatedElection.createdAt
      };

      setElections(prev => prev.map(e => e.id === id ? mappedElection : e));
      setError(null);

    } catch (err: any) {
      console.error('❌ Error actualizando elección:', err);
      setError(err.message || 'Error al actualizar elección');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // ELIMINAR ELECCIÓN
  // ============================================
  const deleteElection = async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const token = getToken();
      if (!token) {
        throw new Error('No hay sesión activa');
      }

      console.log('🗑️ Eliminando elección:', id);

      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': token
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al eliminar elección');
      }

      console.log('✅ Elección eliminada');
      setElections(prev => prev.filter(e => e.id !== id));
      setError(null);

    } catch (err: any) {
      console.error('❌ Error eliminando elección:', err);
      setError(err.message || 'Error al eliminar elección');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // RETURN
  // ============================================
  return {
    // Datos
    elections: filteredElections.length > 0 || filters.name || filters.type !== 'all' || filters.status !== 'all' 
      ? filteredElections 
      : elections,
    allElections: elections,
    
    // Estados
    loading,
    error,
    
    // Filtros
    filters,
    
    // Acciones CRUD
    addElection,
    updateElection,
    deleteElection,
    
    // Acciones de filtros
    updateFilters,
    resetFilters,
    
    // Refrescar
    refreshElections: loadElections
  };
};