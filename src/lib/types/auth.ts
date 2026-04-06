// export type UserRole = "admin" | "creator" | "learner";

// export interface AuthUser {
//   uid: string;
//   email: string;
//   displayName: string | null;
//   photoURL: string | null;
//   role: UserRole;
// }

// export interface LoginCredentials {
//   email: string;
//   password: string;
//   remember: boolean;
// }

// export interface AuthError {
//   code: string;
//   message: string;
// }

// export interface AuthResult {
//   success: boolean;
//   user?: AuthUser;
//   error?: AuthError;
// }
// ─── Auth Types ───────────────────────────────────────────────
export type UserRole = "admin" | "creator" | "learner";

export interface AuthUser {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  role: UserRole;
}

export interface LoginCredentials {
  email: string;
  password: string;
  remember: boolean;
}

export interface RegisterCredentials {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthError {
  code: string;
  message: string;
}

export interface AuthResult {
  success: boolean;
  user?: AuthUser;
  error?: AuthError;
}