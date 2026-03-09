import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import { Search, Filter, Plus } from "lucide-react";
import "./retos.css";
import { getRetos } from "../../services/challengeApi";
import { getMyParticipations, joinReto } from "../../services/participationApi";

type Reto = {
  id: string;
  title: string;
  description: string | null;
  type: "academico" | "deporte" | "salud" | "productividad" | "personal";
  rules: string | null;
  start_date: string;
  end_date: string;
  creator_user_id: string;
  status: string;
  created_at: string;
  updated_at: string;
};

type Participation = {
  id: string;
  challenge_id: string;
  user_id: string;
  joined_at?: string;
};

export default function Retos() {
  const navigate = useNavigate();

  const [retos, setRetos] = useState<Reto[]>([]);
  const [q, setQ] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [joiningId, setJoiningId] = useState<string | null>(null);
  const [joinedRetos, setJoinedRetos] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchRetos = async () => {
      try {
        const data = await getRetos();
        console.log("Retos desde backend:", data);
        setRetos(data);
      } catch (error) {
        console.error("Error cargando retos:", error);
      }
    };

    fetchRetos();
  }, []);

  useEffect(() => {
    const fetchParticipations = async () => {
      try {
        const data: Participation[] = await getMyParticipations();
        const joinedIds = data.map((item) => item.challenge_id);
        setJoinedRetos(joinedIds);
      } catch (error) {
        console.error("Error cargando participaciones:", error);
      }
    };

    fetchParticipations();
  }, []);

  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
        setErrorMessage(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return retos;

    return retos.filter(
      (r) =>
        r.title.toLowerCase().includes(term) ||
        (r.description ?? "").toLowerCase().includes(term)
    );
  }, [q, retos]);

  const openCreate = () => {
    navigate("/retos/crear");
  };

  const handleJoin = async (retoId: string) => {
    try {
      setJoiningId(retoId);
      setSuccessMessage(null);
      setErrorMessage(null);

      await joinReto(retoId);

      setJoinedRetos((prev) =>
        prev.includes(retoId) ? prev : [...prev, retoId]
      );
      setSuccessMessage("Te uniste al reto correctamente");
    } catch (error: any) {
      console.error("Error al unirse al reto:", error);

      const message =
        error?.response?.data?.detail || "No se pudo unir al reto";

      setErrorMessage(message);
    } finally {
      setJoiningId(null);
    }
  };

  return (
    <div className="app-shell">
      <Navbar />

      <main className="retos-page">
        {successMessage && (
          <div className="floating-banner success-banner">
            ✔ {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="floating-banner error-banner">
            ✖ {errorMessage}
          </div>
        )}

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
          <div className="retos-empty">
            No hay retos disponibles en este momento.
          </div>
        ) : (
          <section className="retos-grid">
            {filtered.map((reto) => (
              <article
                key={reto.id}
                className="reto-card"
                onClick={() => navigate(`/retos/${reto.id}`)}
              >
                <h3 className="reto-title">{reto.title}</h3>

                <p className="reto-description">
                  {reto.description ?? "Sin descripción"}
                </p>

                <div className="reto-meta">
                  <span className="reto-type">
                    {reto.type.charAt(0).toUpperCase() + reto.type.slice(1)}
                  </span>

                  <span className="reto-status">
                    {reto.status === "active"
                      ? "Activo"
                      : reto.status === "finished"
                        ? "Finalizado"
                        : "Cancelado"}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleJoin(reto.id);
                  }}
                  disabled={
                    joiningId === reto.id || joinedRetos.includes(reto.id)
                  }
                  className="btn-join"
                >
                  {joiningId === reto.id
                    ? "Uniéndome..."
                    : joinedRetos.includes(reto.id)
                      ? "Ya te uniste"
                      : "Unirme al reto"}
                </button>
              </article>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}