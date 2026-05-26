import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/LogIn";
import SignUp from "./pages/auth/SignUp";
import Retos from "./pages/retos/Retos";
import CreateReto from "./pages/retos/CreateReto";
import EditReto from "./pages/retos/EditReto";
import RetoDetail from "./pages/retos/RetoDetail";
import Profile from "./pages/profile/Profile";
import Progreso from "./pages/progreso/Progreso";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Rewards from "./pages/recompensas/Rewards";
import "./App.css";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />

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

      <Route
        path="/progreso"
        element={
          <ProtectedRoute>
            <Progreso />
          </ProtectedRoute>
        }
      />

      <Route
        path="/recompensas"
        element={
          <ProtectedRoute>
            <Rewards />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}