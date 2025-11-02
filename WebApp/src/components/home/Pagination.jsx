export default function Pagination({ page, pages, onPageChange }) {
    if (pages <= 1) return null;
    const prev = () => onPageChange(Math.max(1, page - 1));
    const next = () => onPageChange(Math.min(pages, page + 1));
    return (
        <nav className="pagination" aria-label="Paginación">
        <button className="btn" onClick={prev} disabled={page === 1}>‹ Anterior</button>
        <span> Página {page} de {pages} </span>
        <button className="btn" onClick={next} disabled={page === pages}>Siguiente ›</button>
        </nav>
    );
}