import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import config from "../config/config.js";

const connectionString =
  config.databaseUrl ||
  `postgresql://${config.postgresName}:${config.postgresPassword}@${config.postgresHost}:${config.postgresPort}/${config.postgresName}`;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

export const prismaClient = new PrismaClient({ adapter });

prismaClient
  .$connect()
  .then(() => {
    console.log("Connected to Prisma Database");
  })
  .catch((err: Error) => {
    console.error("Prisma Client Connection Error", err);
  });

process.on("SIGTERM", async () => {
  await prismaClient.$disconnect();
});
