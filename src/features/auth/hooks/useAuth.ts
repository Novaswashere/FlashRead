"use client";

import { useState } from "react";
import { User } from "../../../types";
import { authService } from "../../../services/auth";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loginWithEmail = async (email: string) => {
    setIsLoading(true);
    try {
      const res = await authService.signInWithEmail(email);
      setUser(res);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.signOut();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    isLoading,
    loginWithEmail,
    logout,
  };
}
