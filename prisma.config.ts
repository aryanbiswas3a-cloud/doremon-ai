import { config } from "dotenv";
import { defineConfig, env } from "prisma/config";

config({ path: "doremon-ai/.env.local" });

// Normalize env var casing for cross-platform compatibility
if (!process.env.DATABASE_URL && process.env.Database_URL) {
  process.env.DATABASE_URL = process.env.Database_URL;
}

export default defineConfig({
  schema: "prisma/",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
