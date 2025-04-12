import { Context, Hono } from "hono";
import { getDbInstance } from "./helpers/db.helper";

const costCenters = new Hono();
const costCenterCollectionName = "costCenters";

function getCostCenterCollection(context: Context) {
  const db = getDbInstance(context);
  const coll = db.collection(costCenterCollectionName);
  return coll;
}

costCenters.get("/", async (c) => {
  const coll = getCostCenterCollection(c);
  const result = await coll.findOne({});
  return c.json(result);
});

costCenters.post("/", async (c) => {
  const coll = getCostCenterCollection(c);
  const body = await c.req.json();
  const result = await coll.insertOne(body);

  return c.json({ insertedId: result.insertedId }, 201);
});

export default costCenters;
