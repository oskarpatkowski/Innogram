FROM node:24-slim AS builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build --workspace=innogram-nest

FROM node:24-slim

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/core_microservice/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main"]