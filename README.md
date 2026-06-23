# Setup

Make sure you have docker installed and download a postgres docker [image](https://hub.docker.com/_/postgres)

## Deployment

To deploy this application, you will need to have Docker and Docker Compose installed.

1.  Create a `.env` file in the root of the project. You can use the `.env.example` file as a template.

2.  Run the following command to start the database and all microservices:

    ```
    docker-compose up --build
    ```

The application will be running on port 3000.

## Microservices

*   [Core Microservice](./apps/core_microservice/README.md)
*   [Auth Microservice](./apps/auth_microservice/README.md)
*   [Notifications Consumer Microservice](./apps/notifications_consumer_microservice/README.md)
*   [Client App](./apps/client_app/README.md)
