# 3xod

Plateforme conversationnelle qui déniche des activités inspirantes à partir d’une question libre. Le monorepo pnpm contient trois packages principaux : `apps/front` (React + Tailwind + shadcn), `apps/back` (NestJS + LangChain) et `packages/shared` (types, schémas, helpers communs).

## Structure

```
.
├── apps
│   ├── back          # NestJS + LangChain + intégrations météo/destinations
│   └── front         # Vite + React 18 + Tailwind + shadcn/ui
├── packages
│   └── shared        # Interfaces, schémas zod, constantes
├── infra             # Docker Compose et orchestration locale
├── pnpm-workspace.yaml
└── turbo.json
```

## Commandes clés

| Action | Commande |
| ------ | -------- |
| Installer les deps | `make install` |
| Lancer front | `make dev-front` |
| Lancer back | `make dev-back` |
| Lancer tous les dev servers | `make dev` (Turbo) |
| Build complet | `make build` |

> 💡 Ajoutez `USE_DOCKER=1` à n’importe quelle cible `make` pour tout exécuter dans le conteneur `toolbox` (ex. `USE_DOCKER=1 make dev`). Cela évite d’installer Node.js ou pnpm en local.

## Backend (NestJS)

- Endpoint principal : `POST /conversation/query`
- Corps attendu :

```jsonc
{
  "question": "week-end nature <500€",
  "conversationId": "optionnel",
  "preferences": [{ "key": "budget", "value": "moins-500" }],
  "location": { "latitude": 48.8566, "longitude": 2.3522 }
}
```

- Réponse : `DestinationQueryResponse` (conversation + cartes tapées dans `@3xod/shared`).
- Modules : météo (Open-Meteo), destinations (API externe ou fallback), LangChain (classement LLM + heuristiques) et conversation (mémoire en mémoire + orchestration).

## Frontend (React + Tailwind)

- Vite + React 18 + Suspense + lazy loading des grilles de cartes.
- UI mobile-first (shadcn/ui + Tailwind). Les préférences sont gérées avec Redux Toolkit, tandis que les appels conversationnels utilisent React Query.
- Variables d’environnement : `VITE_API_URL` (pointe par défaut sur `http://localhost:4000`).

## Docker

- `apps/back/Dockerfile` : build multi-étapes Node 20 + pnpm.
- `apps/front/Dockerfile` : build Vite, runtime nginx.
- `infra/docker-compose.yml` lance front, back, Redis (mémoire future) et Qdrant (vector store LangChain). Il expose aussi `toolbox`, un conteneur Node 20 + pnpm monté sur le dépôt qui sert d’environnement de dev.

### Mode full Docker (sans Node/pnpm local)

1. Construire l’image dev (une seule fois) :  
   `docker compose -f infra/docker-compose.yml build toolbox`
2. Installer les dépendances via Docker :  
   `USE_DOCKER=1 make install`
3. Lancer les serveurs front/back avec hot reload (ports 5173 et 4000 exposés) :  
   `USE_DOCKER=1 make dev`
4. Exécuter ponctuellement lint/tests/CLI :  
   `docker compose -f infra/docker-compose.yml run --rm toolbox pnpm lint`
5. Monter les services annexes (Redis + Qdrant) ou des builds prod :  
   `docker compose -f infra/docker-compose.yml up redis vectorstore`  
   `docker compose -f infra/docker-compose.yml up --build front back`

## Variables d’environnement

Consulter `.env.example`. Copier vers `.env` (ou `apps/back/.env`) puis compléter les clés API (OpenAI, fournisseur destinations).

## Prochaines étapes

1. Connecter une base persistante (Postgres ou Supabase) pour sauvegarder les conversations.
2. Intégrer réellement un provider destinations (Foursquare, Amadeus, etc.) et compléter les payloads.
3. Ajouter les cartes « restos » et autres verticales puis brancher un moteur de scoring plus fin (LangChain Tools + vector store).
4. Couvrir le pipeline avec des tests E2E (Playwright côté front + Pact ou Supertest côté API).
