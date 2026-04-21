FROM node:25-slim AS base
WORKDIR /app

COPY package.json package-lock.json* ./
COPY apps/client_app/package.json ./apps/client_app/

RUN npm ci

COPY . .

FROM base AS builder

WORKDIR /app

RUN npx turbo build --filter=innogram-next...

FROM node:25-slim AS runner
WORKDIR /app

COPY package.json package-lock.json* ./
COPY apps/client_app/package.json ./apps/client_app/
RUN npm ci


COPY --from=builder /app/apps/client_app/.next ./apps/client_app/.next
COPY --from=builder /app/apps/client_app/public ./apps/client_app/public

WORKDIR /app/apps/client_app

EXPOSE 3001

CMD ["npm", "start"]
