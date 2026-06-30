FROM node:22-slim AS base
WORKDIR /app

COPY package.json package-lock.json* ./
COPY apps/client_app/package.json ./apps/client_app/

COPY . .

RUN npm ci --cache ./.npm-cache

FROM base AS builder

WORKDIR /app

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

ARG NEXT_PUBLIC_AUTH_URL
ENV NEXT_PUBLIC_AUTH_URL=$NEXT_PUBLIC_AUTH_URL

RUN npx turbo build --filter=innogram-next...

FROM base AS runner
WORKDIR /app

# Copy dependencies
COPY package.json package-lock.json* ./
COPY apps/client_app/package.json ./apps/client_app/
RUN npm ci --cache ./.npm-cache

# Copy compiled code
COPY --from=builder /app/apps/client_app/.next ./apps/client_app/.next
COPY --from=builder /app/apps/client_app/public ./apps/client_app/public

WORKDIR /app/apps/client_app

EXPOSE 3001

CMD ["npm", "start"]