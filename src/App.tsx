import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Route, Routes } from "react-router-dom";
import ProtectedRoutes from "./pages/protectedRoute";
import Login from "./pages/login/login";
import Landing from "./pages/landing";
import MessageWindow from "./pages/conversation/messageWindow";
import Dashboard from "./pages/dashboard/dashboard";

// TODO: fix issue with routing and
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoutes />} path="chat">
          <Route element={<Dashboard />} path="" />
          <Route element={<MessageWindow />} path=":conversationid" />
        </Route>
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </>
  );
}

export default App;
