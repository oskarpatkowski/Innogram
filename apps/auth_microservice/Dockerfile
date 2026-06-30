FROM node:22-slim AS builder
RUN npm install -g turbo
WORKDIR /app
COPY . .
RUN turbo prune auth_microservice --docker

FROM node:22-slim AS installer
WORKDIR /app

COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/package-lock.json ./package-lock.json
RUN npm ci

COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json
RUN npx turbo build --filter=auth_microservice...

FROM node:22-slim AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs
USER nodejs

COPY --from=installer --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=installer --chown=nodejs:nodejs /app/apps/auth_microservice ./apps/auth_microservice

WORKDIR /app/apps/auth_microservice
COPY --from=installer --chown=nodejs:nodejs /app/apps/auth_microservice/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main.js"]