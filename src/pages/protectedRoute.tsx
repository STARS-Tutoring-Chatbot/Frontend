import React from "react";
import { Outlet, Navigate } from "react-router-dom";

function ProtectedRoutes() {
  // TODO: Create check Auth function
  let auth = { token: true };

  return auth.token ? <Outlet /> : <Navigate to="/login" />;
}

export default ProtectedRoutes;
