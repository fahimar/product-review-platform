"use client";

import { useCallback, useEffect, useState } from "react";

const TOKEN_KEY = "reviewdibo_token";

export function useAuth() {
  const [token, setTokenState] = useState<string | null>(null);

  useEffect(() => {
    setTokenState(localStorage.getItem(TOKEN_KEY));
  }, []);

  const setToken = useCallback((t: string) => {
    localStorage.setItem(TOKEN_KEY, t);
    setTokenState(t);
  }, []);

  const clearToken = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setTokenState(null);
  }, []);

  return { token, setToken, clearToken };
}
