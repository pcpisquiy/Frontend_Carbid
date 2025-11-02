import { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getAuctions, getBids, estado, highestForAuction, timeLeftLabel, fmtGTQ, bidsForAuction } from "../lib/auctions";
import { useAuth } from "../context/AuthContext";
import Gallery from "../components/detail/Gallery";
import Specs from "../components/detail/Specs";
import BidList from "../components/detail/BidList";
import BidForm from "../components/detail/BidForm";
import SummaryAside from "../components/detail/SummaryAside";
import "./styles/detail.css";


export default function AuctionDetail(){
    const { id } = useParams();
    const nav = useNavigate();
    const { user, isAuthenticated } = useAuth();

    const [auction, setAuction] = useState(null);
    const [allBids, setAllBids]   = useState([]);
    const [loading, setLoading]   = useState(true);

    useEffect(() => {
        let ok = true;
        // Se inicializa con el dataset dummy
        Promise.all([getAuctions(), getBids()]).then(([A, B]) => {
        if(!ok) return;
        const a = A.find(x => String(x.id) === String(id));
        setAuction(a || null);
        setAllBids(B);
        setLoading(false);
        });
        return () => { ok = false; };
    }, [id]);


     // Pujas de ESTA subasta en estado local (para “agregar” sin backend)
    const [localBids, setLocalBids] = useState([]);
    useEffect(() => {
        if (!loading && auction) {
        const base = bidsForAuction(allBids, auction.id, { desc: true });
        setLocalBids(base);
        }
    }, [loading, auction, allBids]);

    const es = useMemo(() => auction ? estado(auction) : null, [auction]);
    const top = useMemo(() => auction ? highestForAuction(auction, localBids) : 0, [auction, localBids]);
    const time = useMemo(() => auction ? timeLeftLabel(auction) : "", [auction])
    

    // Handler para poner bid (demo sin backend)
    const onPlaceBid = (monto) => {
        if (!auction || !isAuthenticated) return;
        const b = {
        id: "local-" + Date.now(),
        auctionId: auction.id,
        userId: user.username || user.email || "anon",
        monto: Number(monto),
        ts: Date.now()
        };
        setLocalBids(prev => [b, ...prev]); 
    };


    if (loading) {
        return (
        <main className="container">
            <p className="muted">Cargando subasta…</p>
        </main>
        );
    }

    if (!auction) {
        return (
        <main className="container">
            <h1>Subasta no encontrada</h1>
            <p className="muted">La subasta #{id} no existe o fue removida.</p>
            <button className="btn" onClick={() => nav(-1)}>Volver</button>
        </main>
        );
    }
    
    return (
        <main className="detail">
        <div className="detail-grid">
            {/* IZQUIERDA */}
            <section className="surface stack-4">
            <nav aria-label="breadcrumb" className="muted mini">
                <Link to="/">Inicio</Link> / <span>{auction.marca}</span> / <strong>{auction.modelo}</strong>
            </nav>

            <header className="stack-3">
                <h1 className="title">{auction.titulo}</h1>
                <div className="cluster wrap">
                <span className={`badge status ${es}`}>{es === "activa" ? "Activa" : es === "programada" ? "Próxima" : "Finalizada"}</span>
                <span className="chip soft">
                    <i className="fa fa-clock-o" aria-hidden="true"></i> {time}
                </span>
                <span className="chip soft">
                    Base: <strong>{fmtGTQ.format(auction.base)}</strong>
                </span>
                <span className="chip soft">
                    Puja actual: <strong>{fmtGTQ.format(top)}</strong>
                </span>
                </div>
            </header>

            <Gallery images={auction.images} />

            <Specs a={auction} />

            <section className="stack-3">
                <h2>Pujas</h2>
                <BidList bids={localBids} />
            </section>

            <section className="stack-3">
                <h2>Ofertar</h2>
                <BidForm
                status={es}
                current={top}
                minStep={50}
                isAuthenticated={isAuthenticated}
                onPlaceBid={onPlaceBid}
                />
            </section>
            </section>

            {/* DERECHA (sticky) */}
            <aside className="surface aside-sticky">
            <SummaryAside a={auction} top={top} status={es} time={time} />
            </aside>
        </div>
        </main>
    );
}
