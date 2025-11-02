import { estado, highestForAuction, timeLeftLabel, fmtGTQ } from "../../lib/auctions";


export default function Card({ a, allBids = [], onOpen, isFollowing, onFollow }) {
    const es   = estado(a);
    const top  = highestForAuction(a, allBids);
    const time = timeLeftLabel(a);
    const src = a.images?.[0] && a.images[0].trim() ? a.images[0] : "/images/placeholder.jpg";

    const label = es === "activa" ? "Activa"
                : es === "programada" ? "Próxima"
                : "Finalizada";

    return (
        <article className="card">
        <div className="card-media">
            <img src={src} 
                alt={`${a.marca} ${a.modelo} ${a.anio}`} 
                loading="lazy" 
            />
            <span className={`badge status ${es}`}>{label}</span>
            <span className="chip time">
            <i className="fa fa-clock-o" aria-hidden="true"/> {time}
            </span>
        </div>

        <div className="card-body">
            <h3 className="card-title">{a.titulo}</h3>
            <p className="muted small">
            {a.marca} · {a.modelo} · {a.anio} · {a.km.toLocaleString()} km · {a.transmision}
            </p>

            <div className="card-meta">
            <div className="price">
                <span className="muted mini">Puja actual</span>
                <strong>{fmtGTQ.format(top)}</strong>
            </div>

            <div className="actions">
                {onFollow && (
                <button
                    type="button"
                    className="icon-btn"
                    title={isFollowing ? "Dejar de seguir" : "Seguir"}
                    aria-pressed={!!isFollowing}
                    onClick={() => onFollow(a.id, !isFollowing)}
                >
                    <i className={`fa ${isFollowing ? "fa-star" : "fa-star-o"}`} aria-hidden="true"/>
                </button>
                )}
                <button className="btn" type="button" onClick={() => onOpen?.(a.id)}>
                Ver subasta
                </button>
            </div>
            </div>
        </div>
        </article>
    );
}
