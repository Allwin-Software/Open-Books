import { Hono } from "hono";
import { cors } from "hono/cors";
import { MongoClient, MongoClientOptions } from "mongodb";

import costCenters from "./cost-centers";

const app = new Hono();
app.use("/*", cors());

app.get("/", async (c) => {
  let client = null;
  console.log("request received 1");
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

app.route("/costCenters", costCenters);

export default app;
