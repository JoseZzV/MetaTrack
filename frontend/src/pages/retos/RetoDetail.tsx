import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import "./retoDetail.css";
import ConfirmModal from "../../components/ui/ConfirmModal";
import { deleteReto, getRetoById } from "../../services/challengeApi";

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

  useEffect(() => {
    const fetchReto = async () => {
      if (!id) return;

      try {
        const data = await getRetoById(id);
        console.log("Reto desde backend:", data);
        setReto(data);
      } catch (error) {
        console.error("Error cargando reto:", error);
      }
    };

    fetchReto();
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
            ← Volver a Retos
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
              <p className="retoDetail-text">{reto.rules ?? "Sin reglas"}</p>
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