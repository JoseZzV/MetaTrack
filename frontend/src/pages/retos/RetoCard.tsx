type Reto = {
  id: string;
  title: string;
  type: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  status: "Activo" | "Finalizado" | "Borrador";
};

function formatRange(startDate: string, endDate: string) {
  // Simple y estable sin librerías
  return `${startDate} → ${endDate}`;
}

export default function RetoCard({
  reto,
  onOpen,
}: {
  reto: Reto;
  onOpen?: (id: string) => void;
}) {
  return (
    <button
      type="button"
      className="reto-card"
      onClick={() => onOpen?.(reto.id)}
    >
      <div className="reto-card__top">
        <div className="reto-card__title">{reto.title}</div>
        <span className={`reto-chip reto-chip--${reto.status.toLowerCase()}`}>
          {reto.status}
        </span>
      </div>

      <div className="reto-card__meta">
        <div className="reto-meta">
          <span className="reto-meta__label">Tipo</span>
          <span className="reto-meta__value">{reto.type}</span>
        </div>

        <div className="reto-meta">
          <span className="reto-meta__label">Duración</span>
          <span className="reto-meta__value">
            {formatRange(reto.startDate, reto.endDate)}
          </span>
        </div>
      </div>
    </button>
  );
}
