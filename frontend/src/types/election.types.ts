export interface Category {
  id: string;
  name: string;
}

export interface Election {
  id: string;
  name: string;
  type: string; // General para aceptar lo que venga de la BD
  startDate: string;
  endDate: string;
  status: 'active' | 'finished' | 'upcoming';
  description?: string;
  
  // Opcionales porque el endpoint de resumen no siempre los trae
  allowNullVote?: boolean;
  requireMinimumCategory?: boolean;
  allowMultipleVotes?: boolean;
  autoSendVote?: boolean;
  categories?: Category[];
  createdAt?: string;
}

export interface ElectionFilters {
  name: string;
  type: string;
  status: 'active' | 'finished' | 'all';
  startDate: string;
  endDate: string;
}