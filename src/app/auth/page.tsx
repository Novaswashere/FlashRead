"use client";

import React, { useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";

export default function AuthPage() {
  const { loginWithEmail, isLoading } = useAuth();
  const [email, setEmail] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      loginWithEmail(email);
    }
  };

  return (
    <main className="pt-24 pb-20 md:pb-8 md:pl-72 px-space-md max-w-container-max mx-auto min-h-screen flex items-center justify-center">
      <div className="bg-surface-container-lowest border border-border-subtle rounded-xl p-space-lg w-full max-w-md shadow-sm">
        <h2 className="font-headline-md text-headline-md font-bold text-primary mb-2 text-center">
          Welcome to ReadPilot
        </h2>
        <p className="text-on-surface-variant text-center mb-space-lg">
          Focus your mind. Speed read your documents.
        </p>
        <form onSubmit={handleLogin} className="flex flex-col gap-space-md">
          <div className="flex flex-col gap-1">
            <label className="font-label-mono text-label-mono text-on-surface-variant uppercase">
              Email Address
            </label>
            <input
              type="email"
              className="w-full bg-surface-container-lowest border border-border-subtle rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-on-primary h-12 rounded-lg font-bold hover:brightness-110 active:scale-95 transition-all mt-2"
          >
            {isLoading ? "Signing In..." : "Continue with Email"}
          </button>
        </form>
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border-subtle"></div>
          </div>
          <span className="relative px-3 bg-surface-container-lowest text-xs text-outline uppercase font-label-mono">
            or
          </span>
        </div>
        <button className="w-full border border-border-subtle bg-surface-container-low hover:bg-surface-container-high h-12 rounded-lg font-bold active:scale-95 transition-all flex items-center justify-center gap-2">
          <span>Continue with Google</span>
        </button>
      </div>
    </main>
  );
}
