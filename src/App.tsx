import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Route, Routes } from "react-router-dom";
import ProtectedRoutes from "./pages/protectedRoute";
import Login from "./pages/login/login";
import Landing from "./pages/landing";
import NavbarLayout from "./pages/conversation/conversationLayout";
import MessageWindow from "./pages/conversation/messageWindow";
import ConversationDashboard from "./pages/conversation/conversationDashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoutes />}>
        <Route element={<NavbarLayout />} path="/chat">
          <Route element={<ConversationDashboard />} path=""></Route>
          <Route element={<MessageWindow />} path=":conversationid"></Route>
        </Route>
      </Route>
      <Route path="*" />
    </Routes>
  );
}

export default App;
