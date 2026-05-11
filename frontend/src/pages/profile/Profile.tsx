import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import { getMyParticipations } from "../../services/participationApi";
import { getRetos } from "../../services/challengeApi";
import {
    getProgressSummary,
    type ProgressSummary,
} from "../../services/progressApi";
import "./profile.css";

type UserInfo = {
    name: string;
    email: string;
};

type Participation = {
    challenge_id: string;
    status: "active" | "abandoned" | "completed";
};

type Challenge = {
    id: string;
    title: string;
    description?: string;
    type?: string;
    start_date?: string;
    end_date?: string;
    status?: "active" | "finished" | "cancelled";
};

function getUserInfoFromStorage(): UserInfo {
    const name = localStorage.getItem("name") || "Usuario";
    const email = localStorage.getItem("email") || "No disponible";

    return { name, email };
}

const formatDate = (dateString?: string) => {
    if (!dateString) return "";

    const date = new Date(dateString);

    return date.toLocaleDateString("es-CO", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

export default function Profile() {
    const navigate = useNavigate();

    const [userInfo, setUserInfo] = useState<UserInfo>({
        name: "",
        email: "",
    });

    const [myChallenges, setMyChallenges] = useState<Challenge[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [progressSummary, setProgressSummary] =
        useState<ProgressSummary | null>(null);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            setLoading(true);
            setError(null);

            const user = getUserInfoFromStorage();
            setUserInfo(user);

            const participationsData = await getMyParticipations();
            const retosData = await getRetos();

            const summaryData = await getProgressSummary();
            setProgressSummary(summaryData);

            const participations: Participation[] = Array.isArray(participationsData)
                ? participationsData
                : participationsData?.participations || [];

            const retos: Challenge[] = Array.isArray(retosData)
                ? retosData
                : retosData?.retos || [];

            const activeParticipations = participations.filter(
                (p) => p.status === "active"
            );

            const activeIds = activeParticipations.map((p) => p.challenge_id);

            const activeChallenges = retos.filter((r) =>
                activeIds.includes(r.id)
            );

            setMyChallenges(activeChallenges);
        } catch (err) {
            console.error(err);
            setError("No se pudo cargar el perfil");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="app-shell">
            <Navbar />

            <div className="profile-page">
                <div className="profile-top">
                    <div>
                        <h1 className="profile-h1">Mi perfil</h1>

                        <p className="profile-sub">
                            Consulta tu información y los retos en los que participas.
                        </p>
                    </div>
                </div>

                {loading && (
                    <p className="profile-message">
                        Cargando perfil...
                    </p>
                )}

                {error && (
                    <p className="profile-error">
                        {error}
                    </p>
                )}

                {!loading && !error && (
                    <>
                        <div className="profile-hero">
                            <div className="profile-hero-avatar">
                                {userInfo.name.charAt(0).toUpperCase()}
                            </div>

                            <div className="profile-hero-text">
                                <h2>{userInfo.name}</h2>
                                <p>{userInfo.email}</p>
                            </div>
                        </div>

                        <div className="profile-card">
                            <h2 className="profile-card-title">
                                Información básica
                            </h2>

                            <div className="profile-info-grid">
                                <div className="profile-info-item">
                                    <span className="profile-label">
                                        Nombre
                                    </span>

                                    <p>{userInfo.name}</p>
                                </div>

                                <div className="profile-info-item">
                                    <span className="profile-label">
                                        Correo
                                    </span>

                                    <p>{userInfo.email}</p>
                                </div>

                                <div className="profile-info-item">
                                    <span className="profile-label">
                                        Retos activos
                                    </span>

                                    <p>
                                        {progressSummary?.active_challenges ?? 0}
                                    </p>
                                </div>

                                <div className="profile-info-item">
                                    <span className="profile-label">
                                        Retos finalizados
                                    </span>

                                    <p>
                                        {progressSummary?.completed_challenges ?? 0}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="profile-card">
                            <h2 className="profile-card-title">
                                Mis retos
                            </h2>

                            {myChallenges.length > 0 ? (
                                <div className="profile-retos-grid">
                                    {myChallenges
                                        .slice()
                                        .sort((a, b) => {
                                            if (
                                                a.status === "active" &&
                                                b.status !== "active"
                                            )
                                                return -1;

                                            if (
                                                a.status !== "active" &&
                                                b.status === "active"
                                            )
                                                return 1;

                                            return 0;
                                        })
                                        .map((challenge) => (
                                            <div
                                                className="profile-reto-card"
                                                key={challenge.id}
                                            >
                                                <div className="profile-reto-header">
                                                    <h3>{challenge.title}</h3>

                                                    <div className="profile-reto-chips">
                                                        {challenge.type && (
                                                            <span className="profile-chip">
                                                                {challenge.type}
                                                            </span>
                                                        )}

                                                        <span
                                                            className={`profile-status-chip ${challenge.status === "finished"
                                                                    ? "finished"
                                                                    : challenge.status === "cancelled"
                                                                        ? "cancelled"
                                                                        : "active"
                                                                }`}
                                                        >
                                                            {challenge.status === "finished"
                                                                ? "Finalizado"
                                                                : challenge.status === "cancelled"
                                                                    ? "Cancelado"
                                                                    : "Activo"}
                                                        </span>
                                                    </div>
                                                </div>

                                                <p className="profile-reto-description">
                                                    {challenge.description ||
                                                        "Este reto no tiene descripción."}
                                                </p>

                                                <div className="profile-reto-dates">
                                                    {challenge.start_date && (
                                                        <span>
                                                            Inicio: {formatDate(challenge.start_date)}
                                                        </span>
                                                    )}

                                                    {challenge.end_date && (
                                                        <span>
                                                            Fin: {formatDate(challenge.end_date)}
                                                        </span>
                                                    )}
                                                </div>

                                                <button
                                                    className="profile-view-btn"
                                                    onClick={() =>
                                                        navigate(`/retos/${challenge.id}`)
                                                    }
                                                >
                                                    Ver reto
                                                </button>
                                            </div>
                                        ))}
                                </div>
                            ) : (
                                <p className="profile-empty">
                                    No participas en ningún reto actualmente.
                                </p>
                            )}
                        </div>

                        <div className="profile-card">
                            <h2 className="profile-card-title">
                                Progreso reciente
                            </h2>

                            {progressSummary?.recent_progress?.length ? (
                                <div className="profile-progress-list">
                                    {progressSummary.recent_progress.map((item) => (
                                        <div
                                            key={item.id}
                                            className="profile-progress-item"
                                        >
                                            <div className="profile-progress-date">
                                                {formatDate(item.progress_date)}
                                            </div>

                                            <p className="profile-progress-text">
                                                {item.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="profile-empty">
                                    {progressSummary?.message ||
                                        "Aún no has registrado progreso"}
                                </p>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}