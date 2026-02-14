import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import "./retoDetail.css";
import ConfirmModal from "../../components/ui/ConfirmModal";

export default function RetoDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [isOwner] = useState(true); // cambia a false para probar "no autorizado"
  const [message, setMessage] = useState<string | null>(null);
  const [openDelete, setOpenDelete] = useState(false);

  // Click en "Eliminar" (abre modal o muestra error)
  const handleDeleteClick = () => {
    setMessage(null);

    if (!isOwner) {
      setMessage("No tiene permisos para eliminar este reto");
      return;
    }

    setOpenDelete(true);
  };

  // Confirmar eliminación (escenario 1)
  const confirmDelete = () => {
    setOpenDelete(false);

    // Aquí luego irá el DELETE real al backend
    setMessage("Reto eliminado exitosamente");

    setTimeout(() => {
      navigate("/retos");
    }, 900);
  };

  // Cancelar eliminación (escenario 2)
  const cancelDelete = () => {
    setOpenDelete(false);
  };

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
            {/* Botones visibles solo si es el creador */}
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
              <h1 className="retoDetail-title">Detalle del reto</h1>
              <p className="retoDetail-subtitle">
                (Solo front) Aquí se mostrará la información del reto <b>#{id}</b>
              </p>
            </div>

            <span className="retoDetail-chip chip-borrador">Borrador</span>
          </div>

          <div className="retoDetail-grid">
            <Info label="Título" value="—" />
            <Info label="Tipo" value="—" />
            <Info label="Duración" value="—" />
          </div>

          <div className="retoDetail-section">
            <h3 className="retoDetail-sectionTitle">Descripción</h3>
            <p className="retoDetail-text">—</p>
          </div>

          <div className="retoDetail-section">
            <h3 className="retoDetail-sectionTitle">Reglas</h3>
            <p className="retoDetail-text">—</p>
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
