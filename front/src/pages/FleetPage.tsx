import {
  AlertTriangle,
  Ambulance,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  MapPin,
  Wrench,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../features/auth/useAuth";
import {
  getAmbulances,
  type Ambulance as AmbulanceData,
} from "../features/ambulancias/ambulanceService";
import { AppLayout } from "../components/layout/AppLayout";
import styles from "./Ambulances.module.css";

const statusIcons = {
  Disponible: CheckCircle2,
  "En servicio": Clock3,
  "En revisión": Wrench,
};

export function FleetPage() {
  const { signOut } = useAuth();
  const [ambulances, setAmbulances] = useState<AmbulanceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getAmbulances()
      .then(setAmbulances)
      .catch(() => setError("No pudimos cargar la flota."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppLayout onSignOut={signOut}>
      <section className={styles.pageHeader} aria-labelledby="fleet-title">
        <div>
          <p className="eyebrow">OPERACIONES · FLOTA</p>
          <h1 id="fleet-title">Ambulancias</h1>
          <p>Estado general y disponibilidad de las unidades.</p>
        </div>
        <div className={styles.headerMetric}>
          <span>Unidades activas</span>
          <strong className={styles.mono}>04 / 04</strong>
        </div>
      </section>

      {loading && (
        <div className={styles.feedback} role="status">
          <span className={styles.spinner} /> Cargando flota...
        </div>
      )}
      {!loading && error && (
        <div
          className={`${styles.feedback} ${styles.feedbackError}`}
          role="alert"
        >
          <AlertTriangle size={18} /> {error}
        </div>
      )}
      {!loading && !error && ambulances.length === 0 && (
        <div className={styles.feedback}>No hay ambulancias registradas.</div>
      )}
      {!loading && !error && ambulances.length > 0 && (
        <section
          className={styles.fleetGrid}
          aria-label="Listado de ambulancias"
        >
          {ambulances.map((ambulance) => {
            const StatusIcon = statusIcons[ambulance.status];
            const oxygenPercentage = Math.round(
              (ambulance.oxygen.currentPsi / ambulance.oxygen.maxPsi) * 100,
            );
            return (
              <Link
                className={styles.ambulanceCard}
                to={`/ambulancias/${ambulance.id}`}
                key={ambulance.id}
              >
                <div className={styles.cardTop}>
                  <div className={styles.ambulanceName}>
                    <Ambulance size={22} aria-hidden="true" />
                    <div>
                      <strong>{ambulance.name}</strong>
                      <span>
                        <MapPin size={13} aria-hidden="true" /> {ambulance.base}
                      </span>
                    </div>
                  </div>
                  <ArrowUpRight size={18} aria-hidden="true" />
                </div>
                <div
                  className={`${styles.status} ${styles[ambulance.status === "Disponible" ? "available" : ambulance.status === "En servicio" ? "service" : "review"]}`}
                >
                  <StatusIcon size={15} aria-hidden="true" /> {ambulance.status}
                </div>
                <div className={styles.oxygenSummary}>
                  <div className={styles.summaryLabel}>
                    <span>Presión de O2</span>
                    <strong className={styles.mono}>
                      {ambulance.oxygen.currentPsi} PSI
                    </strong>
                  </div>
                  <div className={styles.progressTrack}>
                    <span
                      className={
                        styles[
                          ambulance.oxygen.state === "Completo"
                            ? "progressComplete"
                            : ambulance.oxygen.state === "Revisar"
                              ? "progressReview"
                              : "progressCritical"
                        ]
                      }
                      style={{ width: `${oxygenPercentage}%` }}
                    />
                  </div>
                  <small>
                    {ambulance.oxygen.state} · Máximo {ambulance.oxygen.maxPsi}{" "}
                    PSI
                  </small>
                </div>
                <div className={styles.cardFooter}>
                  <span>Último control</span>
                  <strong className={styles.mono}>{ambulance.lastCheck}</strong>
                </div>
              </Link>
            );
          })}
        </section>
      )}
    </AppLayout>
  );
}
