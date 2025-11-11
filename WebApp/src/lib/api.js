// src/lib/api.js
const API = (import.meta.env?.VITE_API_URL || process.env.REACT_APP_API_URL || 'http://localhost:8083').replace(/\/+$/, '');

export async function fetchFilters() {
  const res = await fetch(`${API}/api/search/filters`);
  if (!res.ok) throw new Error("Error al obtener filtros");
  return res.json();
}

export async function fetchAuctions(params = {}) {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${API}/api/search/auctions?${qs}`);
  if (!res.ok) throw new Error("Error al obtener subastas");
  return res.json();
}

export async function fetchBids(auctionIds = []) {
  if (!auctionIds.length) return [];
  const qs = new URLSearchParams({ auctionIds: auctionIds.join(",") }).toString();
  const res = await fetch(`${API}/api/search/bids?${qs}`);
  if (!res.ok) throw new Error("Error al obtener pujas");
  return res.json();
}
