// src/lib/api.js
const rawBase = process.env.REACT_APP_API_URL;
if (!rawBase) { throw new Error("REACT_APP_API_URL no está definida. Configúrala en .env"); }
const API = String(rawBase).replace(/\/+$/, "");

// usa el fetch autenticado inyectado por el AuthProvider
const authFetch = (...args) => (window.__AUTH_FETCH__ || fetch)(...args);

export async function fetchFilters() {
  const res = await authFetch(`${API}/api/search/filters`);
  if (!res.ok) throw new Error("Error al obtener filtros");
  return res.json();
}

export async function fetchAuctions(params = {}) {
  const qs = new URLSearchParams(params).toString();
  const res = await authFetch(`${API}/api/search/auctions?${qs}`);
  if (!res.ok) throw new Error("Error al obtener subastas");
  return res.json();
}

export async function fetchBids(auctionIds = []) {
  if (!auctionIds.length) return [];
  const qs = new URLSearchParams({ auctionIds: auctionIds.join(",") }).toString();
  const res = await authFetch(`${API}/api/search/bids?${qs}`);
  if (!res.ok) throw new Error("Error al obtener pujas");
  return res.json();
}
