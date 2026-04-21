FROM node:25-slim AS builder

WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl

COPY package.json package-lock.json ./
COPY apps/core_microservice/package.json ./apps/core_microservice/
COPY apps/client_app/package.json ./apps/client_app/

RUN npm ci

COPY . .

RUN npx turbo build --filter=innogram-nest...

FROM node:25-slim

WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/apps/core_microservice/dist ./apps/core_microservice/dist
COPY --from=builder /app/apps/core_microservice/package.json ./apps/core_microservice/

WORKDIR /app/apps/core_microservice

EXPOSE 3000

CMD ["node", "dist/src/main.js"]