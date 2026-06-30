FROM node:22-slim AS builder

WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl

COPY package.json package-lock.json ./
COPY apps/core_microservice/package.json ./apps/core_microservice/
COPY apps/auth_microservice/package.json ./apps/auth_microservice/
COPY apps/client_app/package.json ./apps/client_app/
COPY packages/database/package.json ./packages/database/

RUN npm ci --cache ./.npm-cache

COPY . .

RUN npx turbo build --filter=innogram-nest...
RUN npx turbo build --filter=@innogram/database

FROM node:22-slim AS runner

WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/core_microservice/node_modules ./apps/core_microservice/node_modules
COPY --from=builder /app/packages ./packages

COPY --from=builder /app/apps/core_microservice/dist ./apps/core_microservice/dist
COPY --from=builder /app/apps/core_microservice/package.json ./apps/core_microservice/
COPY --from=builder /app/packages/database/dist ./packages/database/dist

WORKDIR /app/apps/core_microservice

EXPOSE 3000

CMD ["node", "dist/src/main.js"]