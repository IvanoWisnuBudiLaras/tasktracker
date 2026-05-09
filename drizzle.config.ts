// drizzle.config.ts
import * as dotenv from "dotenv";
dotenv.config({path: ".env.local"});

export default {
  schema: "./db/schema.ts",
  out: "./database",
  driver: "mysql2",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
};