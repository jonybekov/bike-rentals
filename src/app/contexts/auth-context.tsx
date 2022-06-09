import { Session, User } from "@supabase/supabase-js";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuthStateChange, useClient } from "react-supabase";

interface Auth {
  session: Session | null;
  user: User | null;
  loading: boolean;
}

const initialState: Auth = { session: null, user: null, loading: true };
export const AuthContext = createContext(initialState);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw Error("useAuth must be used within AuthProvider");
  return context;
}

export function AuthProvider({ children }: React.PropsWithChildren<{}>) {
  const client = useClient();
  const [state, setState] = useState<Auth>(initialState);

  useEffect(() => {
    const session = client.auth.session();

    setState({ session, user: session?.user ?? null, loading: false });
  }, []);

  useAuthStateChange((event, session) => {
    console.log(`Supbase auth event: ${event}`, session);
    setState({ session, user: session?.user ?? null, loading: false });
  });

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}
