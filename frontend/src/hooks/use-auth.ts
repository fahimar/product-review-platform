"use client";

import { useCallback, useEffect, useState } from "react";

const TOKEN_KEY = "reviewdibo_token";
const USER_NAME_KEY = "reviewdibo_username";

// token: undefined = not yet hydrated, null = logged out, string = logged in
export function useAuth() {
  const [token, setTokenState] = useState<string | null | undefined>(undefined);
  const [userName, setUserNameState] = useState<string | null>(null);

  useEffect(() => {
    setTokenState(localStorage.getItem(TOKEN_KEY));
    setUserNameState(localStorage.getItem(USER_NAME_KEY));
  }, []);

  const setToken = useCallback((t: string, name?: string) => {
    localStorage.setItem(TOKEN_KEY, t);
    setTokenState(t);
    if (name) {
      localStorage.setItem(USER_NAME_KEY, name);
      setUserNameState(name);
    }
  }, []);

  const clearToken = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_NAME_KEY);
    setTokenState(null);
    setUserNameState(null);
  }, []);

  return { token, userName, setToken, clearToken };
}
