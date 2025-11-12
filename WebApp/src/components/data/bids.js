// src/data/bids.js
const now = Date.now();
const H = 3600 * 1000;
const D = 24 * H;

export const bids = [
  // === Activas (1–4): pujas recientes y en curso ===
  { id: 'b001', auctionId: 1, userId: 'u101', monto: 5100, ts: now - 6*H },
  { id: 'b002', auctionId: 1, userId: 'u102', monto: 5200, ts: now - 4*H },
  { id: 'b003', auctionId: 1, userId: 'u105', monto: 5450, ts: now - 1*H },

  { id: 'b010', auctionId: 2, userId: 'u106', monto: 4300, ts: now - 5*H },
  { id: 'b011', auctionId: 2, userId: 'u101', monto: 4400, ts: now - 3*H },

  { id: 'b020', auctionId: 3, userId: 'u103', monto: 8000, ts: now - 18*H },
  { id: 'b021', auctionId: 3, userId: 'u104', monto: 8250, ts: now - 5*H },
  { id: 'b022', auctionId: 3, userId: 'u108', monto: 8400, ts: now - 2*H },

  { id: 'b030', auctionId: 4, userId: 'u101', monto: 4000, ts: now - 2*H },

  // === Próximas (5–8): normalmente sin pujas; deja 1–2 para testear ===
  { id: 'b040', auctionId: 6, userId: 'u110', monto: 10700, ts: now - 1*H }, // antes de iniciar: puedes decidir ignorar
  // (si prefieres, borra estas para que "próximas" no tengan pujas)

  // === Finalizadas (9–12): pujas históricas ===
  { id: 'b050', auctionId: 9,  userId: 'u102', monto: 3200, ts: now - 6*D },
  { id: 'b051', auctionId: 9,  userId: 'u107', monto: 3450, ts: now - 5*D },

  { id: 'b060', auctionId: 10, userId: 'u109', monto: 4600, ts: now - 2.5*D },
  { id: 'b061', auctionId: 10, userId: 'u101', monto: 4750, ts: now - 2.1*D },

  { id: 'b070', auctionId: 11, userId: 'u103', monto: 3300, ts: now - 9*D },
  { id: 'b071', auctionId: 11, userId: 'u108', monto: 3550, ts: now - 8*D },
  { id: 'b072', auctionId: 11, userId: 'u104', monto: 3600, ts: now - 7*D },

  { id: 'b080', auctionId: 12, userId: 'u102', monto: 3800, ts: now - 7*D },
  { id: 'b081', auctionId: 12, userId: 'u106', monto: 3950, ts: now - 6.5*D },
];
