import { Hono } from "hono";
import { MongoClient } from "mongodb";

const app = new Hono();
let client = null;

app.get("/", async (c) => {
  client ??= new MongoClient((c.env as any).MONGODB_URI);
  const db = client.db("test");
  const coll = db.collection("test_workers");

  await coll.drop().catch(() => null);
  await coll.insertOne({ a: new Date() });

  const result = await coll.findOne({});
  return c.json(result);
});

export default app;
