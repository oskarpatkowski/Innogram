import cors from "cors";
import express from "express";
import helmet from "helmet";
import swaggerDocument from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import config from "./config/config.js";
import { authRouter } from "./routes/router.js";
import { prismaClient } from "./data/prismaClient.js";
import { errorHandler } from "./services/error.middleware.js";
import { errorLogger, requestLogger } from "./services/logger.middleware.js";

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
app.use(requestLogger);

app.get("/health", async (_req, res) => {
  try {
    await prismaClient.$queryRaw`SELECT 1`;
    res.status(200).json({ status: "ok" });
  } catch (error) {
    console.error("Health check failed:", error);
    res.status(503).json({ status: "error", message: (error as Error).message });
  }
});

app.use("/internal/auth/", authRouter);
app.use("/api-d3ocs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use(errorLogger);
app.use(errorHandler);
const port = config.port;

app.listen(port, () => {
  console.log(`Auth server is running on port ${port}`);
});
