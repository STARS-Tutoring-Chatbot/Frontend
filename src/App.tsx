import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/login/login";
import Landing from "./pages/landing";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/chat" />
      <Route path="*" />
    </Routes>
  );
}

export default App;
