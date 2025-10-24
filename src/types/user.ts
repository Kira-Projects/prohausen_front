/**
 * Tipos TypeScript para el sistema de usuarios
 */

export interface User {
  _id?: string;
  id?: string;
  nombre: string;
  email: string;
  password?: string; // Solo para creación, no se envía al frontend
  role: "admin" | "user"; // Rol del usuario
  createdAt?: Date;
  updatedAt?: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  user: {
    id: string;
    nombre: string;
    email: string;
    role: "admin" | "user";
  };
  token: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface CreateUserRequest {
  nombre: string;
  email: string;
  password: string;
  role?: "admin" | "user"; // Opcional, por defecto "user"
}

export interface UpdateUserRequest {
  nombre?: string;
  email?: string;
}
