FROM node:20-slim AS builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build --workspace=apps/auth_microservice

FROM node:20-slim AS production

ENV NODE_ENV=production
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --omit=dev --workspace=apps/auth_microservice

COPY --from=builder /usr/src/app/apps/auth_microservice/dist ./apps/auth_microservice/dist

EXPOSE 3000

CMD [ "node", "apps/auth_microservice/dist/main.js" ]