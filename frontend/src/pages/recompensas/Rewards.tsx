import { useEffect, useState } from "react";
import Navbar from "../../components/layout/Navbar";

import {
    Trophy,
    Star,
    Target,
} from "lucide-react";

import { getMyRewards } from "../../services/participationApi";

import "./rewards.css";

type RewardsData = {
    total_points: number;
    completed_challenges: number;
    badges: string[];
};

type LockedBadge = {
    title: string;
    description: string;
    requirement: string;
    icon: string;
};

export default function Rewards() {
    const [rewards, setRewards] =
        useState<RewardsData>({
            total_points: 0,
            completed_challenges: 0,
            badges: [],
        });

    const [loading, setLoading] =
        useState(true);

    const lockedBadges: LockedBadge[] = [
        {
            title: "Constante",
            description:
                "Mantén una racha de 7 días",
            requirement:
                "Completa progreso por 7 días",
            icon: "🔥",
        },

        {
            title: "Maestro",
            description: "Completa 10 retos",
            requirement: "Completa 10 retos",
            icon: "👑",
        },

        {
            title: "Leyenda",
            description: "Alcanza 500 puntos",
            requirement: "Obtén 500 puntos",
            icon: "💎",
        },
    ];

    useEffect(() => {
        loadRewards();
    }, []);

    const loadRewards = async () => {
        try {
            setLoading(true);

            const data = await getMyRewards();

            // Badge demo automática
            if (
                data.completed_challenges >= 1 &&
                !data.badges.includes(
                    "Primer reto completado"
                )
            ) {
                data.badges.push(
                    "Primer reto completado"
                );
            }

            setRewards(data);
        } catch (error) {
            console.error(
                "Error cargando recompensas:",
                error
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="app-shell">
            <Navbar />

            <main className="rewards-page">
                <section className="rewards-hero">
                    <div>
                        <h1 className="rewards-title">
                            Recompensas e insignias
                        </h1>

                        <p className="rewards-subtitle">
                            Consulta tus logros y progreso
                            dentro de MetaTrack.
                        </p>
                    </div>
                </section>

                {loading ? (
                    <div className="rewards-loading">
                        Cargando recompensas...
                    </div>
                ) : (
                    <>
                        <section className="rewards-summary-grid">
                            <div className="reward-card">
                                <div className="reward-icon gold">
                                    <Star size={26} />
                                </div>

                                <h3>
                                    {rewards.total_points}
                                </h3>

                                <p>Puntos acumulados</p>
                            </div>

                            <div className="reward-card">
                                <div className="reward-icon green">
                                    <Target size={26} />
                                </div>

                                <h3>
                                    {
                                        rewards.completed_challenges
                                    }
                                </h3>

                                <p>Retos completados</p>
                            </div>

                            <div className="reward-card">
                                <div className="reward-icon blue">
                                    <Trophy size={26} />
                                </div>

                                <h3>
                                    {rewards.badges.length}
                                </h3>

                                <p>Insignias obtenidas</p>
                            </div>
                        </section>

                        <section className="rewards-card">
                            <div className="rewards-card-header">
                                <h2>Tus insignias</h2>
                            </div>

                            {rewards.badges.length >
                                0 ? (
                                <div className="badges-grid">
                                    {rewards.badges.map(
                                        (badge, index) => (
                                            <div
                                                className="badge-card"
                                                key={index}
                                            >
                                                <div className="badge-emoji">
                                                    🏆
                                                </div>

                                                <h3>{badge}</h3>

                                                <p>
                                                    Insignia obtenida
                                                    por tu progreso en
                                                    la plataforma.
                                                </p>
                                            </div>
                                        )
                                    )}
                                </div>
                            ) : (
                                <div className="rewards-empty">
                                    Aún no tienes
                                    insignias disponibles.
                                </div>
                            )}
                        </section>

                        <section className="rewards-card">
                            <div className="rewards-card-header">
                                <h2>
                                    Insignias por desbloquear
                                </h2>
                            </div>

                            <div className="badges-grid">
                                {lockedBadges.map(
                                    (badge, index) => (
                                        <div
                                            className="badge-card locked"
                                            key={index}
                                        >
                                            <div className="badge-emoji locked-emoji">
                                                {badge.icon}
                                            </div>

                                            <h3>{badge.title}</h3>

                                            <p>
                                                {badge.description}
                                            </p>

                                            <div className="badge-requirement">
                                                🔒{" "}
                                                {badge.requirement}
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                        </section>
                    </>
                )}
            </main>
        </div>
    );
}