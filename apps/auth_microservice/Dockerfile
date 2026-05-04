FROM node:25-slim AS builder
RUN npm install -g turbo
WORKDIR /app
COPY . .
RUN turbo prune auth_microservice --docker

FROM node:25-slim AS installer
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
WORKDIR /app

COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/package-lock.json ./package-lock.json
RUN npm ci

COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json
RUN npx turbo build --filter=auth_microservice...

FROM node:25-slim AS runner
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs
USER nodejs

COPY --from=installer /app/apps/auth_microservice/package.json .
COPY --from=installer --chown=nodejs:nodejs /app/apps/auth_microservice/dist ./dist
COPY --from=installer --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=installer --chown=nodejs:nodejs /app/packages ./packages

EXPOSE 3000

CMD ["node", "dist/main.js"]