import { useAuth } from "@/util/authprovider";
import { Session, createClient } from "@supabase/supabase-js";
import React, { useEffect, useState } from "react";
import { Outlet, Navigate, useNavigate } from "react-router-dom";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
);

function ProtectedRoutes() {
  const { user, session } = useAuth();

  if (!session) {
    return <Navigate to={"/login"} />;
  }

  return <Outlet />;
}

export default ProtectedRoutes;
