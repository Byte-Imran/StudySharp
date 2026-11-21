import dotenv from "dotenv";
import { fileURLToPath } from "node:url";

dotenv.config({ path: fileURLToPath(new URL("../../.env", import.meta.url)) });
dotenv.config({ path: fileURLToPath(new URL("../.env", import.meta.url)) });

const port = Number(process.env.PORT ?? 5000);
const mongoUri = process.env.MONGO_URI?.trim();
const nodeEnv = process.env.NODE_ENV ?? "development";
const clientUrl = process.env.CLIENT_URL ?? "http://localhost:5173";

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("PORT must be an integer between 1 and 65535.");
}

if (!mongoUri) {
  throw new Error("MONGO_URI must be set to a non-empty MongoDB connection string.");
}

let mongoProtocol;
try {
  mongoProtocol = new URL(mongoUri).protocol;
} catch {
  throw new Error("MONGO_URI must be a valid MongoDB connection string.");
}

if (!["mongodb:", "mongodb+srv:"].includes(mongoProtocol)) {
  throw new Error("MONGO_URI must use the mongodb:// or mongodb+srv:// protocol.");
}
if (!["development", "test", "production"].includes(nodeEnv)) {
  throw new Error("NODE_ENV must be development, test, or production.");
}
export const env = Object.freeze({
  port,
  mongoUri,
  nodeEnv,
  clientUrl,
});
