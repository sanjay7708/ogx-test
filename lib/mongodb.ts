import { MongoClient, type Db } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("MONGODB_URI is not set");

// Reuse one client across hot reloads (dev) and warm invocations (serverless).
const g = globalThis as unknown as { _mongo?: Promise<MongoClient> };
const clientPromise = (g._mongo ??= new MongoClient(uri).connect());

export async function getDb(): Promise<Db> {
  const client = await clientPromise;
  return client.db(process.env.MONGODB_DB ?? "portfolio");
}
