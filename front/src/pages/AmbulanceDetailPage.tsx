import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Package,
  Wrench,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AppLayout } from "../components/layout/AppLayout";
import { useAuth } from "../features/auth/useAuth";
import {
  getAmbulanceById,
  type Ambulance,
  type OxygenState,
} from "../features/ambulancias/ambulanceService";
import styles from "./Ambulances.module.css";

const oxygenIcons: Record<OxygenState, typeof CheckCircle2> = {
  Completo: CheckCircle2,
  Revisar: Clock3,
  Crítico: AlertTriangle,
};
const historyIcons = {
  Ingreso: CheckCircle2,
  Egreso: Clock3,
  Consumo: Package,
};

function OxygenMeter({ oxygen }: { oxygen: Ambulance["oxygen"] }) {
  const percentage = Math.round((oxygen.currentPsi / oxygen.maxPsi) * 100);
  const Icon = oxygenIcons[oxygen.state];
  const tone =
    oxygen.state === "Completo"
      ? "complete"
      : oxygen.state === "Revisar"
        ? "review"
        : "critical";
  return (
    <section
      className={`${styles.oxygenPanel} ${styles[`oxygen${tone[0].toUpperCase()}${tone.slice(1)}`]}`}
      aria-labelledby="oxygen-title"
    >
      <div className={styles.oxygenPanelHeader}>
        <div>
          <p className="eyebrow">RECURSO CRÍTICO</p>
          <h2 id="oxygen-title">Presión de oxígeno</h2>
        </div>
        <span className={styles.stateBadge}>
          <Icon size={17} aria-hidden="true" /> {oxygen.state}
        </span>
      </div>
      <div className={styles.meterLayout}>
        <div
          className={styles.meterRing}
          style={
            {
              "--oxygen-progress": `${percentage * 3.6}deg`,
            } as React.CSSProperties
          }
        >
          <div className={styles.meterInner}>
            <strong className={styles.meterValue}>{oxygen.currentPsi}</strong>
            <span>PSI</span>
          </div>
        </div>
        <div className={styles.meterInfo}>
          <span>Capacidad máxima</span>
          <strong className={styles.mono}>{oxygen.maxPsi} PSI</strong>
          <p>
            {oxygen.state === "Completo"
              ? "La unidad cuenta con presión operativa."
              : oxygen.state === "Revisar"
                ? "Programar recarga en el próximo control."
                : "Retirar de servicio y recargar de inmediato."}
          </p>
        </div>
      </div>
      <div className={styles.meterScale}>
        <span>0 PSI</span>
        <strong>{percentage}% de capacidad</strong>
        <span>{oxygen.maxPsi} PSI</span>
      </div>
    </section>
  );
}

export function AmbulanceDetailPage() {
  const { signOut } = useAuth();
  const { id } = useParams<{ id: string }>();
  const [ambulance, setAmbulance] = useState<Ambulance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    getAmbulanceById(id)
      .then(setAmbulance)
      .catch(() => setError("No pudimos encontrar esa ambulancia."))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <AppLayout onSignOut={signOut}>
      <Link className={styles.backLink} to="/ambulancias">
        <ArrowLeft size={16} aria-hidden="true" /> Volver a la flota
      </Link>
      {loading && (
        <div className={styles.feedback} role="status">
          <span className={styles.spinner} /> Cargando detalle...
        </div>
      )}
      {!loading && (error || !ambulance) && (
        <div
          className={`${styles.feedback} ${styles.feedbackError}`}
          role="alert"
        >
          <AlertTriangle size={18} /> {error || "No hay datos disponibles."}
        </div>
      )}
      {!loading && ambulance && (
        <>
          <section
            className={styles.detailHeader}
            aria-labelledby="detail-title"
          >
            <div>
              <p className="eyebrow">DETALLE DE UNIDAD</p>
              <h1 id="detail-title">{ambulance.name}</h1>
              <p>
                {ambulance.base} · {ambulance.crew}
              </p>
            </div>
            <span
              className={`${styles.status} ${styles[ambulance.status === "Disponible" ? "available" : ambulance.status === "En servicio" ? "service" : "review"]}`}
            >
              <CheckCircle2 size={15} aria-hidden="true" /> {ambulance.status}
            </span>
          </section>
          <OxygenMeter oxygen={ambulance.oxygen} />
          <section
            className={styles.historyPanel}
            aria-labelledby="history-title"
          >
            <div className={styles.panelHeading}>
              <div>
                <p className="eyebrow">TRAZABILIDAD</p>
                <h2 id="history-title">Historial reciente</h2>
              </div>
              <span className={styles.lastUpdate}>
                Actualizado {ambulance.lastCheck}
              </span>
            </div>
            <div className={styles.historyList}>
              {ambulance.history.map((item) => {
                const Icon = historyIcons[item.type];
                return (
                  <article className={styles.historyRow} key={item.id}>
                    <div className={styles.historyIcon}>
                      <Icon size={17} aria-hidden="true" />
                    </div>
                    <div>
                      <strong>{item.type}</strong>
                      <p>{item.description}</p>
                    </div>
                    <div className={styles.historyMeta}>
                      <strong className={styles.mono}>{item.date}</strong>
                      <span>{item.operator}</span>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
          <div className={styles.detailStats}>
            <div>
              <span>Estado de unidad</span>
              <strong>{ambulance.status}</strong>
            </div>
            <div>
              <span>Último control</span>
              <strong className={styles.mono}>{ambulance.lastCheck}</strong>
            </div>
            <div>
              <span>Dotación asignada</span>
              <strong>{ambulance.crew}</strong>
            </div>
          </div>
        </>
      )}
    </AppLayout>
  );
}
