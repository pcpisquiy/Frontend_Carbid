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
import { io } from "socket.io-client";


export default function AuctionDetail(){
    const { id } = useParams();
    const nav = useNavigate();
    const { user, isAuthenticated } = useAuth();

    const [ended, setEnded] = useState(false);
    const [winner, setWinner] = useState(null);
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

    // 🔌 WebSocket para pujas en tiempo real
        

        useEffect(() => {
        if (!id) return;
        const socket = io(import.meta.env.VITE_API_URL || "http://localhost:3001", {
            transports: ["websocket"],
        });

        // Unirse a la sala de esta subasta
        socket.emit("auction:join", { auctionId: id });

        // Al iniciar, el backend manda el detalle y las pujas existentes
        socket.on("auction:init", ({ detail, bids }) => {
            setAuction(detail);
            setLocalBids(bids.map(b => ({
            id: b.id,
            auctionId: b.auction_id,
            userId: b.user_id,
            monto: b.amount,
            ts: b.created_at
            })));
        });

        // Cada vez que hay una nueva puja
        socket.on("bid:new", (bid) => {
            setLocalBids(prev => [
            {
                id: bid.id,
                auctionId: bid.auction_id,
                userId: bid.user_id,
                monto: bid.amount,
                ts: bid.created_at
            },
            ...prev,
            ]);
            setAuction(prev =>
            prev
                ? { ...prev, priceTop: Math.max(prev.priceTop || 0, bid.amount) }
                : prev
            );
        });

        // Cuando termina la subasta
        socket.on("auction:ended", ({ auctionId, winner }) => {
            alert(`🟢 Subasta #${auctionId} finalizada. Ganador: usuario ${winner.user_id}, Q${winner.amount}`);
            setEnded(true);
        });

        return () => {
            socket.disconnect();
        };
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
    

    // Handler para poner bid 
    const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

    const onPlaceBid = async (monto) => {
    if (!auction || !isAuthenticated) return;
    try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API}/api/auctions/${auction.id}/bids`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: monto }),
        });
        if (!res.ok) {
        const err = await res.json();
        alert(err.error || "No se pudo registrar la puja");
        }
        // No necesitas actualizar manualmente, el socket emitirá 'bid:new'
    } catch (e) {
        console.error(e);
        alert("Error al enviar la puja.");
    }
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
