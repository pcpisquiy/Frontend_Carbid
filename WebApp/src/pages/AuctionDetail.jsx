/* Patched AuctionDetail.jsx - removes local bid insertion and supports Usuario field */

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./styles/detail.css";
import Gallery from "../components/detail/Gallery";
import Specs from "../components/detail/Specs";
import BidList from "../components/detail/BidList";
import BidForm from "../components/detail/BidForm";
import SummaryAside from "../components/detail/SummaryAside";
import { estado, highestForAuction, timeLeftLabel } from "../lib/auctions";
import { useAuth } from "../context/AuthContext";
import { io } from "socket.io-client";

const API = (process.env.REACT_APP_API_URL || "").replace(/\/+$/, "");

function mapDetail(d) {
  return {
    id: d.id,
    titulo: d.titulo,
    marca: d.marca,
    modelo: d.modelo,
    anio: d.anio,
    transmision: d.transmision,
    km: d.km || 0,
    startAt: d.startAt,
    endAt: d.endAt,
    base: Number(d.priceBase ?? 0) || 0,
    priceTop: Number(d.priceTop ?? d.priceBase ?? 0) || 0,
    images: (d.images || []).map((u) =>
      u && u.startsWith("/uploads/") ? `${API}${u}` : u
    ),
    desc: d.desc || "",
  };
}

function mapBid(b, fallbackAuctionId) {
  return {
    id: b.id,
    auctionId: b.auction_id ?? b.auctionId ?? fallbackAuctionId,
    monto: Number(b.amount ?? b.monto ?? 0) || 0,
    ts: b.created_at ?? b.ts ?? Date.now(),
    userId: b.user_id ?? b.userId ?? null,
    usuario: b.Usuario ?? b.usuario ?? b.user ?? "Usuario",
  };
}

export default function AuctionDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const { authFetch, user } = useAuth();

  const [auction, setAuction] = useState(null);
  const [bids, setBids] = useState([]);
  const [status, setStatus] = useState("loading");
  const [err, setErr] = useState("");

  const auctionId = Number(id);

  useEffect(() => {
    if (!auctionId) return;
    setStatus("loading");
    setErr("");

    let active = true;

    authFetch(`${API}/api/bids/auctions/${auctionId}`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((detail) => {
        if (!active || !detail) return;
        setAuction(mapDetail(detail));
      })
      .catch(() => {})
      .finally(() => {
        if (active) setStatus("ready");
      });

    const socket = io(API, { transports: ["websocket"] });
    socket.emit("auction:join", { auctionId });

    socket.on("auction:init", ({ detail, bids: bs }) => {
      if (!active) return;
      if (detail) setAuction(mapDetail(detail));
      if (Array.isArray(bs)) {
        setBids(bs.map((b) => mapBid(b, auctionId)));
      }
    });

    socket.on("bid:new", (b) => {
      if (!active) return;
      setBids((prev) => [...prev, mapBid(b, auctionId)]);
    });

    socket.on("auction:ended", ({ auctionId: ended }) => {
      if (!active) return;
      if (ended === auctionId) {
        setAuction((a) => (a ? { ...a, estado: "finalizada" } : a));
      }
    });

    return () => {
      active = false;
      socket.close();
    };
  }, [auctionId, authFetch]);

  const es = auction ? estado(auction) : "programada";
  const top = auction ? highestForAuction(auction, bids) : 0;
  const time = auction ? timeLeftLabel(auction) : "";

  const onPlaceBid = async (amount) => {
    if (!auctionId) return;
    try {
      const res = await authFetch(`${API}/api/bids/auctions/${auctionId}/bids`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e.error || "No se pudo registrar la puja");
      }
      const bid = await res.json();

      // ❌ Antes se insertaba local
      // setBids((prev) => [...prev, mapBid(bid, auctionId)]);
      // ✔️ Ahora solo se espera "bid:new" desde el servidor
    } catch (e) {
      alert(e.message || "Error al ofertar");
    }
  };

  if (!auctionId) return <p>Subasta inválida.</p>;
  if (status === "loading" && !auction) return <p>Cargando subasta...</p>;
  if (err) return <p style={{ color: "tomato" }}>❌ {err}</p>;
  if (!auction) return <p>Subasta no encontrada.</p>;

  return (
    <main className="detail">
      <div className="detail-grid">
        <section className="surface stack-4">
          <div className="stack-2">
            <button className="link" type="button" onClick={() => nav("/")}>
              ← Volver al inicio
            </button>
            <h1 className="title">{auction.titulo}</h1>
            <div className="cluster wrap">
              <span className="badge">{auction.marca}</span>
              <span className="badge">
                {auction.modelo} · {auction.anio}
              </span>
              <span className="badge small">{auction.transmision}</span>
            </div>
          </div>

          <Gallery images={auction.images} />
          <Specs a={auction} />

          <section className="stack-3">
            <h2>Pujas</h2>
            <BidList bids={bids} />
          </section>

          <BidForm
            status={es}
            current={top}
            minStep={50}
            isAuthenticated={!!user}
            onPlaceBid={onPlaceBid}
          />
        </section>

        <aside className="surface aside-sticky">
          <SummaryAside a={auction} top={top} status={es} time={time} />
        </aside>
      </div>
    </main>
  );
}
