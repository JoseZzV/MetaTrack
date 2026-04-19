import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import "./retoDetail.css";
import ConfirmModal from "../../components/ui/ConfirmModal";
import { deleteReto, getRetoById } from "../../services/challengeApi";
import {
  getMyProgressByChallenge,
  registerProgress,
  type ProgressItem,
} from "../../services/progressApi";

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

export default function RetoDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [isOwner] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [reto, setReto] = useState<Reto | null>(null);

  const [progressList, setProgressList] = useState<ProgressItem[]>([]);
  const [progressDescription, setProgressDescription] = useState("");
  const [progressDate, setProgressDate] = useState("");
  const [progressMessage, setProgressMessage] = useState<string | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(false);
  const [savingProgress, setSavingProgress] = useState(false);

  useEffect(() => {
    const fetchReto = async () => {
      if (!id) return;

      try {
        const data = await getRetoById(id);
        setReto(data);
      } catch (error) {
        console.error("Error cargando reto:", error);
      }
    };

    fetchReto();
  }, [id]);

  useEffect(() => {
    const fetchProgress = async () => {
      if (!id) return;

      try {
        setLoadingProgress(true);
        const data = await getMyProgressByChallenge(id);
        setProgressList(data);
      } catch (error) {
        console.error("Error cargando progreso:", error);
      } finally {
        setLoadingProgress(false);
      }
    };

    fetchProgress();
  }, [id]);

  const handleDeleteClick = () => {
    setMessage(null);

    if (!isOwner) {
      setMessage("No tiene permisos para eliminar este reto");
      return;
    }

    setOpenDelete(true);
  };

  const confirmDelete = async () => {
    if (!id) return;

    try {
      await deleteReto(id);
      setOpenDelete(false);
      setMessage("Reto eliminado exitosamente");

      setTimeout(() => {
        navigate("/retos");
      }, 900);
    } catch (error) {
      console.error("Error eliminando reto:", error);
      setOpenDelete(false);
      setMessage("No se pudo eliminar el reto");
    }
  };

  const cancelDelete = () => {
    setOpenDelete(false);
  };

  const handleRegisterProgress = async (e: React.FormEvent) => {
    e.preventDefault();
    setProgressMessage(null);

    if (!id) return;

    if (!progressDescription.trim()) {
      setProgressMessage("Debes escribir una descripción del progreso");
      return;
    }

    try {
      setSavingProgress(true);

      await registerProgress({
        challenge_id: id,
        progress_date: progressDate || undefined,
        description: progressDescription.trim(),
      });

      setProgressMessage("Progreso registrado correctamente");
      setProgressDescription("");
      setProgressDate("");

      const updatedProgress = await getMyProgressByChallenge(id);
      setProgressList(updatedProgress);
    } catch (error: any) {
      console.error("Error registrando progreso:", error);

      const backendMessage =
        error?.response?.data?.detail || "No se pudo registrar el progreso";

      setProgressMessage(backendMessage);
    } finally {
      setSavingProgress(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-CO");
  };

  const getDurationText = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);

    const diff =
      Math.round(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      ) + 1;

    if (!Number.isFinite(diff) || diff <= 0) return "Duración no válida";
    return `${diff} día${diff === 1 ? "" : "s"}`;
  };

  const getStatusText = (status: string) => {
    if (status === "active") return "Activo";
    if (status === "finished") return "Finalizado";
    if (status === "cancelled") return "Cancelado";
    return status;
  };

  const getTypeText = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  if (!reto) {
    return (
      <div className="app-shell">
        <Navbar />
        <main className="retoDetail-page">
          <section className="retoDetail-card">
            <h1 className="retoDetail-title">Cargando reto...</h1>
            <p className="retoDetail-subtitle">
              Espera un momento mientras traemos la información.
            </p>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <Navbar />

      <main className="retoDetail-page">
        <div className="retoDetail-top">
          <button
            className="retoDetail-linkBtn"
            type="button"
            onClick={() => navigate("/retos")}
          >
            Volver a Retos
          </button>

          <div className="retoDetail-actions">
            {isOwner && (
              <>
                <button
                  className="retoDetail-secondaryBtn"
                  type="button"
                  onClick={() => navigate(`/retos/${id}/editar`)}
                >
                  Editar reto
                </button>

                <button
                  className="retoDetail-dangerBtn"
                  type="button"
                  onClick={handleDeleteClick}
                >
                  Eliminar reto
                </button>
              </>
            )}
          </div>
        </div>

        <section className="retoDetail-card">
          <div className="retoDetail-header">
            <div>
              <h1 className="retoDetail-title">{reto.title}</h1>
              <p className="retoDetail-subtitle">
                Consulta toda la información del reto seleccionado.
              </p>
            </div>

            <span className="retoDetail-chip chip-status">
              {getStatusText(reto.status)}
            </span>
          </div>

          <div className="retoDetail-grid">
            <Info label="Tipo" value={getTypeText(reto.type)} />
            <Info
              label="Duración"
              value={getDurationText(reto.start_date, reto.end_date)}
            />
            <Info label="Estado" value={getStatusText(reto.status)} />
          </div>

          <div className="retoDetail-contentGrid">
            <div className="retoDetail-sectionCard">
              <h3 className="retoDetail-sectionTitle">Descripción</h3>
              <p className="retoDetail-text">
                {reto.description ?? "Sin descripción"}
              </p>
            </div>

            <div className="retoDetail-sectionCard">
              <h3 className="retoDetail-sectionTitle">Reglas</h3>

              {reto.rules ? (
                <ul className="retoDetail-list">
                  {reto.rules.split(".").map((rule, index) =>
                    rule.trim() !== "" ? (
                      <li key={index}>{rule.trim()}</li>
                    ) : null
                  )}
                </ul>
              ) : (
                <p className="retoDetail-text">Sin reglas</p>
              )}
            </div>
          </div>

          <div className="retoDetail-grid retoDetail-gridBottom">
            <Info label="Fecha de inicio" value={formatDate(reto.start_date)} />
            <Info
              label="Fecha de finalización"
              value={formatDate(reto.end_date)}
            />
            <Info label="ID del reto" value={reto.id} />
          </div>

          {message && <div className="retoDetail-alert">{message}</div>}
        </section>

        <section className="retoDetail-card retoProgress-card">
          <div className="retoDetail-header">
            <div>
              <h2 className="retoProgress-title">Registrar progreso</h2>
              <p className="retoDetail-subtitle">
                Guarda tu avance diario en este reto.
              </p>
            </div>
          </div>

          <form onSubmit={handleRegisterProgress} className="retoProgress-form">
            <div className="retoProgress-field">
              <label className="retoProgress-label">Fecha</label>
              <input
                className="retoProgress-input"
                type="date"
                value={progressDate}
                onChange={(e) => setProgressDate(e.target.value)}
              />
            </div>

            <div className="retoProgress-field">
              <label className="retoProgress-label">
                Descripción del progreso
              </label>
              <textarea
                className="retoProgress-textarea"
                value={progressDescription}
                onChange={(e) => setProgressDescription(e.target.value)}
                placeholder="Ejemplo: Hoy avancé 2 módulos del curso y resolví 5 ejercicios."
              />
            </div>

            <div className="retoProgress-actions">
              <button
                type="submit"
                className="retoDetail-secondaryBtn"
                disabled={savingProgress}
              >
                {savingProgress ? "Guardando..." : "Registrar progreso"}
              </button>
            </div>
          </form>

          {progressMessage && (
            <div
              className={`retoDetail-alert ${
                progressMessage === "Progreso registrado correctamente"
                  ? "retoDetail-alertSuccess"
                  : ""
              }`}
            >
              {progressMessage}
            </div>
          )}
        </section>

        <section className="retoDetail-card retoProgress-card">
          <div className="retoDetail-header">
            <div>
              <h2 className="retoProgress-title">Mi progreso</h2>
              <p className="retoDetail-subtitle">
                Aquí puedes ver el avance registrado por fecha.
              </p>
            </div>
          </div>

          {loadingProgress ? (
            <p className="retoDetail-text">Cargando progreso...</p>
          ) : progressList.length === 0 ? (
            <div className="retoProgress-empty">
              <p className="retoDetail-text">
                Aún no has registrado progreso en este reto.
              </p>
            </div>
          ) : (
            <div className="retoProgress-list">
              {progressList
                .slice()
                .sort(
                  (a, b) =>
                    new Date(b.progress_date).getTime() -
                    new Date(a.progress_date).getTime()
                )
                .map((item) => (
                  <article key={item.id} className="retoProgress-item">
                    <div className="retoProgress-itemTop">
                      <span className="retoProgress-date">
                        {formatDate(item.progress_date)}
                      </span>
                    </div>

                    <p className="retoDetail-text">{item.description}</p>
                  </article>
                ))}
            </div>
          )}
        </section>

        <ConfirmModal
          open={openDelete}
          title="Eliminar reto"
          message="Esta acción no se puede deshacer. ¿Deseas eliminar este reto?"
          confirmText="Sí, eliminar"
          cancelText="Cancelar"
          danger
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      </main>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="retoDetail-info">
      <div className="retoDetail-infoLabel">{label}</div>
      <div className="retoDetail-infoValue">{value}</div>
    </div>
  );
}