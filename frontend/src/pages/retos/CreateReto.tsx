import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import "./createReto.css";

type RetoType = "Académico" | "Deporte" | "Salud" | "Productividad" | "Personal";

export default function CreateReto() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<RetoType | "">("");
  const [startDate, setStartDate] = useState(""); // yyyy-mm-dd
  const [endDate, setEndDate] = useState(""); // yyyy-mm-dd
  const [rules, setRules] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const durationText = useMemo(() => {
    if (!startDate || !endDate) return "—";
    const start = new Date(startDate + "T00:00:00");
    const end = new Date(endDate + "T00:00:00");
    const diff = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    if (!Number.isFinite(diff) || diff <= 0) return "—";
    return `${diff} día${diff === 1 ? "" : "s"}`;
  }, [startDate, endDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // 1) obligatorios
    if (!title.trim() || !description.trim() || !type || !startDate || !endDate || !rules.trim()) {
      setError("Debe llenar todos los campos solicitados.");
      return;
    }

    // 2) validar fechas (criterio de aceptación)
    // string yyyy-mm-dd funciona para comparar, pero validamos con Date también:
    const start = new Date(startDate + "T00:00:00");
    const end = new Date(endDate + "T00:00:00");

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      setError("Las fechas no son válidas.");
      return;
    }

    if (endDate < startDate) {
      setError("La duración del reto no es válida (la fecha fin debe ser mayor o igual a la fecha inicio).");
      return;
    }

    setSuccess("Reto creado exitosamente");

    // aquí luego conectas con tu back: POST /challenges
    setTimeout(() => navigate("/retos"), 900);
  };

  return (
    <div className="app-shell">
      <Navbar />

      <main className="createReto-wrap">
        <section className="createReto-modal">
          <header className="createReto-header">
            <div>
              <h1 className="createReto-title">Crear nuevo reto</h1>
              <p className="createReto-subtitle">
                Define el objetivo, el tipo y el rango de fechas. La duración debe ser válida.
              </p>
            </div>

            <button
              type="button"
              className="createReto-close"
              onClick={() => navigate("/retos")}
              aria-label="Cerrar"
              title="Cerrar"
            >
              ✕
            </button>
          </header>

          <div className="createReto-divider" />

          <form className="createReto-form" onSubmit={handleSubmit}>
            <Input
              label="Título del reto"
              placeholder="Ej: Leer 30 minutos diarios"
              value={title}
              setValue={setTitle}
            />

            <TextArea
              label="Descripción"
              placeholder="Describe el reto y sus objetivos..."
              value={description}
              setValue={setDescription}
              rows={4}
            />

            <div className="createReto-grid2">
              <div className="createReto-field">
                <label>Tipo</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as RetoType)}
                  className="createReto-select"
                >
                  <option value="">Selecciona un tipo</option>
                  <option value="Académico">Académico</option>
                  <option value="Deporte">Deporte</option>
                  <option value="Salud">Salud</option>
                  <option value="Productividad">Productividad</option>
                  <option value="Personal">Personal</option>
                </select>
              </div>

              <div className="createReto-field">
                <label>Duración (auto)</label>
                <div className="createReto-readonly">
                  {durationText}
                </div>
              </div>
            </div>

            <div className="createReto-grid2">
              <DateInput
                label="Fecha inicio"
                value={startDate}
                setValue={setStartDate}
                min=""
              />
              <DateInput
                label="Fecha fin"
                value={endDate}
                setValue={setEndDate}
                min={startDate || ""}
              />
            </div>

            <TextArea
              label="Reglas"
              placeholder="Ej: Se registra progreso diario. No se aceptan ediciones después de 24h..."
              value={rules}
              setValue={setRules}
              rows={4}
            />

            {error && <div className="createReto-alert error">{error}</div>}
            {success && <div className="createReto-alert success">{success}</div>}

            <div className="createReto-actions">
              <button
                type="button"
                className="createReto-cancelBtn"
                onClick={() => navigate("/retos")}
              >
                Cancelar
              </button>

              <button className="createReto-btn" type="submit">
                Crear reto
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
  placeholder,
  value,
  setValue,
}: {
  label: string;
  placeholder?: string;
  value: string;
  setValue: (v: string) => void;
}) {
  return (
    <div className="createReto-field">
      <label>{label}</label>
      <input
        className="createReto-input"
        type="text"
        placeholder={placeholder}
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
  placeholder,
  value,
  setValue,
  rows,
}: {
  label: string;
  placeholder?: string;
  value: string;
  setValue: (v: string) => void;
  rows?: number;
}) {
  return (
    <div className="createReto-field">
      <label>{label}</label>
      <textarea
        className="createReto-textarea"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={rows ?? 4}
      />
    </div>
  );
}
