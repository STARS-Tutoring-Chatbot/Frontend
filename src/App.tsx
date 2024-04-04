import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Route, Routes } from "react-router-dom";
import ProtectedRoutes from "./pages/protectedRoute";
import Login from "./pages/login/login";
import Landing from "./pages/landing";
import MessageWindow from "./pages/conversation/messageWindow";
import Dashboard from "./pages/dashboard/dashboard";
import CreateAccount from "./pages/login/CreateAccount"; // My import here
import ForgotPassword from "./pages/login/forgotPassword";
import UpdateForgotPassword from "./pages/login/updateForgotPassword";
// TODO: fix issue with routing and
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create" element={<CreateAccount />} />
        <Route path="/forgot" element={<ForgotPassword />}></Route>
        <Route path="/forgot/update" element={<UpdateForgotPassword />} />
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
