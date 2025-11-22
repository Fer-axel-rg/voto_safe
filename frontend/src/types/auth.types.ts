// src/types/auth.types.ts
// src/types/auth.types.ts

export type UserRole = 'admin' | 'user';

// 1. El Usuario Seguro (Lo que guardamos en memoria)
// NOTA: Ya no tiene 'password'.
export interface User {
  id: string;
  names?: string;    // Nuevo
  surnames?: string; // Nuevo
  fullName: string;
  email: string;
  role: UserRole;
  department?: string;
  createdAt?: string;
}

// 2. Datos para el Login (Lo que envía el formulario)
export interface LoginCredentials {
  id: string;      // DNI
  password: string;
}

// 3. Datos para el Registro
export interface RegisterData {
  id: string;      // DNI
  fullName: string;
  email: string;
  password: string;
  department?: string;
}

// 4. Respuesta del Servidor (Lo que devuelve Java)
export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

// 5. Estado Global de la App
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean; // Para mostrar spinner mientras carga
}