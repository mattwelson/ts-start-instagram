import * as dotenv from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

dotenv.config()
dotenv.config({ path: ".env.local", override: true });


const db = drizzle(process.env.DATABASE_URL?? "", {
  schema,
});

export default db;
