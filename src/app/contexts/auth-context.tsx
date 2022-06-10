import { Session, User } from "@supabase/supabase-js";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuthStateChange, useClient } from "react-supabase";
import { IUser } from "../../shared/types/user";

interface Auth {
  session: Session | null;
  user: IUser | null;
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
  const supabase = useClient();
  const [state, setState] = useState<Auth>(initialState);

  const getUserProfile = async (userId?: string) => {
    return supabase
      .from("profiles")
      .select("id, display_name, email, role(name)")
      .eq("id", userId)
      .single();
  };

  useEffect(() => {
    const session = supabase.auth.session();

    getUserProfile(session?.user?.id).then(({ data }) => {
      setState({ session, user: (data as IUser) ?? null, loading: false });
    });
  }, []);

  useAuthStateChange((event, session) => {
    if (session?.user) {
      getUserProfile(session.user.id).then(({ data }) => {
        setState({
          session,
          user: data ?? null,
          loading: false,
        });
      });
    } else {
      setState({
        session,
        user: null,
        loading: false,
      });
    }
  });

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}
