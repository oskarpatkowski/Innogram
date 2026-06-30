FROM node:22-slim AS builder
RUN npm install -g turbo
WORKDIR /app
COPY . .
RUN turbo prune auth_microservice --docker

FROM node:22-slim AS installer
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
WORKDIR /app

COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/package-lock.json ./package-lock.json
RUN npm ci

COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json
RUN npx turbo build --filter=auth_microservice...

FROM node:22-slim AS runner
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs
USER nodejs

# Copy dependencies and compiled code
COPY --from=installer --chown=nodejs:nodejs /app/apps/auth_microservice/package.json ./apps/auth_microservice/package.json
COPY --from=installer --chown=nodejs:nodejs /app/apps/auth_microservice/dist ./apps/auth_microservice/dist
COPY --from=installer --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=installer --chown=nodejs:nodejs /app/packages ./packages

WORKDIR /app/apps/auth_microservice

EXPOSE 3000

CMD ["node", "dist/main.js"]