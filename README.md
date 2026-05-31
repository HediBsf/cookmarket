# CookMarket PFE

Plateforme web marketplace culinaire : vente de plats faits maison et partage de recettes.

## Stack

- Frontend : Next.js + TypeScript + Tailwind CSS
- Backend : NestJS + TypeScript
- Base de données : PostgreSQL
- ORM : Prisma
- Authentification : JWT
- Upload images : Cloudinary, à intégrer ensuite
- Notifications temps réel : Socket.IO, à intégrer ensuite
- IA : microservice FastAPI, à intégrer ensuite

## Structure

```bash
cookmarket-pfe/
├── frontend/
└── backend/
```

## Lancement rapide

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
npx prisma generate
npx prisma migrate dev --name init
npm run start:dev
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend : http://localhost:3000  
Backend : http://localhost:3001
