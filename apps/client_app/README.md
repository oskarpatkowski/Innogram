# Client App

This is the client app for the Innogram application. It is a React application that uses the microservices.

## Deployment

To deploy this application, you will need to have Node.js and npm installed.

1.  Create a `.env` file in the root of the `client_app` directory and add the following environment variables:

    ```
    NEXT_PUBLIC_API_URL='http://localhost:3000'
    ```

2.  Run the following command to install the dependencies:

    ```
    npm install
    ```

3.  Run the following command to start the application:

    ```
    npm run dev
    ```

The application will be running on port 3001.
