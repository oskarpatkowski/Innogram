FROM node:22-slim AS builder
WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/core_microservice/package.json ./apps/core_microservice/
COPY apps/auth_microservice/package.json ./apps/auth_microservice/
COPY apps/client_app/package.json ./apps/client_app/
COPY packages/database/package.json ./packages/database/

RUN npm ci --cache ./.npm-cache

COPY . .

RUN npx turbo build --filter=auth_microservice...

FROM node:22-slim AS runner
WORKDIR /app/apps/auth_microservice

COPY --from=builder /app/apps/auth_microservice/package.json ./package.json
COPY --from=builder /app/apps/auth_microservice/dist ./dist

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/auth_microservice/node_modules ./node_modules

EXPOSE 3000
CMD ["node", "dist/main.js"]
