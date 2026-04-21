import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import config from "../config/config.js";

const adapter = new PrismaPg({
  connectionString: config.databaseUrl,
});

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
