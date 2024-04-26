import { Configuration } from "@/config";
import type { Config } from "drizzle-kit";

export default {
    schema: "./db/schema.ts",
    out: "./db/drizzle",
    driver: "pg",
    dbCredentials: {
        database: Configuration.DATABASE_NAME,
        host: Configuration.DATABASE_HOST,
        port: Configuration.DATABASE_PORT,
        user: Configuration.DATABASE_USER,
        password: Configuration.DATABASE_PASS,
    }
} satisfies Config;