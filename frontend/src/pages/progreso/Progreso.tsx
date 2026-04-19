import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Flame,
  TrendingUp,
} from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import { getMyParticipations } from "../../services/participationApi";
import { getMyProgressByChallenge } from "../../services/progressApi";
import { getRetoById } from "../../services/challengeApi";
import "./progreso.css";

type Reto = {
  id: string;
  title: string;
  description?: string | null;
  start_date: string;
  end_date: string;
  status?: string;
};

type ProgressItem = {
  id: string;
  challenge_id: string;
  user_id: string;
  progress_date: string;
  description: string;
  created_at: string;
};

type ParticipationItem = {
  id: string;
  challenge_id: string;
  user_id: string;
  joined_at: string;
  status: string;
};

const WEEK_DAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const MONTHS_ES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

function toDateKey(dateInput: string | Date) {
  const date = new Date(dateInput);
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDate(dateInput: string | Date) {
  return new Date(dateInput).toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function formatShortDate(dateInput: string | Date) {
  return new Date(dateInput).toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function getInclusiveDays(start: string, end: string) {
  const startDate = new Date(start);
  const endDate = new Date(end);

  const diff =
    Math.round(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    ) + 1;

  return diff > 0 ? diff : 0;
}

function calculateStreak(progressList: ProgressItem[]) {
  if (progressList.length === 0) return 0;

  const uniqueKeys = Array.from(
    new Set(progressList.map((item) => toDateKey(item.progress_date)))
  ).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  const today = new Date();
  const todayKey = toDateKey(today);

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = toDateKey(yesterday);

  if (uniqueKeys[0] !== todayKey && uniqueKeys[0] !== yesterdayKey) {
    return 0;
  }

  let streak = 1;
  let current = new Date(uniqueKeys[0]);

  for (let i = 1; i < uniqueKeys.length; i++) {
    const previousDay = new Date(current);
    previousDay.setDate(previousDay.getDate() - 1);

    if (toDateKey(previousDay) === uniqueKeys[i]) {
      streak++;
      current = new Date(uniqueKeys[i]);
    } else {
      break;
    }
  }

  return streak;
}

export default function Progreso() {
  const [retos, setRetos] = useState<Reto[]>([]);
  const [selectedReto, setSelectedReto] = useState("");
  const [retoInfo, setRetoInfo] = useState<Reto | null>(null);
  const [progressList, setProgressList] = useState<ProgressItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);

  useEffect(() => {
    const fetchRetos = async () => {
      try {
        setLoading(true);
        setErrorMessage(null);

        const participations = (await getMyParticipations()) as ParticipationItem[];

        const activeParticipations = participations.filter(
          (item) => item.status === "active"
        );

        const retosData = await Promise.all(
          activeParticipations.map(async (item) => {
            const reto = await getRetoById(item.challenge_id);
            return reto as Reto;
          })
        );

        setRetos(retosData);

        if (retosData.length > 0) {
          setSelectedReto(retosData[0].id);
        }
      } catch (error) {
        console.error("Error cargando retos:", error);
        setErrorMessage("No se pudieron cargar tus retos.");
      } finally {
        setLoading(false);
      }
    };

    fetchRetos();
  }, []);

  useEffect(() => {
    const fetchSelectedRetoData = async () => {
      if (!selectedReto) {
        setRetoInfo(null);
        setProgressList([]);
        return;
      }

      try {
        setLoading(true);
        setErrorMessage(null);

        const [reto, progress] = await Promise.all([
          getRetoById(selectedReto),
          getMyProgressByChallenge(selectedReto),
        ]);

        setRetoInfo(reto as Reto);
        setProgressList((progress as ProgressItem[]) || []);

        const retoStart = new Date((reto as Reto).start_date);
        setCurrentMonth(new Date(retoStart.getFullYear(), retoStart.getMonth(), 1));
      } catch (error) {
        console.error("Error cargando información del reto:", error);
        setErrorMessage("No se pudo cargar la información del progreso.");
      } finally {
        setLoading(false);
      }
    };

    fetchSelectedRetoData();
  }, [selectedReto]);

  const progressMap = useMemo(() => {
    const map = new Map<string, ProgressItem>();

    [...progressList]
      .sort(
        (a, b) =>
          new Date(b.progress_date).getTime() - new Date(a.progress_date).getTime()
      )
      .forEach((item) => {
        const key = toDateKey(item.progress_date);
        if (!map.has(key)) {
          map.set(key, item);
        }
      });

    return map;
  }, [progressList]);

  const sortedProgress = useMemo(() => {
    return [...progressList].sort(
      (a, b) =>
        new Date(b.progress_date).getTime() - new Date(a.progress_date).getTime()
    );
  }, [progressList]);

  const diasCompletados = progressMap.size;
  const totalDias = retoInfo
    ? getInclusiveDays(retoInfo.start_date, retoInfo.end_date)
    : 0;

  const porcentaje =
    totalDias > 0 ? Math.min(100, Math.round((diasCompletados / totalDias) * 100)) : 0;

  const racha = calculateStreak(progressList);

  const monthYearLabel = `${MONTHS_ES[currentMonth.getMonth()]} ${currentMonth.getFullYear()}`;

  const calendarCells = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const totalDaysInMonth = lastDayOfMonth.getDate();

    const jsDay = firstDayOfMonth.getDay();
    const mondayBased = jsDay === 0 ? 6 : jsDay - 1;

    const cells: Array<{
      date: Date | null;
      key: string;
      isCurrentMonth: boolean;
    }> = [];

    for (let i = 0; i < mondayBased; i++) {
      cells.push({
        date: null,
        key: `empty-start-${i}`,
        isCurrentMonth: false,
      });
    }

    for (let day = 1; day <= totalDaysInMonth; day++) {
      const date = new Date(year, month, day);
      cells.push({
        date,
        key: toDateKey(date),
        isCurrentMonth: true,
      });
    }

    while (cells.length % 7 !== 0) {
      const index = cells.length;
      cells.push({
        date: null,
        key: `empty-end-${index}`,
        isCurrentMonth: false,
      });
    }

    return cells;
  }, [currentMonth]);

  const selectedProgress = selectedDateKey
    ? progressMap.get(selectedDateKey) || null
    : null;

  const handlePrevMonth = () => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );
  };

  const handleSelectReto = (retoId: string) => {
    setSelectedReto(retoId);
    setSelectedDateKey(null);
  };

  return (
    <div className="app-shell">
      <Navbar />

      <main className="progresoPage">
        <section className="progresoHero">
          <h1 className="progresoTitle">Registro de progreso</h1>
          <p className="progresoSubtitle">
            Mantén el seguimiento de tus actividades diarias y visualiza tu avance.
          </p>
        </section>

        {errorMessage && <div className="progresoAlert">{errorMessage}</div>}

        <section className="progresoCard">
          <label className="progresoLabel">Selecciona un reto</label>

          <select
            className="progresoSelect"
            value={selectedReto}
            onChange={(e) => handleSelectReto(e.target.value)}
            disabled={loading || retos.length === 0}
          >
            {retos.length === 0 ? (
              <option value="">No tienes retos inscritos</option>
            ) : (
              retos.map((reto) => (
                <option key={reto.id} value={reto.id}>
                  {reto.title}
                </option>
              ))
            )}
          </select>
        </section>

        <section className="progresoStats">
          <article className="progresoStatCard">
            <div className="progresoStatTop">
              <span className="progresoStatLabel">Días completados</span>
              <CheckCircle2 size={18} />
            </div>
            <div className="progresoStatValue">{diasCompletados}</div>
            <p className="progresoStatText">
              {diasCompletados === 0
                ? "Aún no has registrado avances"
                : `${diasCompletados} registro${diasCompletados === 1 ? "" : "s"} realizado${diasCompletados === 1 ? "" : "s"}`}
            </p>
          </article>

          <article className="progresoStatCard">
            <div className="progresoStatTop">
              <span className="progresoStatLabel">Progreso</span>
              <TrendingUp size={18} />
            </div>
            <div className="progresoStatValue">{porcentaje}%</div>
            <div className="progresoBar">
              <div
                className="progresoBarFill"
                style={{ width: `${porcentaje}%` }}
              />
            </div>
            <p className="progresoStatText">
              {totalDias > 0
                ? `${diasCompletados} de ${totalDias} días del reto`
                : "Sin duración disponible"}
            </p>
          </article>

          <article className="progresoStatCard">
            <div className="progresoStatTop">
              <span className="progresoStatLabel">Racha actual</span>
              <Flame size={18} />
            </div>
            <div className="progresoStatValue">{racha} día{racha === 1 ? "" : "s"}</div>
            <p className="progresoStatText">
              {racha === 0 ? "Empieza hoy tu constancia" : "Sigue así, vas muy bien"}
            </p>
          </article>
        </section>

        {retoInfo && (
          <section className="progresoChallengeCard">
            <div className="progresoChallengeHeader">
              <div>
                <h2 className="progresoChallengeTitle">{retoInfo.title}</h2>
                <p className="progresoChallengeText">
                  {retoInfo.description || "Este reto no tiene descripción."}
                </p>
              </div>

              <span className="progresoStatusChip">
                {retoInfo.status === "active"
                  ? "Activo"
                  : retoInfo.status === "finished"
                  ? "Finalizado"
                  : retoInfo.status === "cancelled"
                  ? "Cancelado"
                  : retoInfo.status || "Sin estado"}
              </span>
            </div>

            <div className="progresoChallengeMeta">
              <span>
                <CalendarDays size={16} />
                Inicio: {formatShortDate(retoInfo.start_date)}
              </span>
              <span>Fin: {formatShortDate(retoInfo.end_date)}</span>
              <span>Duración: {totalDias} días</span>
            </div>
          </section>
        )}

        <section className="progresoGrid">
          <section className="progresoCard progresoCalendarCard">
            <div className="progresoCalendarTop">
              <h2 className="progresoSectionTitle">Calendario de progreso</h2>

              <div className="progresoCalendarNav">
                <button
                  type="button"
                  className="progresoMonthBtn"
                  onClick={handlePrevMonth}
                >
                  <ChevronLeft size={18} />
                </button>

                <span className="progresoMonthLabel">{monthYearLabel}</span>

                <button
                  type="button"
                  className="progresoMonthBtn"
                  onClick={handleNextMonth}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

            <div className="progresoWeekDays">
              {WEEK_DAYS.map((day) => (
                <div key={day} className="progresoWeekDay">
                  {day}
                </div>
              ))}
            </div>

            <div className="progresoCalendar">
              {calendarCells.map((cell) => {
                if (!cell.date) {
                  return <div key={cell.key} className="progresoDay progresoDayEmpty" />;
                }

                const key = toDateKey(cell.date);
                const progress = progressMap.get(key);
                const isActive = Boolean(progress);
                const isSelected = selectedDateKey === key;
                const today = toDateKey(new Date()) === key;

                return (
                  <button
                    key={cell.key}
                    type="button"
                    className={`progresoDay ${
                      isActive ? "progresoDayActive" : ""
                    } ${isSelected ? "progresoDaySelected" : ""} ${
                      today ? "progresoDayToday" : ""
                    }`}
                    onClick={() => setSelectedDateKey(key)}
                    title={isActive ? "Ver progreso registrado" : "Sin progreso"}
                  >
                    <span className="progresoDayNumber">{cell.date.getDate()}</span>
                    {isActive && <span className="progresoDayDot" />}
                  </button>
                );
              })}
            </div>

            <div className="progresoLegend">
              <span className="progresoLegendItem">
                <span className="progresoLegendBox" />
                Sin registro
              </span>
              <span className="progresoLegendItem">
                <span className="progresoLegendBox progresoLegendBoxActive" />
                Con progreso
              </span>
            </div>
          </section>

          <section className="progresoSideColumn">
            <section className="progresoCard">
              <h2 className="progresoSectionTitle">Detalle del día</h2>

              {selectedProgress ? (
                <div className="progresoDetailCard">
                  <span className="progresoDetailDate">
                    {formatDate(selectedProgress.progress_date)}
                  </span>
                  <p className="progresoDetailText">{selectedProgress.description}</p>
                </div>
              ) : (
                <div className="progresoEmptyBox">
                  Selecciona un día con progreso para ver la nota registrada.
                </div>
              )}
            </section>

            <section className="progresoCard">
              <h2 className="progresoSectionTitle">Actividad reciente</h2>

              {sortedProgress.length === 0 ? (
                <div className="progresoEmptyBox">
                  Aún no hay actividad registrada en este reto.
                </div>
              ) : (
                <div className="progresoRecentList">
                  {sortedProgress.slice(0, 5).map((item) => (
                    <article
                      key={item.id}
                      className="progresoRecentItem"
                      onClick={() => setSelectedDateKey(toDateKey(item.progress_date))}
                    >
                      <div className="progresoRecentTop">
                        <span className="progresoRecentDate">
                          {formatShortDate(item.progress_date)}
                        </span>
                      </div>
                      <p className="progresoRecentText">{item.description}</p>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </section>
        </section>
      </main>
    </div>
  );
}