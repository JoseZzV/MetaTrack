import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Trophy } from "lucide-react";
import "./auth.css";
import api from "../../services/api";
import loginBg from "../../assets/images/Pink Yellow and Green Playful Get to Know Me Presentation.jpg";

export default function LogIn() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError("Los campos son obligatorios");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/auth/login", {
        email: email.trim().toLowerCase(),
        password,
      });

      localStorage.setItem("token", res.data.access_token);

      setTimeout(() => navigate("/retos"), 400);
    } catch (err) {
      setError("Credenciales no válidas");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="auth-page"
      style={{
        backgroundImage: `url(${loginBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
      }}
    >
      <div className="auth-card" style={{ fontFamily: "MetaText" }}>
        <div className="auth-header">
          <div className="auth-badge">
            <Trophy size={45} />
          </div>

          <h1
            className="auth-title"
            style={{
              fontFamily: "MetaTitle",
              fontSize: "4rem",
              fontWeight: "400",
              letterSpacing: "4px",
            }}
          >
            MetaTrack
          </h1>

          <p
            className="auth-subtitle"
            style={{
              fontSize: "1.1rem",
              fontWeight: "100",
            }}
          >
            Plataforma de retos para desarrollo personal
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label className="auth-label">Correo electrónico</label>
            <div className="auth-inputWrap">
              <Mail className="auth-icon" size={18} />
              <input
                className="auth-input"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
          </div>

          <div className="auth-field">
            <label className="auth-label">Contraseña</label>
            <div className="auth-inputWrap">
              <Lock className="auth-icon" size={18} />
              <input
                className="auth-input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>
          </div>

          {error && <div className="auth-alert">{error}</div>}

          <button className="auth-btn" type="submit" disabled={loading}>
            {loading ? "Validando..." : "Iniciar sesión"}
          </button>

          <button
            type="button"
            className="auth-link"
            onClick={() => navigate("/forgot")}
          >
            ¿Olvidaste tu contraseña?
          </button>

          <button
            type="button"
            className="auth-link"
            onClick={() => navigate("/signup")}
          >
            ¿No tienes cuenta? Regístrate
          </button>
        </form>
      </div>
    </div>
  );
}
