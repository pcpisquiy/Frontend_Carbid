import { Link } from "react-router-dom";
import "./styles/home.css";
import { useEffect, useMemo, useState } from "react";
import Filters from "../components/home/Filters";
import CardsGrid from "../components/home/CardsGrid";
import Pagination from "../components/home/Pagination";
import { getAuctions, getBids, estado, highestForAuction } from "../lib/auctions";
import { useNavigate } from "react-router-dom";


export default function Home() {
    const goExplore = (e) => {
        e.preventDefault();
        const el = document.getElementById("explorar");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const nav = useNavigate();

    const [all, setAll] = useState([]);
    const [allBids, setAllBids] = useState([]);
    const [loading, setLoading] = useState(true);

    const [filters, setFilters] = useState({
      marca: "", anio: "", min: "", max: "", estado: "", orden: "cierre", q: ""
    });
    const [page, setPage] = useState(1);
    const pageSize = 8;

    // Cargar mock
    useEffect(() => {
      let mounted = true;
      Promise.all([getAuctions(), getBids()]).then(([A, B]) => {
        if (!mounted) return;
        setAll(A); setAllBids(B); setLoading(false);
      });
      return () => { mounted = false; };
    }, []);
  

    // Búsqueda global (del header) -> actualiza q
    useEffect(() => {
        const handler = (e) => {
        setFilters(f => ({ ...f, q: (e.detail || "").toString() }));
        setPage(1);
        };
        window.addEventListener("global-search", handler);
        return () => window.removeEventListener("global-search", handler);
    }, []);

    // Opciones para selects (marcas, años) – derivadas del dataset
    const options = useMemo(() => {
        const marcas = Array.from(new Set(all.map(a => a.marca))).sort();
        const anios  = Array.from(new Set(all.map(a => a.anio))).sort((x, y) => y - x);
        return { marcas, anios };
    }, [all]);


    // Filtro + orden + paginación (versión simple para esqueleto)
    const filtered = useMemo(() => {
        const q = filters.q.trim().toLowerCase();
        const min = Number(filters.min || 0);
        const max = Number(filters.max || 0);

        let list = all.filter(a => {
        if (filters.marca && a.marca !== filters.marca) return false;
        if (filters.anio && a.anio !== Number(filters.anio)) return false;
        if (filters.estado && estado(a) !== filters.estado) return false;
        if (q) {
            const hay = `${a.titulo} ${a.marca} ${a.modelo} ${a.anio}`.toLowerCase();
            if (!hay.includes(q)) return false;
        }
        // precio min/max con puja más alta (o base)
        const top = highestForAuction(a, allBids);
        if (min && top < min) return false;
        if (max && top > max) return false;
        return true;
        });
        
        // orden
        if (filters.orden === "cierre") {
        list.sort((a, b) => a.endAt - b.endAt);
        } else if (filters.orden === "puja") {
        list.sort((a, b) => highestForAuction(b, allBids) - highestForAuction(a, allBids));
        } else {
        // "reciente": por startAt desc
        list.sort((a, b) => b.startAt - a.startAt);
        }
        return list;
    }, [all, allBids, filters]);


    const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
    const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

    const onChangeFilters = (next) => { setFilters(f => ({ ...f, ...next })); };
    const onApplyFilters  = () => setPage(1);
    const onResetFilters  = () => { setFilters({ marca:"", anio:"", min:"", max:"", estado:"", orden:"cierre", q:"" }); setPage(1); };


    return (
        <main>
            <section className="hero">
                <div className="hero_bg" role="img"></div>
                <div className="container hero_content">
                    <h1 id="heroTitle">
                        Subastas transparentes.<br/>Mejores decisiones.
                    </h1>
                    <p className="hero_lead">
                    Nuestra misión es conectar vendedores y compradores con información clara,
                    pujas justas y tiempos definidos. Sin letras pequeñas, sin sorpresas.
                    </p>
                    <div className="hero_cta">
                        <a href="#explorar" className="btn primary" onClick={goExplore}>
                            Explorar
                        </a>
                        <Link to="/publicar" className="btn">Publicar</Link>
                    </div>
                </div>
            </section>

            <div id="explorar" className="anchor"></div>    


            <section className="home-body container">
                <Filters
                    value={filters}
                    onChange={onChangeFilters}
                    onApply={onApplyFilters}
                    onReset={onResetFilters}
                    options={options}
                />
                {loading ? 
                    <p className="muted">Cargando…</p> : 
                    <CardsGrid 
                        items={pageItems} 
                        allBids={allBids} 
                        onOpen={(id) => nav(`/subasta/${id}`)}
                    />}
                <div style={{ marginTop: "1rem" }}>
                    <Pagination page={page} pages={pages} onPageChange={setPage} />
                </div>
            </section>
        </main>
    );

}