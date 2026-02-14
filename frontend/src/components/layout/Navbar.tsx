import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Trophy, TrendingUp, Gift, LogOut, User } from "lucide-react";
import "./navbar.css";

type Props = { username?: string };

export default function Navbar({ username = "Usuario" }: Props) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="navWrap">
      <div className="navInner">
        {/* Left: Brand */}
        <div className="navBrand">
          <span className="navBrandText">MetaTrack</span>
        </div>

        {/* Center: Tabs */}
        <nav className="navTabs" aria-label="Navegación principal">
          <button type="button" className="navTab">
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </button>

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

        {/* Right: User + Logout */}
        <div className="navRight">
          <div className="navUser">
            <User size={18} />
            <span className="navUserText">{username}</span>
          </div>

          <button className="navLogout" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Salir</span>
          </button>
        </div>
      </div>
    </header>
  );
}
