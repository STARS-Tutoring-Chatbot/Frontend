import { Session, createClient } from "@supabase/supabase-js";
import React, { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
);

function ProtectedRoutes() {
  const [session, setSession] = useState<Session | null>();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    console.log("PROTECTED ROUTE: SESSION");
    console.log(session);
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return true ? <Outlet /> : <Navigate to="/login" />;
}

export default ProtectedRoutes;
