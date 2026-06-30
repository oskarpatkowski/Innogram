FROM node:22-slim AS builder
RUN npm install -g turbo
WORKDIR /app
COPY . .
RUN turbo prune innogram-next --docker

FROM node:22-slim AS installer
WORKDIR /app

COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/package-lock.json ./package-lock.json

RUN npm ci

COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json

RUN npx turbo build --filter=innogram-next...

FROM node:22-slim AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs
USER nodejs

COPY --from=installer --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=installer --chown=nodejs:nodejs /app/packages ./packages
COPY --from=installer --chown=nodejs:nodejs /app/apps/client_app ./apps/client_app

WORKDIR /app/apps/client_app

EXPOSE 3001
CMD ["npx", "next", "start"]