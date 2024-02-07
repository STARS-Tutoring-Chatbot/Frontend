import { useAuth } from "@/util/authprovider";
import { getSupabaseClient } from "@/util/supabase";
import { Session, createClient } from "@supabase/supabase-js";
import React, { useEffect, useState } from "react";
import { Outlet, Navigate, useNavigate } from "react-router-dom";

const supabase = getSupabaseClient();

function ProtectedRoutes() {
  const { user, session } = useAuth();

  if (!session) {
    return <Navigate to={"/login"} />;
  }

  return <Outlet />;
}

export default ProtectedRoutes;
