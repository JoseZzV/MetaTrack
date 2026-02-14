import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import "./createReto.css";

export default function EditReto() {
  const navigate = useNavigate();
  const { id } = useParams();

  // TEMPORAL: control de creador (cuando conectes back, esto se reemplaza)
  // Cambia esto a false para probar que bloquea el acceso
  const IS_OWNER = true;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [rules, setRules] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Escenario 2: campos obligatorios vacíos
    if (!title || !description || !type || !startDate || !endDate || !rules) {
      setError("Debe llenar todos los campos solicitados");
      return;
    }

    // Escenario 3: duración inválida
    if (endDate < startDate) {
      setError("La duración del reto no es válida");
      return;
    }

    // Escenario 1: edición exitosa
    setSuccess("Reto actualizado exitosamente");

    setTimeout(() => {
      navigate(`/retos/${id}`);
    }, 900);
  };

  // Si NO es el creador, bloquea edición
  if (!IS_OWNER) {
    return (
      <div className="app-shell">
        <Navbar />
        <main className="createReto-page">
          <h1 className="createReto-title">Editar Reto</h1>
          <div className="createReto-error">
            No tienes permiso para editar este reto.
          </div>

          <div className="createReto-actions">
            <button
              type="button"
              className="createReto-cancelBtn"
              onClick={() => navigate(`/retos/${id}`)}
            >
              Volver al reto
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <Navbar />

      <main className="createReto-page">
        <h1 className="createReto-title">Editar Reto</h1>

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
              <option value="Académico">Académico</option>
              <option value="Deporte">Deporte</option>
              <option value="Salud">Salud</option>
              <option value="Productividad">Productividad</option>
              <option value="Personal">Personal</option>
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

          {error && <div className="createReto-error">{error}</div>}
          {success && <div className="createReto-success">{success}</div>}

          <div className="createReto-actions">
            <button
              type="button"
              className="createReto-cancelBtn"
              onClick={() => navigate(`/retos/${id}`)}
            >
              Cancelar
            </button>

            <button className="createReto-btn" type="submit">
              Guardar cambios
            </button>
          </div>
        </form>
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
