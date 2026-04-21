import cors from "cors";
import express from "express";
import helmet from "helmet";
import swaggerDocument from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import config from "./config/config.js";
import "./data/prismaClient.js";
import { authRouter } from "./routes/router.js";

const corsOptions = {
  origin: config.allowedOrigin,
  optionsSuccessStatus: 200,
};

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "Auth api",
      version: "1.0.0",
      description: "",
    },
    servers: [
      {
        url: `http://localhost:${config.port}`,
      },
    ],
  },
  apis: ["./routes/*.ts"],
};

const swaggerDocs = swaggerDocument(swaggerOptions);

const app = express();
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use("/internal/auth", authRouter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
const port = config.port;

app.listen(port, () => {
  console.log(`Auth server is running on port ${port}`);
});
