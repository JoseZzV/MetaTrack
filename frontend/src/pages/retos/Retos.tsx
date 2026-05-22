import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import { Search, Filter, Plus } from "lucide-react";
import "./retos.css";
import { getRetos } from "../../services/challengeApi";
import {
  getMyParticipations,
  joinReto,
  abandonReto,
} from "../../services/participationApi";

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
  status: string;
  joined_at?: string;
};

export default function Retos() {
  const navigate = useNavigate();

  const [retos, setRetos] = useState<Reto[]>([]);
  const [q, setQ] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const [selectedType, setSelectedType] = useState("");
  const [durationDays, setDurationDays] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [order, setOrder] = useState("asc");

  const [joiningId, setJoiningId] = useState<string | null>(null);
  const [joinedRetos, setJoinedRetos] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [showAbandonModal, setShowAbandonModal] = useState(false);
  const [selectedRetoId, setSelectedRetoId] = useState<string | null>(null);

  useEffect(() => {
    const fetchRetos = async () => {
      try {
        const params: any = {};

        if (selectedType) {
          params.type = selectedType;
        }

        if (durationDays) {
          params.duration_days = Number(durationDays);
        }

        if (sortBy) {
          params.sort_by = sortBy;
          params.order = order;
        }

        const data = await getRetos(params);

        console.log("Retos filtrados:", data);

        setRetos(data);
      } catch (error) {
        console.error("Error cargando retos:", error);
      }
    };

    fetchRetos();
  }, [selectedType, durationDays, sortBy, order]);

  useEffect(() => {
    const fetchParticipations = async () => {
      try {
        const data: Participation[] = await getMyParticipations();

        const joinedIds = data
          .filter((item) => item.status === "active")
          .map((item) => item.challenge_id);

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

  const handleAbandon = (retoId: string) => {
    setSelectedRetoId(retoId);
    setShowAbandonModal(true);
  };

  const confirmAbandonReto = async () => {
    if (!selectedRetoId) return;

    try {
      setJoiningId(selectedRetoId);
      setSuccessMessage(null);
      setErrorMessage(null);

      await abandonReto(selectedRetoId);

      setJoinedRetos((prev) => prev.filter((id) => id !== selectedRetoId));

      setSuccessMessage("Abandonaste el reto correctamente");
    } catch (error: any) {
      console.error("Error al abandonar el reto:", error);

      const message =
        error?.response?.data?.detail || "No se pudo abandonar el reto";

      setErrorMessage(message);
    } finally {
      setJoiningId(null);
      setSelectedRetoId(null);
      setShowAbandonModal(false);
    }
  };

  const closeAbandonModal = () => {
    setShowAbandonModal(false);
    setSelectedRetoId(null);
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
            <div className="filtersTitle">Filtros y orden</div>

            <div className="filtersColumn">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="filterSelect"
              >
                <option value="">Todas las categorías</option>
                <option value="academico">Académico</option>
                <option value="deporte">Deporte</option>
                <option value="salud">Salud</option>
                <option value="productividad">Productividad</option>
                <option value="personal">Personal</option>
              </select>

              <select
                value={durationDays}
                onChange={(e) => setDurationDays(e.target.value)}
                className="filterSelect"
              >
                <option value="">Todas las duraciones</option>
                <option value="7">7 días</option>
                <option value="15">15 días</option>
                <option value="30">30 días</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="filterSelect"
              >
                <option value="">Sin ordenar</option>
                <option value="start_date">Fecha</option>
                <option value="duration">Duración</option>
              </select>

              <select
                value={order}
                onChange={(e) => setOrder(e.target.value)}
                className="filterSelect"
              >
                <option value="asc">Ascendente</option>
                <option value="desc">Descendente</option>
              </select>

              <button
                className="clearFiltersBtn"
                onClick={() => {
                  setSelectedType("");
                  setDurationDays("");
                  setSortBy("");
                  setOrder("asc");
                }}
              >
                Limpiar filtros
              </button>
            </div>
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="retos-empty">
            No hay retos disponibles con esos criterios.
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
                    {reto.type.charAt(0).toUpperCase() +
                      reto.type.slice(1)}
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

                    if (reto.status === "finished") return;

                    if (joinedRetos.includes(reto.id)) {
                      handleAbandon(reto.id);
                    } else {
                      handleJoin(reto.id);
                    }
                  }}
                  disabled={
                    joiningId === reto.id ||
                    reto.status === "finished"
                  }
                  className={`btn-join ${
                    joinedRetos.includes(reto.id)
                      ? "btn-abandon"
                      : ""
                  } ${
                    reto.status === "finished"
                      ? "btn-disabled"
                      : ""
                  }`}
                >
                  {reto.status === "finished"
                    ? "Reto finalizado"
                    : joiningId === reto.id
                    ? "Procesando..."
                    : joinedRetos.includes(reto.id)
                    ? "Abandonar reto"
                    : "Unirme al reto"}
                </button>
              </article>
            ))}
          </section>
        )}

        {showAbandonModal && (
          <div className="modal-overlay">
            <div className="modal-box">
              <h3 className="modal-title">Abandonar reto</h3>

              <p className="modal-text">
                ¿Estás seguro de que deseas abandonar este reto?
              </p>

              <div className="modal-actions">
                <button
                  type="button"
                  className="modal-cancel"
                  onClick={closeAbandonModal}
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  className="modal-confirm"
                  onClick={confirmAbandonReto}
                >
                  Sí, abandonar
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}