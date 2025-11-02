import { useState } from "react";
import { fmtGTQ } from "../../lib/auctions";
import { Link, useLocation } from "react-router-dom";

export default function BidForm({ status, current, minStep = 50, isAuthenticated, onPlaceBid }){
    const [val, setVal] = useState(current ? current + minStep : minStep);
    const loc = useLocation();

    const disabled = status !== "activa";

    const onSubmit = (e) => {
        e.preventDefault();
        if (disabled) { alert("La subasta no está activa."); return; }
        const n = Number(val);
        if (!Number.isFinite(n)) { alert("Monto inválido."); return; }
        if (n <= current) { alert(`La oferta debe ser mayor a ${fmtGTQ.format(current)}.`); return; }
        onPlaceBid?.(n);
    };

    if (!isAuthenticated) {
        return (
        <div className="stack-3">
            <p className="muted">Debes iniciar sesión para pujar.</p>
            <Link className="btn primary" to="/login" state={{ from: loc.pathname }}>Iniciar sesión</Link>
        </div>
        );
    }

    return (
        <form className="bidform stack-3" onSubmit={onSubmit}>
        <div className="row">
            <div className="input-wrap">
            <i className="fa fa-GTQ" aria-hidden="true"></i>
            <input
                type="number"
                min={current + 1}
                step={minStep}
                value={val}
                onChange={(e)=>setVal(e.target.value)}
                disabled={disabled}
            />
            </div>
            <button className="btn primary" type="submit" disabled={disabled}>
            Ofertar
            </button>
        </div>
        <p className="muted mini">Mínimo: {fmtGTQ.format(current + 1)} · Paso sugerido: {fmtGTQ.format(minStep)}</p>
        </form>
    );
}
