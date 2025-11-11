// src/lib/api.js
const API =
  (process.env.REACT_APP_API_URL || 'http://localhost:3001').replace(/\/+$/, '');


/** Obtiene filtros (marcas y años disponibles) */
export async function fetchFilters() {
  const res = await fetch(`${API}/api/search/filters`);
  if (!res.ok) throw new Error("Error al obtener filtros");
  return res.json(); // { marcas: [...], anios: [...] }
}

/** Obtiene subastas con filtros y paginación */
export async function fetchAuctions(params = {}) {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${API}/api/search/auctions?${qs}`);
  if (!res.ok) throw new Error("Error al obtener subastas");
  return res.json(); // { items, total, page, pages }
}

/** Obtiene pujas por lote de subastas (para mostrar highest) */
export async function fetchBids(auctionIds = []) {
  if (!auctionIds.length) return [];
  const qs = new URLSearchParams({ auctionIds: auctionIds.join(",") }).toString();
  const res = await fetch(`${API}/api/search/bids?${qs}`);
  if (!res.ok) throw new Error("Error al obtener pujas");
  return res.json(); // [{ auction_id, amount, ... }]
}
