import { Session, User, createClient } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import React from "react";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
);

export const AuthContext = createContext<{
  session: Session | null | undefined;
  user: User | null | undefined;
}>({ session: null, user: null });

export default function AuthProvider({ children }: any) {
  const [session, setSession] = useState<Session | null | undefined>(null);
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const setData = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) {
        throw error;
      } else {
        setSession(session);
        setUser(session?.user);
        setLoading(false);
      }
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user);
      setLoading(false);
    });

    setData();

    console.log("Provider:");
    console.log(session, user);

    return () => subscription.unsubscribe();
  }, []);

  const value = {
    session,
    user,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};
