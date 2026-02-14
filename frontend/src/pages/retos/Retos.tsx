import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";   // ✅ AÑADE ESTO
import Navbar from "../../components/layout/Navbar";
import { Search, Filter, Plus } from "lucide-react";
import "./retos.css";

type Reto = {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  participants: number;
  days: number;
  points: number;
};

export default function Retos() {
  const navigate = useNavigate();                 // ✅ AÑADE ESTO

  const [retos] = useState<Reto[]>([]);
  const [q, setQ] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return retos;
    return retos.filter(
      (r) =>
        r.title.toLowerCase().includes(term) ||
        r.description.toLowerCase().includes(term)
    );
  }, [q, retos]);

  const openCreate = () => {
    navigate("/retos/crear");                     // ✅ AQUÍ
  };

  return (
    <div className="app-shell">
      <Navbar />

      <main className="retos-page">
        <div className="retos-top">
          <div>
            <h1 className="retos-h1">Explora retos</h1>
            <p className="retos-sub">
              Encuentra el reto perfecto para alcanzar tus objetivos
            </p>
          </div>

          <button className="btn-create" type="button" onClick={openCreate}>
            <Plus size={18} />
            Crear reto
          </button>
        </div>

        <div className="retos-toolbar">
          <div className="searchBox">
            <Search size={18} className="searchIcon" />
            <input
              className="searchInput"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar retos..."
            />
          </div>

          <button
            className={`btn-filter ${showFilters ? "active" : ""}`}
            type="button"
            onClick={() => setShowFilters((v) => !v)}
          >
            <Filter size={18} />
            Filtros
          </button>
        </div>

        {showFilters && (
          <div className="filtersPanel">
            <div className="filtersTitle">Filtros</div>
            <div className="filtersRow">
              <span className="pill">Categoría</span>
              <span className="pill">Dificultad</span>
              <span className="pill">Duración</span>
              <span className="pill">Puntos</span>
            </div>
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="retos-empty">No hay retos disponibles en este momento.</div>
        ) : (
          <section className="retos-grid"></section>
        )}
      </main>
    </div>
  );
}
