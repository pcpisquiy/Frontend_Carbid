import { Link, useNavigate } from "react-router-dom";
import "./styles/home.css";
import { useEffect, useMemo, useState } from "react";
import Filters from "../components/home/Filters";
import CardsGrid from "../components/home/CardsGrid";
import Pagination from "../components/home/Pagination";
import { fetchFilters, fetchAuctions, fetchBids } from "../lib/api"; 

export default function Home() {
  const nav = useNavigate();

  const [auctions, setAuctions] = useState([]);
  const [bids, setBids] = useState([]);
  const [filters, setFilters] = useState({
    marca: "", anio: "", min: "", max: "", estado: "", orden: "cierre", q: "",
  });
  const [options, setOptions] = useState({ marcas: [], anios: [] });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const pageSize = 8;

  // 🚀 1) Cargar opciones de filtros (marcas, años)
  useEffect(() => {
    fetchFilters().then(setOptions).catch(console.error);
  }, []);

  // 🚀 2) Cargar subastas reales cada vez que cambian filtros/página
  useEffect(() => {
    setLoading(true);
    const params = {
      q: filters.q,
      marcaId: filters.marca, // si backend espera ID, usar Id aquí
      anio: filters.anio,
      min: filters.min,
      max: filters.max,
      estado: filters.estado,
      orden: filters.orden,
      page,
      pageSize,
    };

    fetchAuctions(params)
      .then(async (data) => {
        setAuctions(data.items || []);
        setPages(data.pages || 1);

        // cargar pujas de estas subastas (para current highest)
        const ids = (data.items || []).map((x) => x.id);
        const bidsData = await fetchBids(ids);
        setBids(bidsData);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [filters, page]);

  // 🔍 Escucha del search global del header
  useEffect(() => {
    const handler = (e) => {
      setFilters(f => ({ ...f, q: (e.detail || "").toString() }));
      setPage(1);
    };
    window.addEventListener("global-search", handler);
    return () => window.removeEventListener("global-search", handler);
  }, []);

  // Handlers
  const onChangeFilters = (next) => setFilters(f => ({ ...f, ...next }));
  const onApplyFilters  = () => setPage(1);
  const onResetFilters  = () => { 
    setFilters({ marca:"", anio:"", min:"", max:"", estado:"", orden:"cierre", q:"" });
    setPage(1);
  };

  return (
    <main>
      {/* HERO igual que antes */}
      <section className="hero">
        <div className="hero_bg" role="img"></div>
        <div className="container hero_content">
          <h1 id="heroTitle">Subastas transparentes.<br />Mejores decisiones.</h1>
          <p className="hero_lead">
            Nuestra misión es conectar vendedores y compradores con información clara,
            pujas justas y tiempos definidos.
          </p>
          <div className="hero_cta">
            <a href="#explorar" className="btn primary">Explorar</a>
            <Link to="/publicar" className="btn">Publicar</Link>
          </div>
        </div>
      </section>

      <div id="explorar" className="anchor"></div>

      {/* 🔎 Filtros + Grid + Paginación */}
      <section className="home-body container">
        <Filters
          value={filters}
          onChange={onChangeFilters}
          onApply={onApplyFilters}
          onReset={onResetFilters}
          options={options}
        />
        {loading ? (
          <p className="muted">Cargando…</p>
        ) : (
          <CardsGrid
            items={auctions}
            allBids={bids}
            onOpen={(id) => nav(`/subasta/${id}`)}
          />
        )}
        <div style={{ marginTop: "1rem" }}>
          <Pagination page={page} pages={pages} onPageChange={setPage} />
        </div>
      </section>
    </main>
  );
}
