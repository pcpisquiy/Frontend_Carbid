import { fmtGTQ } from "../../lib/auctions";

export default function SummaryAside({ a, top, status, time }){
    return (
        <div className="stack-3">
        <h2>Resumen</h2>
        <div className="cluster between">
            <span className="muted">Estado</span>
            <strong style={{textTransform:'capitalize'}}>{status}</strong>
        </div>
        <div className="cluster between">
            <span className="muted">Tiempo</span>
            <strong>{time}</strong>
        </div>
        <div className="cluster between">
            <span className="muted">Base</span>
            <strong>{fmtGTQ.format(a.base)}</strong>
        </div>
        <div className="cluster between">
            <span className="muted">Puja actual</span>
            <strong>{fmtGTQ.format(top)}</strong>
        </div>
        <hr className="rule" />
        <div className="stack-3">
            <div className="muted">Vehículo</div>
            <strong>{a.titulo}</strong>
            <div className="muted">{a.marca} · {a.modelo} · {a.anio}</div>
        </div>
        </div>
    );
}
