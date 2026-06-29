// npm install --save-dev prisma dotenv
import { defineConfig } from "@prisma/config";
import { config } from "dotenv";
import * as path from "path";

config({ path: path.resolve(process.cwd(), "../../.env") });

const dbUser = process.env.POSTGRES_NAME || "postgres";
const dbPass = process.env.POSTGRES_PASSWD || "password";
const dbHost = process.env.DB_HOST || "localhost";
const dbPort = process.env.DB_PORT || "5432";

const databaseUrl =
  process.env.DATABASE_URL ||
  `postgresql://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbUser}`;

export default defineConfig({
  schema: "schema.prisma",
  migrations: {
    path: "migrations",
    seed: "node dist/seed.js"
  },
  datasource: {
    url: databaseUrl,
  },
});