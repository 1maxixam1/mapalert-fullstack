# MapAlert - La Rioja (React + Leaflet + Tailwind)

App de reporte y confirmación de eventos con **mapa real** centrado en *La Rioja, Argentina*.
- Persistencia en **localStorage**.
- Límite: **2 publicaciones por usuario por día**.
- Voto: **1 sola vez por publicación** (confirmar o negar).
- Vencimiento de publicaciones: 15 min inicial + extensiones de 15 min con confirmaciones o por el creador, hasta 1 hora.

## Requisitos
- Node 18+
- npm

## Instalación
```bash
npm install
npm run dev
```

Abre `http://localhost:5173`.

## Estructura
```
src/
  components/
    AddMarkerModal.jsx
    Login.jsx
    MapView.jsx
    MarkerDetail.jsx
    MarkerList.jsx
  context/
    AppContext.jsx
  services/
    MarkerStore.js
    StorageService.js
  utils/
    time.js
  App.jsx
  main.jsx
  index.css
```

## Notas
- El mapa usa **OpenStreetMap** a través de **react-leaflet**.
- La persistencia (marcadores, votos, conteo diario de creaciones y usuario actual) se guarda con la clave `mapalert:*` en `localStorage`.
- El límite diario es por **usuario** y se resetea cada día (clave basada en fecha).
