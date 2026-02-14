import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/LogIn";
import SignUp from "./pages/auth/SignUp";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import Retos from "./pages/retos/Retos";
import CreateReto from "./pages/retos/CreateReto";
import EditReto from "./pages/retos/EditReto";
import RetoDetail from "./pages/retos/RetoDetail";
import "./App.css";

export default function App() {
  return (
    <Routes>
      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/forgot" element={<ForgotPassword />} />
      <Route path="/reset" element={<ResetPassword />} />

      {/* Parte privada */}
      <Route path="/retos" element={<Retos />} />
      <Route path="/retos/crear" element={<CreateReto />} />
      <Route path="/retos/:id/editar" element={<EditReto />} />
      <Route path="/retos/:id" element={<RetoDetail />} />


      {/* Default */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
