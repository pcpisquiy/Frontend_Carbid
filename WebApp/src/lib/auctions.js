import { auctions } from '../components/data/auctions';
import { bids } from '../components/data/bids';

/* Cargar mock  */
export function getAuctions(delay = 250){
  return new Promise(res => setTimeout(()=> res(auctions), delay));
}
export function getBids(delay = 200){
  return new Promise(res => setTimeout(()=> res(bids), delay));
}

/* Estado temporal de una subasta */
export function estado(a, now = Date.now()){
  if (now < a.startAt) return 'programada';
  if (now >= a.endAt)  return 'finalizada';
  return 'activa';
}

/* Bids de una subasta  */
export function bidsForAuction(allBids, auctionId, { desc = true } = {}){
  const arr = allBids.filter(b => String(b.auctionId) === String(auctionId));
  arr.sort((x, y) => desc ? y.ts - x.ts : x.ts - y.ts);
  return arr;
}

/* Puja más alta de una subasta */
export function highestForAuction(a, allBids){
  const bs = bidsForAuction(allBids, a.id);
  if (!bs.length) return a.base;
  let max = a.base;
  for (const b of bs) if (b.monto > max) max = b.monto;
  return max;
}

/* Tiempo restante para empezar 
    (si esta programada) o hasta cerrar 
    (si esta activa) en ms*/
export function msLeft(a, now = Date.now()){
  const st = a.startAt, en = a.endAt;
  const es = estado(a, now);
  if (es === 'programada') return Math.max(0, st - now);
  if (es === 'activa')     return Math.max(0, en - now);
  return 0; // finalizada
}

/* Tiempo restante */
export function timeLeftLabel(a, now = Date.now()){
  const es = estado(a, now);
  if (es === 'finalizada') return 'Finalizada';
  const ms = msLeft(a, now);
  const s = Math.floor(ms / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);

  if (d > 0)  return es === 'programada' ? `Empieza en ${d} d ${h} h` : `Cierra en ${d} d ${h} h`;
  if (h > 0)  return es === 'programada' ? `Empieza en ${h} h ${m} m` : `Cierra en ${h} h ${m} m`;
  if (m > 0)  return es === 'programada' ? `Empieza en ${m} m` : `Cierra en ${m} m`;
  return es === 'programada' ? 'Empieza en segundos' : 'Cierra en segundos';
}

/* Formateador de moneda  */
export const fmtGTQ = new Intl.NumberFormat('es-ES', {
  style: 'currency', currency: 'GTQ', maximumFractionDigits: 0
});

/* Agrupacion de pujas por auctionId para consultas rápidas */
export function groupBidsByAuction(allBids){
  const map = new Map();
  for (const b of allBids) {
    const key = String(b.auctionId);
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(b);
  }
  for (const [, arr] of map) arr.sort((a, b) => b.ts - a.ts);
  return map; // Map<string, Bid[]>
}
