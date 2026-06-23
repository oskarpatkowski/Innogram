# Auth Microservice

This is the auth microservice for the Innogram application. It handles user authentication and authorization.

## Deployment

To deploy this microservice, you will need to have Docker and Docker Compose installed.

1.  Create a `.env` file in the root of the project and add the following environment variables:

    ```
    POSTGRES_NAME='postgres'
    POSTGRES_PASSWD='postgres'
    AUTH_PORT=3002
    DB_PORT=5439
    DATABASE_URL="postgresql://postgres:postgres@localhost:5439/postgres"
    GOOGLE_CLIENT_ID="example"
    GOOGLE_CLIENT_SECRET="very secret"
    GOOGLE_REDIRECT_URI="http://localhost:3000/auth/google/callback"
    JWT_SECRET='verySecret'
    JWT_EXPIRES_IN='1h'
    JWT_REFRESH_EXPIRES_IN='7d'
    JWT_REFRESH_SECRET='veryverySecret'
    ```

2.  Run the following command to start the database:

    ```
    docker-compose up -d db
    ```

3.  Run the following command to start the microservice:

    ```
    npm run start:dev
    ```

The microservice will be running on port 3002.
