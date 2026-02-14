import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trophy, User, Mail, Lock } from "lucide-react";
import "./auth.css";
import api from "../../services/api";
import loginBg from "../../assets/images/Pink Yellow and Green Playful Get to Know Me Presentation.jpg";

export default function SignUp() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isValidEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const n = name.trim();
    const em = email.trim().toLowerCase();
    const pw = password;
    const cpw = confirmPassword;

    if (!n || !em || !pw || !cpw) {
      setError("Todos los campos son obligatorios");
      return;
    }

    if (!isValidEmail(em)) {
      setError("El correo no es válido");
      return;
    }

    if (pw !== cpw) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/register", {
        name: n,
        email: em,
        password: pw,
        confirm_password: cpw,
      });

      setLoading(false);
      setSuccess("Registro exitoso. Ahora puedes iniciar sesión!");

      setTimeout(() => {
        navigate("/login");
      }, 900);

    } catch (err: any) {
      setLoading(false);

      const backendMsg =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.response?.data;

      setError(
        typeof backendMsg === "string"
          ? backendMsg
          : JSON.stringify(backendMsg) || "No se pudo registrar el usuario"
      );
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
              fontSize: "1.3rem",
              fontWeight: "500",
            }}
          >
            Plataforma de retos para desarrollo personal
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label className="auth-label">Nombre completo</label>
            <div className="auth-inputWrap">
              <User className="auth-icon" size={18} />
              <input
                className="auth-input"
                type="text"
                placeholder="Tu nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
            </div>
          </div>

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
            {loading ? "Registrando..." : "Registrarse"}
          </button>

          <button
            type="button"
            className="auth-link"
            onClick={() => navigate("/login")}
          >
            ¿Ya tienes cuenta? Inicia sesión
          </button>
        </form>
      </div>
    </div>
  );
}
