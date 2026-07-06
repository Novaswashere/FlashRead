import { User } from "../types";

export interface IAuthService {
  getCurrentUser(): Promise<User | null>;
  signInWithGoogle(): Promise<User>;
  signInWithEmail(email: string): Promise<User>;
  signOut(): Promise<void>;
}

export class AuthService implements IAuthService {
  async getCurrentUser(): Promise<User | null> {
    return null; // Placeholder stub
  }

  async signInWithGoogle(): Promise<User> {
    throw new Error("Method not implemented.");
  }

  async signInWithEmail(email: string): Promise<User> {
    throw new Error("Method not implemented.");
  }

  async signOut(): Promise<void> {
    return;
  }
}

export const authService = new AuthService();
