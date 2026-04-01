import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/LogIn";
import SignUp from "./pages/auth/SignUp";
import Retos from "./pages/retos/Retos";
import CreateReto from "./pages/retos/CreateReto";
import EditReto from "./pages/retos/EditReto";
import RetoDetail from "./pages/retos/RetoDetail";
import Profile from "./pages/profile/Profile";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import "./App.css";

export default function App() {
  return (
    <Routes>
      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />

      {/* Privadas */}
      <Route
        path="/retos"
        element={
          <ProtectedRoute>
            <Retos />
          </ProtectedRoute>
        }
      />

      <Route
        path="/retos/crear"
        element={
          <ProtectedRoute>
            <CreateReto />
          </ProtectedRoute>
        }
      />

      <Route
        path="/retos/:id/editar"
        element={
          <ProtectedRoute>
            <EditReto />
          </ProtectedRoute>
        }
      />

      <Route
        path="/retos/:id"
        element={
          <ProtectedRoute>
            <RetoDetail />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Default */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}