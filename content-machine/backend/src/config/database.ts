/**
 * Database configuration and Prisma client initialization
 */

import { PrismaClient } from "@prisma/client";
import { env, isDevelopment } from "./environment";

/**
 * Prisma client instance with logging configuration
 */
const prismaClientSingleton = (): PrismaClient => {
  return new PrismaClient({
    log: isDevelopment 
      ? ["query", "info", "warn", "error"] 
      : ["error"],
    datasources: {
      db: {
        url: env.DATABASE_URL,
      },
    },
  });
};

/** Global type declaration for Prisma client singleton */
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

/** Singleton Prisma client instance */
export const prisma = globalThis.prisma ?? prismaClientSingleton();

if (!isDevelopment) {
  globalThis.prisma = prisma;
}

/**
 * Connect to the database
 * @throws Error if connection fails
 */
export async function connectDatabase(): Promise<void> {
  try {
    await prisma.$connect();
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed:", error);
    throw error;
  }
}

/**
 * Disconnect from the database gracefully
 */
export async function disconnectDatabase(): Promise<void> {
  await prisma.$disconnect();
  console.log("Database disconnected");
}
