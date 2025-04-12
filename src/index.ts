import { Hono } from "hono";
import { MongoClient, MongoClientOptions } from "mongodb";

const app = new Hono();
let client = null;

app.get("/", async (c) => {
  console.log("request received");
  const dbConnectionString = (c.env as any).MONGODB_URI;
  console.log("Connection String", dbConnectionString);
  client ??= new MongoClient((c.env as any).MONGODB_URI, {
    maxPoolSize: 1,
    minPoolSize: 0,
    serverSelectionTimeoutMS: 5000,
  } as MongoClientOptions);
  const db = client.db("test");
  const coll = db.collection("test_workers");

  await coll.insertOne({ a: new Date() });

  const result = await coll.findOne({});
  return c.json(result);
});

export default app;
