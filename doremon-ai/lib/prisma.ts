import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as { _prisma?: PrismaClient };

function createClient(): PrismaClient {
  const url = process.env.DATABASE_URL ?? "";

  if (url.startsWith("prisma+postgres://")) {
    return new PrismaClient({ accelerateUrl: url });
  }

  const adapter = new PrismaPg({ connectionString: url });
  return new PrismaClient({ adapter });
}

const prisma = globalForPrisma._prisma ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma._prisma = prisma;
}

export default prisma;
