# MapAlert – Netlify (Frontend) + Render (Backend) – Fullstack Demo

Este repo contiene:
- `frontend/` (tu app React / Vite) para desplegar en **Netlify**
- `backend/` (API Express + Postgres) para desplegar en **Render**
- `render.yaml` opcional si prefieres _Blueprint_ en vez de configurar por dashboard.

## Base de datos (Render PostgreSQL)
**Nombre sugerido:** `mapalert_test` (puedes usarlo cuando Render pida "Name").

Esquema básico (también en `backend/migrations/001_init.sql`):

```sql
CREATE TABLE IF NOT EXISTS marks (
  id SERIAL PRIMARY KEY,
  text VARCHAR(255) NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  image_base64 TEXT,
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '7 days',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_marks_expires ON marks(expires_at);
```

## Variables de entorno
- **Backend (Render):**
  - `DATABASE_URL` → provisto por Render Postgres (formato `postgres://...`).
  - `PORT` (opcional, Render provee `PORT` automáticamente).
  - `CORS_ORIGIN` → URL de tu sitio de Netlify (por ejemplo `https://tu-sitio.netlify.app`).

- **Frontend (Netlify):**
  - `VITE_API_URL` → URL pública del backend en Render (ej: `https://mapalert-backend.onrender.com`).

## Despliegue rápido

### 1) Sube este repo a GitHub
- Nuevo repo público o privado.
- Push de todo el contenido.

### 2) Crea la DB en Render
- Dashboard → **New** → **PostgreSQL**
- Name: `mapalert_test` (o el que prefieras).
- Plan: Free.
- Crea la DB y copia el **Internal Connection String** o **External** (usa el que prefieras para `DATABASE_URL`).

### 3) Despliega el Backend en Render
- **New** → **Web Service** → desde tu repo → directorio `backend/`.
- Runtime: **Node 18+**.
- Build Command: `npm install`
- Start Command: `npm start`  (esto ejecuta migraciones y arranca la API)
- Env vars:
  - `DATABASE_URL` = (pegar de la DB)
  - `CORS_ORIGIN` = (ej: `https://TU-SITIO.netlify.app`)
- Post-deploy, Render mostrará la URL del servicio (ej.: `https://mapalert-backend.onrender.com`).

### 4) Despliega el Frontend en Netlify
- Netlify → **New site from Git** → repo → base dir `frontend/`.
- Build command: `npm run build`
- Publish dir: `dist`
- Env vars:
  - `VITE_API_URL` = URL pública del backend de Render.

### 5) Probar localmente
- Backend: `cd backend && cp .env.example .env` (ajusta `DATABASE_URL`) → `npm install && npm run dev`
- Frontend: `cd frontend && cp .env.example .env` (ajusta `VITE_API_URL`) → `npm install && npm run dev`

## API
- `GET /api/marks` → lista de marcas vigentes (no expiradas).
- `POST /api/marks` → `{ text, lat, lng, imageBase64? }`
- `DELETE /api/marks/:id` → elimina una marca.
- `POST /api/cleanup` → elimina marcas expiradas (Render free puede dormir; también hay un job opcional en `render.yaml`).

> **Nota sobre imágenes:** Render (free) no es almacenamiento permanente de archivos. Para pruebas guardamos `image_base64` en Postgres. Para producción usa S3/Cloudinary y guarda solo la URL.

¡Listo! Con esto deberías poder ver el Front en Netlify y que consuma el Backend en Render.
