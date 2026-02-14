import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trophy, Mail } from "lucide-react";
import "./auth.css";
import api from "../../services/api";
import loginBg from "../../assets/images/Pink Yellow and Green Playful Get to Know Me Presentation.jpg";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isValidEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const em = email.trim().toLowerCase();
    if (!em) {
      setError("El correo es obligatorio");
      return;
    }
    if (!isValidEmail(em)) {
      setError("El correo no es válido");
      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/forgot-password", { email: em });

      setSuccess(
        "Si el correo existe, te enviaremos instrucciones para restablecer tu contraseña."
      );
    } catch (err) {
      // Mismo mensaje para no filtrar info de usuarios
      setSuccess(
        "Si el correo existe, te enviaremos instrucciones para restablecer tu contraseña."
      );
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
            Recuperar contraseña
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

          {error && <div className="auth-alert">{error}</div>}
          {success && <div className="auth-success">{success}</div>}

          <button className="auth-btn" type="submit" disabled={loading}>
            {loading ? "Enviando..." : "Enviar instrucciones"}
          </button>

          <button
            type="button"
            className="auth-link"
            onClick={() => navigate("/login")}
          >
            Volver a iniciar sesión
          </button>

          <button
            type="button"
            className="auth-link"
            onClick={() => navigate("/reset")}
          >
            Ya tengo un código
          </button>
        </form>
      </div>
    </div>
  );
}
