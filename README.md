<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

#  ATP Tennis API

API REST ligera para consultar información del circuito ATP: perfiles de jugadores, ranking actual e histórico, torneos y resultados de partidos.

Construida con **NestJS** y **MongoDB**, desplegada como función serverless en **Vercel** con base de datos en **MongoDB Atlas**.

> Proyecto de portafolio enfocado en arquitectura modular con NestJS, modelado de documentos en MongoDB, validación con DTOs, paginación/filtros y documentación interactiva con Swagger.

<!-- Reemplaza con tus URLs reales -->
**Demo:** 
**Documentación (Swagger):** 

---

## Tabla de contenidos

- [Tecnologías](#-tecnologías)
- [Características](#-características)
- [Modelo de datos](#-modelo-de-datos)
- [Endpoints](#-endpoints)
- [Instalación local](#-instalación-local)
- [Variables de entorno](#-variables-de-entorno)
- [Seed de datos](#-seed-de-datos)
- [Despliegue](#-despliegue)
- [Estructura del proyecto](#-estructura-del-proyecto)
- [Créditos de datos](#-créditos-de-datos)
- [Autor](#-autor)

---

## Tecnologías

| Capa | Tecnología |
|---|---|
| Framework | [NestJS](https://nestjs.com/) + TypeScript |
| Base de datos | [MongoDB](https://www.mongodb.com/) con [Mongoose](https://mongoosejs.com/) |
| Validación | `class-validator` + `class-transformer` |
| Documentación | `@nestjs/swagger` (OpenAPI) |
| Seguridad | `@nestjs/throttler` (rate limiting), CORS |
| Configuración | `@nestjs/config` |
| Hosting | [Vercel](https://vercel.com/) (Functions) |
| BD en producción | [MongoDB Atlas](https://www.mongodb.com/atlas) (M0) |

---

## Características

- Consulta de jugadores con filtros por país, mano dominante y nombre.
- Ranking ATP actual e histórico por fecha.
- Catálogo de torneos por categoría (Grand Slam, Masters 1000, ATP 500, ATP 250) y superficie.
- Resultados de partidos por torneo, jugador o enfrentamiento directo (head-to-head).
- Paginación y ordenamiento en todos los listados.
- Validación de parámetros con DTOs y respuestas de error consistentes.
- Documentación interactiva con Swagger en `/docs`.
- Rate limiting para proteger la API pública.

---

## Modelo de datos

```
Player ─────┐
  _id       │
  firstName │
  lastName  │
  country   │        Ranking
  birthDate ├──────▶ playerId
  hand      │        position
  height    │        points
            │        date
            │
            │        Match                  Tournament
            ├──────▶ winnerId              ◀── tournamentId
            └──────▶ loserId                   name
                     score                     category
                     round                     surface
                     date                      city / country
                                               startDate / endDate
```

---

## Endpoints

Base URL: `/api/v1`

### Jugadores
| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/players` | Lista jugadores (filtros: `country`, `hand`, `search`, `page`, `limit`) |
| `GET` | `/players/:id` | Detalle de un jugador |
| `GET` | `/players/:id/matches` | Partidos de un jugador |
| `GET` | `/players/:id/ranking-history` | Evolución de ranking del jugador |

### Ranking
| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/rankings` | Ranking más reciente (`limit` por defecto: 100) |
| `GET` | `/rankings?date=YYYY-MM-DD` | Ranking en una fecha específica |

### Torneos
| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/tournaments` | Lista torneos (filtros: `category`, `surface`, `year`) |
| `GET` | `/tournaments/:id` | Detalle de un torneo |
| `GET` | `/tournaments/:id/matches` | Partidos del torneo |

### Partidos
| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/matches/:id` | Detalle de un partido |
| `GET` | `/matches/h2h?player1=:id&player2=:id` | Enfrentamientos directos |

### Ejemplo

```bash
curl "https://atp-tennis-api.vercel.app/api/v1/rankings?limit=3"
```

```json
{
  "data": [
    { "position": 1, "points": 11250, "player": { "id": "...", "name": "...", "country": "ESP" } },
    { "position": 2, "points": 9800,  "player": { "id": "...", "name": "...", "country": "ITA" } },
    { "position": 3, "points": 7600,  "player": { "id": "...", "name": "...", "country": "GER" } }
  ],
  "meta": { "date": "2026-10-27", "page": 1, "limit": 3, "total": 500 }
}
```

---

## Instalación local

**Requisitos:** Node.js 20+, npm y una instancia de MongoDB (local, Docker o Atlas).

```bash
# Clonar el repositorio
git clone https://github.com/<tu-usuario>/atp-tennis-api.git
cd atp-tennis-api

# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.example .env

# (Opcional) Levantar MongoDB con Docker
docker run -d --name mongo-tenis -p 27017:27017 mongo:7

# Cargar datos de prueba
npm run seed

# Iniciar en modo desarrollo
npm run start:dev
```

La API queda disponible en `http://localhost:3000/api/v1` y Swagger en `http://localhost:3000/docs`.

---

## Variables de entorno

| Variable | Descripción | Ejemplo |
|---|---|---|
| `MONGODB_URI` | Cadena de conexión a MongoDB | `mongodb://localhost:27017/tenis-dev` |
| `PORT` | Puerto local | `3000` |
| `CORS_ORIGIN` | Orígenes permitidos (separados por coma) | `http://localhost:5173` |
| `THROTTLE_LIMIT` | Peticiones permitidas por ventana | `60` |
| `THROTTLE_TTL` | Ventana de rate limit en ms | `60000` |

---

## Seed de datos

El script `npm run seed` carga jugadores, torneos, partidos y rankings desde archivos JSON/CSV en `data/`.

```bash
# Contra la BD local (usa .env)
npm run seed

# Contra producción (una sola vez)
MONGODB_URI="mongodb+srv://..." npm run seed
```

---

## Despliegue

### Backend → Vercel
Vercel detecta NestJS automáticamente (zero-config).

1. Importa el repositorio en [vercel.com/new](https://vercel.com/new).
2. Agrega las variables de entorno en **Settings → Environment Variables** (Production y Preview).
3. Cada push a `main` despliega a producción; cada PR genera un preview.

Para probar localmente igual que en producción:

```bash
vercel dev
```

### Base de datos → MongoDB Atlas
1. Crea un cluster **M0 (gratis)** en una región cercana a Vercel (ej. AWS `us-east-1`).
2. Crea un usuario con permisos `readWrite` solo sobre la base `tenis-prod`.
3. En **Network Access** permite `0.0.0.0/0` (Vercel usa IPs dinámicas).
4. Copia la cadena de conexión a `MONGODB_URI` en Vercel.

---

## Estructura del proyecto

```
src/
├── common/              # DTOs de paginación, filtros, interceptores, pipes
├── config/              # Configuración y validación de variables de entorno
├── players/
│   ├── dto/
│   ├── schemas/
│   ├── players.controller.ts
│   ├── players.service.ts
│   └── players.module.ts
├── rankings/
├── tournaments/
├── matches/
├── app.module.ts
└── main.ts
scripts/
└── seed.ts
data/                    # Datasets fuente para el seed
```

---

## Créditos de datos

Los datos históricos provienen de [tennis_atp](https://github.com/JeffSackmann/tennis_atp) de **Jeff Sackmann / Tennis Abstract**, bajo licencia [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/).

Este proyecto no está afiliado con la ATP. Su uso es solo educativo y no comercial.

---

## Autor

**Ricardo Osiel Ramírez Flores**

- GitHub: [@RicardoFlores201](https://github.com/RicardoFlores201)
- LinkedIn: [Ricardo Flores](https://www.linkedin.com/in/ricardo-flores-15197a2b3/)

---
