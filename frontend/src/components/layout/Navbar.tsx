import { NavLink, useNavigate } from "react-router-dom";
import { Trophy, TrendingUp, Gift, LogOut } from "lucide-react";
import "./navbar.css";

export default function Navbar() {
  const navigate = useNavigate();

  const username = localStorage.getItem("name") || "Usuario";
  const userInitial = username.charAt(0).toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    navigate("/login");
  };

  const handleGoToProfile = () => {
    navigate("/profile");
  };

  return (
    <header className="navWrap">
      <div className="navInner">
        <div className="navBrand">
          <span className="navBrandText">MetaTrack</span>
        </div>

        <nav className="navTabs" aria-label="Navegación principal">
          <NavLink
            to="/retos"
            className={({ isActive }) => `navTab ${isActive ? "active" : ""}`}
          >
            <Trophy size={18} />
            <span>Retos</span>
          </NavLink>

          <button type="button" className="navTab">
            <TrendingUp size={18} />
            <span>Progreso</span>
          </button>

          <button type="button" className="navTab">
            <Gift size={18} />
            <span>Recompensas</span>
          </button>
        </nav>

        <div className="navRight">
          <button type="button" className="navUser" onClick={handleGoToProfile}>
            <span className="navAvatar">{userInitial}</span>
            <span className="navUserText">{username}</span>
          </button>

          <button className="navLogout" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Salir</span>
          </button>
        </div>
      </div>
    </header>
  );
}