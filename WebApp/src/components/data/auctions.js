// src/data/auctions.js
// Modelo de Auction (sin bids):
// {
//   id: number | string,
//   ownerId: string,          // id del usuario que publicó
//   titulo: string,
//   marca: string,
//   modelo: string,
//   anio: number,
//   km: number,
//   transmision: "Automática" | "Manual" | "CVT",
//   base: number,             // USD
//   images: string[],         // URLs o rutas locales
//   startAt: number,          // timestamp (ms)
//   endAt: number,            // timestamp (ms)
//   desc: string
// }

const now = Date.now();
const H = 3600 * 1000;
const D = 24 * H;

export const auctions = [
  // ===== Activas (empezaron y aún no cierran) =====
  {
    id: 1,
    ownerId: "u001",
    titulo: "Toyota Corolla SE 2018",
    marca: "Toyota",
    modelo: "Corolla",
    anio: 2018,
    km: 58000,
    transmision: "Automática",
    base: 5000,
    images: ["/images/placeholder.jpg"],
    startAt: now - 2 * H,
    endAt: now + 6 * H,
    desc: "Único dueño, mantenimientos al día."
  },
  {
    id: 2,
    ownerId: "u002",
    titulo: "Honda Civic EX 2016",
    marca: "Honda",
    modelo: "Civic",
    anio: 2016,
    km: 92000,
    transmision: "CVT",
    base: 4200,
    images: ["/images/placeholder.jpg"],
    startAt: now - 6 * H,
    endAt: now + 1 * D,
    desc: "Buen consumo, interiores cuidados."
  },
  {
    id: 3,
    ownerId: "u003",
    titulo: "Mazda 3 Touring 2019",
    marca: "Mazda",
    modelo: "3",
    anio: 2019,
    km: 45000,
    transmision: "Automática",
    base: 7800,
    images: ["/images/placeholder.jpg"],
    startAt: now - 1 * D,
    endAt: now + 12 * H,
    desc: "Motor SKYACTIV, servicios al día."
  },
  {
    id: 4,
    ownerId: "u004",
    titulo: "Volkswagen Golf 2015",
    marca: "Volkswagen",
    modelo: "Golf",
    anio: 2015,
    km: 110000,
    transmision: "Manual",
    base: 3900,
    images: ["/images/placeholder.jpg"],
    startAt: now - 3 * H,
    endAt: now + 20 * H,
    desc: "Compacto ágil, llantas recientes."
  },

  // ===== Próximas (aún no empiezan) =====
  {
    id: 5,
    ownerId: "u002",
    titulo: "BMW 320i 2014",
    marca: "BMW",
    modelo: "320i",
    anio: 2014,
    km: 130000,
    transmision: "Automática",
    base: 9000,
    images: ["/images/placeholder.jpg"],
    startAt: now + 1 * D,
    endAt: now + 3 * D,
    desc: "Sedán premium, suspensión firme."
  },
  {
    id: 6,
    ownerId: "u005",
    titulo: "Audi A3 2017",
    marca: "Audi",
    modelo: "A3",
    anio: 2017,
    km: 76000,
    transmision: "Automática",
    base: 10500,
    images: ["/images/placeholder.jpg"],
    startAt: now + 8 * H,
    endAt: now + 2 * D,
    desc: "Interiores en excelente estado."
  },
  {
    id: 7,
    ownerId: "u006",
    titulo: "Hyundai Elantra 2020",
    marca: "Hyundai",
    modelo: "Elantra",
    anio: 2020,
    km: 35000,
    transmision: "Automática",
    base: 8800,
    images: ["/images/placeholder.jpg"],
    startAt: now + 2 * D,
    endAt: now + 4 * D,
    desc: "Bajo kilometraje, segundo dueño."
  },
  {
    id: 8,
    ownerId: "u007",
    titulo: "Kia Rio 2019",
    marca: "Kia",
    modelo: "Rio",
    anio: 2019,
    km: 68000,
    transmision: "Manual",
    base: 5200,
    images: ["/images/placeholder.jpg"],
    startAt: now + 12 * H,
    endAt: now + 2.5 * D,
    desc: "Económico y confiable."
  },

  // ===== Finalizadas (ya cerraron) =====
  {
    id: 9,
    ownerId: "u003",
    titulo: "Ford Fiesta 2015",
    marca: "Ford",
    modelo: "Fiesta",
    anio: 2015,
    km: 125000,
    transmision: "Manual",
    base: 3000,
    images: ["/images/placeholder.jpg"],
    startAt: now - 7 * D,
    endAt: now - 2 * D,
    desc: "Mecánica al día, pintura con detalles."
  },
  {
    id: 10,
    ownerId: "u008",
    titulo: "Chevrolet Onix 2018",
    marca: "Chevrolet",
    modelo: "Onix",
    anio: 2018,
    km: 70000,
    transmision: "Manual",
    base: 4500,
    images: ["/images/placeholder.jpg"],
    startAt: now - 3 * D,
    endAt: now - 1 * D,
    desc: "Excelente consumo, mantenimiento reciente."
  },
  {
    id: 11,
    ownerId: "u009",
    titulo: "Nissan Sentra 2013",
    marca: "Nissan",
    modelo: "Sentra",
    anio: 2013,
    km: 140000,
    transmision: "Automática",
    base: 3200,
    images: ["/images/placeholder.jpg"],
    startAt: now - 10 * D,
    endAt: now - 5 * D,
    desc: "Cómodo y espacioso."
  },
  {
    id: 12,
    ownerId: "u010",
    titulo: "Subaru Impreza 2012",
    marca: "Subaru",
    modelo: "Impreza",
    anio: 2012,
    km: 155000,
    transmision: "Manual",
    base: 3700,
    images: ["/images/placeholder.jpg"],
    startAt: now - 9 * D,
    endAt: now - 3 * D,
    desc: "AWD, ideal para clima complicado."
  }
];


