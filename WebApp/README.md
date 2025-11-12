# CarBid — Frontend Demo (React)

Demo de subastas de autos hecha con React (CRA), 100% frontend (sin backend). Incluye hero, header con tema claro/oscuro, login de demo con AuthContext, pantalla Publicar (formulario), Home con filtros y grilla de tarjetas, y detalle de subasta con pujas mock

## Ejecutar localmente
```
# 1) Clonar  repo
git clone https://github.com/s-aranki/Proyecto-Programacion-Web.git

# 2) Entra a la carpeta del proyecto
cd Proyecto-Programacion-Web

# 3) Instala dependencias
npm install

# 4) Arranca el servidor de desarrollo
npm start
```

## Rutas principales

`/` → Home (Hero + filtros + grilla)

`/login` → Login/Register (demo sin backend)

`/publicar` → Publicar (ruta protegida; requiere “login” de demo)

`/subasta/:id` → Detalle de subasta (galería, specs, pujas)


### Estructura
```
src/
  components/
    home/
      Card.jsx
      CardsGrid.jsx
      Filters.jsx
      Pagination.jsx
    detail/
      BidForm.jsx
      BidList.jsx
      Gallery.jsx
      Specs.jsx
      SummaryAside.jsx
  context/
    AuthContext.jsx
  data/
    auctions.js
    bids.js
  lib/
    auctions.js
  pages/
    Home.jsx
    Login.jsx
    Publish.jsx
    AuctionDetail.jsx
    styles/
      home.css
      detail.css
  index.js
  index.css
  App.js
public/
  index.html
  images/
    hero.jpg
    placeholder.jpg
```
