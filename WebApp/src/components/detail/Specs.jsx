import { fmtGTQ } from "../../lib/auctions";

export default function Specs({ a }){
    return (
        <section className="stack-3">
        <h2>Especificaciones</h2>
        <div className="specs">
            <div className="spec"><div className="k">Marca</div><div className="v">{a.marca}</div></div>
            <div className="spec"><div className="k">Modelo</div><div className="v">{a.modelo}</div></div>
            <div className="spec"><div className="k">Año</div><div className="v">{a.anio}</div></div>
            <div className="spec"><div className="k">Kilometraje</div><div className="v">{a.km.toLocaleString()} km</div></div>
            <div className="spec"><div className="k">Transmisión</div><div className="v">{a.transmision}</div></div>
            <div className="spec"><div className="k">Precio base</div><div className="v">{fmtGTQ.format(a.base)}</div></div>
        </div>
        {a.desc && <p className="muted">{a.desc}</p>}
        </section>
    );
}
