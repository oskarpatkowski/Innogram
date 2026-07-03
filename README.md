# Setup

Make sure you have docker installed and download a postgres docker [image](https://hub.docker.com/_/postgres)

## Development (Default)

To start the application in development mode with hot-reloading (uses volume bind mounts):

```bash
docker compose up --build
```

The client will be available at `http://localhost:3001` (or your configured `CLIENT_PORT`).

## Production Deployment

To deploy in production mode (removes bind mounts, uses pre-built stages):

1. Set your `EC2_IP` and other required variables in `.env`.
2. Run the deployment command:

```bash
docker compose -f docker-compose.yaml -f docker-compose.prod.yml up -d --build
```

## Microservices

*   [Core Microservice](./apps/core_microservice/README.md)
*   [Auth Microservice](./apps/auth_microservice/README.md)
*   [Notifications Consumer Microservice](./apps/notifications_consumer_microservice/README.md)
*   [Client App](./apps/client_app/README.md)
