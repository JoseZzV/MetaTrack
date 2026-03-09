import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import "./createReto.css";
import { getRetoById, updateReto } from "../../services/challengeApi";

export default function EditReto() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [rules, setRules] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchReto = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getRetoById(id);

        setTitle(data.title ?? "");
        setDescription(data.description ?? "");
        setType(data.type ?? "");
        setStartDate(data.start_date?.split("T")[0] ?? "");
        setEndDate(data.end_date?.split("T")[0] ?? "");
        setRules(data.rules ?? "");
      } catch (err) {
        setError("No se pudo cargar el reto");
      } finally {
        setLoading(false);
      }
    };

    fetchReto();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!id) {
      setError("No se encontró el reto");
      return;
    }

    if (
      !title.trim() ||
      !description.trim() ||
      !type ||
      !startDate ||
      !endDate ||
      !rules.trim()
    ) {
      setError("Debe llenar todos los campos solicitados");
      return;
    }

    if (endDate < startDate) {
      setError("La duración del reto no es válida");
      return;
    }

    try {
      setLoading(true);

      const challengeData = {
        title,
        description,
        type,
        rules,
        start_date: new Date(startDate).toISOString(),
        end_date: new Date(endDate).toISOString(),
      };

      await updateReto(id, challengeData);

      setSuccess("Reto actualizado exitosamente");

      setTimeout(() => navigate(`/retos/${id}`), 900);
    } catch (err: any) {
      if (err.response?.status === 403) {
        setError("No tienes permiso para editar este reto");
        return;
      }

      setError(err.response?.data?.detail || "Error al actualizar el reto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell">
      <Navbar />

      <main className="createReto-wrap">
        <section className="createReto-modal">
          <div className="createReto-header">
            <div>
              <h1 className="createReto-title">Editar Reto</h1>
              <p className="createReto-subtitle">
                Modifica la información de tu reto
              </p>
            </div>
          </div>

          <div className="createReto-divider"></div>

          <form className="createReto-form" onSubmit={handleSubmit}>
            <Input label="Título" value={title} setValue={setTitle} />

            <TextArea
              label="Descripción"
              value={description}
              setValue={setDescription}
            />

            <div className="createReto-field">
              <label>Tipo</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="createReto-select"
              >
                <option value="">Selecciona un tipo</option>
                <option value="academico">Académico</option>
                <option value="deporte">Deporte</option>
                <option value="salud">Salud</option>
                <option value="productividad">Productividad</option>
                <option value="personal">Personal</option>
              </select>
            </div>

            <DateInput
              label="Fecha inicio"
              value={startDate}
              setValue={setStartDate}
            />

            <DateInput
              label="Fecha fin"
              value={endDate}
              setValue={setEndDate}
              min={startDate}
            />

            <TextArea label="Reglas" value={rules} setValue={setRules} />

            {error && <div className="createReto-alert error">{error}</div>}
            {success && <div className="createReto-alert success">{success}</div>}

            <div className="createReto-actions">
              <button
                type="button"
                className="createReto-cancelBtn"
                onClick={() => navigate(`/retos/${id}`)}
              >
                Cancelar
              </button>

              <button
                className="createReto-btn"
                type="submit"
                disabled={loading}
              >
                {loading ? "Guardando..." : "Guardar cambios"}
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}

function Input({
  label,
  value,
  setValue,
}: {
  label: string;
  value: string;
  setValue: (v: string) => void;
}) {
  return (
    <div className="createReto-field">
      <label>{label}</label>
      <input
        className="createReto-input"
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
}

function DateInput({
  label,
  value,
  setValue,
  min,
}: {
  label: string;
  value: string;
  setValue: (v: string) => void;
  min?: string;
}) {
  return (
    <div className="createReto-field">
      <label>{label}</label>
      <input
        className="createReto-input"
        type="date"
        value={value}
        min={min}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
}

function TextArea({
  label,
  value,
  setValue,
}: {
  label: string;
  value: string;
  setValue: (v: string) => void;
}) {
  return (
    <div className="createReto-field">
      <label>{label}</label>
      <textarea
        className="createReto-textarea"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={4}
      />
    </div>
  );
}