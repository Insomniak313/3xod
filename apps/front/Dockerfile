# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
RUN corepack enable

COPY package.json pnpm-workspace.yaml turbo.json tsconfig.base.json ./
COPY apps/front/package.json apps/front/
COPY packages/shared/package.json packages/shared/

RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm --filter @3xod/shared build && pnpm --filter front build

# Runtime stage
FROM nginx:1.27-alpine AS runner
COPY --from=builder /app/apps/front/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
