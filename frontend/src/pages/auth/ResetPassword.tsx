import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trophy, Lock } from "lucide-react";
import "./auth.css";
import api from "../../services/api";
import loginBg from "../../assets/images/Pink Yellow and Green Playful Get to Know Me Presentation.jpg";

export default function ResetPassword() {
  const navigate = useNavigate();

  const [token, setToken] = useState(""); // token o código
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!token.trim()) {
      setError("El código es obligatorio");
      return;
    }
    if (!password.trim() || !confirmPassword.trim()) {
      setError("La contraseña y la confirmación son obligatorias");
      return;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener mínimo 6 caracteres");
      return;
    }
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/reset-password", {
        token: token.trim(),
        password,
        confirm_password: confirmPassword,
      });

      setSuccess("Contraseña actualizada. Ahora puedes iniciar sesión.");
      setTimeout(() => navigate("/login"), 900);
    } catch (err) {
      setError("No se pudo restablecer la contraseña");
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
              fontSize: "1.4rem",
              fontWeight: "500",
            }}
          >
            Restablecer contraseña
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label className="auth-label">Código</label>
            <div className="auth-inputWrap">
              <input
                className="auth-input"
                type="text"
                placeholder="Escribe el código"
                value={token}
                onChange={(e) => setToken(e.target.value)}
              />
            </div>
          </div>

          <div className="auth-field">
            <label className="auth-label">Nueva contraseña</label>
            <div className="auth-inputWrap">
              <Lock className="auth-icon" size={18} />
              <input
                className="auth-input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>
          </div>

          <div className="auth-field">
            <label className="auth-label">Confirmar contraseña</label>
            <div className="auth-inputWrap">
              <Lock className="auth-icon" size={18} />
              <input
                className="auth-input"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>
          </div>

          {error && <div className="auth-alert">{error}</div>}
          {success && <div className="auth-success">{success}</div>}

          <button className="auth-btn" type="submit" disabled={loading}>
            {loading ? "Actualizando..." : "Actualizar contraseña"}
          </button>

          <button
            type="button"
            className="auth-link"
            onClick={() => navigate("/login")}
          >
            Volver a iniciar sesión
          </button>
        </form>
      </div>
    </div>
  );
}
