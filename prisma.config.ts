// Run Prisma commands with `bunx prisma [command]` (Node runtime).
import { defineConfig, env } from "prisma/config";
import "dotenv/config";

export default defineConfig({
  schema: "src/problem5/prisma/schema.prisma",
  migrations: {
    path: "src/problem5/prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
    shadowDatabaseUrl: env("SHADOW_DATABASE_URL")
  },
});
