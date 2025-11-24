export type Topic = 'Salud' | 'Economía' | 'Educación' | 'Seguridad' | 'Política' | 'Interior' | 'Otros';

export type Gender = 'Masculino' | 'Femenino' | 'Otro';

// Estructura de un Candidato
export interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  imageUrl: string;
  proposalDescription: string;
  topic: Topic;
  gender: Gender;
  
  // Relación con la categoría (ej: "Presidente")
  categoryId: string;
  categoryName?: string; // Opcional, útil para mostrar en UI
}

// Estructura de un Partido Político
export interface Party {
  id: string;
  electionId: string;
  electionName?: string; // Opcional, para mostrar en listas
  
  name: string;
  representative: string; // Nombre del representante legal o descripción
  logoUrl: string;
  
  candidates: Candidate[]; // Lista de candidatos inscritos
  
  createdAt?: string; // Fecha de creación
}

// Estructura para la importación de CSV (Usado en ImportCSVModal)
export interface CSVRow {
  partido: string;
  representante: string;
  url: string;
  categoria: string;
  nombres: string;
  apellidos: string;
  urlCandidato: string;
  descripcion: string;
  tema: Topic;
  sexo: Gender;
}