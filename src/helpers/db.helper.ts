import { Context } from "hono";
import { MongoClient } from "mongodb";

export function getDbInstance(context: Context) {
  const dbConnectionString = (context.env as any).MONGODB_URI;
  const dbName = (context.env as any).MONGODB_DB_NAME;
  const client = new MongoClient(dbConnectionString);
  return client.db(dbName);
}
