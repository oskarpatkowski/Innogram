FROM node:22-slim AS builder
WORKDIR /app

COPY package.json package-lock.json* ./
COPY apps/client_app/package.json ./apps/client_app/

RUN npm ci --cache ./.npm-cache

COPY . .

RUN npx turbo build --filter=innogram-next...

FROM node:22-slim AS runner
WORKDIR /app/apps/client_app

COPY --from=builder /app/package-lock.json ./package-lock.json
COPY --from=builder /app/apps/client_app/package.json ./package.json
COPY --from=builder /app/apps/client_app/.next ./.next
COPY --from=builder /app/apps/client_app/public ./public

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/client_app/node_modules ./node_modules

EXPOSE 3001
CMD ["npm", "start"]
