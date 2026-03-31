FROM node:24-slim AS base
WORKDIR /app

COPY package.json package-lock.json* ./
COPY apps/client_app/package.json ./apps/client_app/

RUN npm install

COPY . .

FROM base AS builder

WORKDIR /app

RUN npm run build --workspace=innogram-next

FROM node:24-slim AS runner
WORKDIR /app

COPY package.json package-lock.json* ./
COPY apps/client_app/package.json ./apps/client_app/
RUN npm install


COPY --from=builder /app/apps/client_app/.next ./apps/client_app/.next
COPY --from=builder /app/apps/client_app/public ./apps/client_app/public

WORKDIR /app/apps/client_app

EXPOSE 3001

CMD ["npm", "start"]
