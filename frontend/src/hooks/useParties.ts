import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
// Asegúrate de tener estos tipos en src/types/party.types.ts
import type { Party, Candidate } from '../types/party.types';

const API_URL = 'http://localhost:8080/api/v1/partidos';

export const useParties = (electionId?: string) => {
  const { token } = useAuth();
  const [parties, setParties] = useState<Party[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchParties = useCallback(async () => {
    if (!electionId || !token) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}?eleccionId=${electionId}`, {
        headers: { 'Authorization': token }
      });
      if (res.ok) {
        const data = await res.json();
        // Mapeo Backend -> Frontend
        const mapped: Party[] = data.map((p: any) => ({
            id: p.idPartido,
            electionId: electionId,
            electionName: "", // Opcional
            name: p.nombre,
            representative: p.descripcion, // Usamos descripción como representante por ahora
            logoUrl: p.urlLogo,
            createdAt: "",
            candidates: p.candidatos ? p.candidatos.map((c: any) => ({
                id: c.idCandidato,
                firstName: c.nombre,
                lastName: c.apellidos,
                categoryId: c.idCategoria,
                imageUrl: c.urlImagen,
                proposalDescription: c.descripcionPropuesta,
                gender: c.genero,
                topic: c.tema
            })) : []
        }));
        setParties(mapped);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [electionId, token]);

  const addParty = async (partyData: any) => {
    if (!electionId) return;
    setLoading(true);
    try {
        // Mapeo Frontend -> Backend (Payload para Java)
        const payload = {
            nombre: partyData.name,
            descripcion: partyData.representative,
            urlLogo: partyData.logoUrl,
            // Lista de candidatos anidada
            candidatos: partyData.candidates.map((c: any) => ({
                nombre: c.firstName,
                apellidos: c.lastName,
                idCategoria: c.categoryId,
                urlImagen: c.imageUrl,
                genero: c.gender,
                tema: c.topic,
                descripcionPropuesta: c.proposalDescription
            }))
        };

        const res = await fetch(`${API_URL}?eleccionId=${electionId}`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': token || '' 
            },
            body: JSON.stringify(payload)
        });

        if (!res.ok) throw new Error("Error al guardar partido");
        
        await fetchParties(); // Recargar lista
    } catch (e) {
        console.error(e);
        alert("Error guardando partido");
    } finally {
        setLoading(false);
    }
  };

  const deleteParty = async (id: string) => {
      try {
          await fetch(`${API_URL}/${id}`, { method: 'DELETE', headers: {'Authorization': token || ''} });
          await fetchParties();
      } catch(e) { console.error(e); }
  };
  
  // Placeholder para funciones no implementadas aún
  const updateParty = async () => { console.log("Update pendiente"); };
  const addMultipleParties = async (importedParties: any[]) => {
    if (!electionId) return;
    setLoading(true);
    try {
        // Mapeamos la lista completa al formato de Java
        const payload = importedParties.map(p => ({
            nombre: p.name,
            descripcion: p.representative,
            urlLogo: p.logoUrl,
            candidatos: p.candidates ? p.candidates.map((c: any) => ({
                nombre: c.firstName,
                apellidos: c.lastName,
                idCategoria: c.categoryId,
                urlImagen: c.imageUrl,
                genero: c.gender,
                tema: c.topic,
                descripcionPropuesta: c.proposalDescription
            })) : []
        }));

        const res = await fetch(`${API_URL}/batch?eleccionId=${electionId}`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': token || '' 
            },
            body: JSON.stringify(payload)
        });

        if (!res.ok) throw new Error("Error en importación masiva");
        
        alert("¡Importación exitosa!");
        await fetchParties(); // Recargar la lista para ver los nuevos
        
    } catch (e: any) {
        console.error(e);
        alert("Error al importar: " + e.message);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchParties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchParties]);

  return { parties, loading, addParty, deleteParty, updateParty, addMultipleParties };
};