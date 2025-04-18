import { Context, Hono } from "hono";
import { ObjectId } from "mongodb";

import { getDbInstance } from "./helpers/db.helper";
import { CostCenterSchema } from "./schemas/cost-center-schema";

const costCenters = new Hono();

function getCostCenterCollection(context: Context) {
  const db = getDbInstance(context);
  const costCenterCollectionName = "costCenters";
  const coll = db.collection(costCenterCollectionName);
  return coll;
}

costCenters.get("/", async (c) => {
  const coll = getCostCenterCollection(c);
  const result = await coll.find().toArray();
  return c.json(result);
});

costCenters.post("/", async (c) => {
  const coll = getCostCenterCollection(c);
  const body = await c.req.json();
  const parseResult = CostCenterSchema.safeParse(body);
  if (!parseResult.success) {
    return c.json({ success: false, error: parseResult.error.format() }, 400);
  } else {
    const result = await coll.insertOne(body);
    return c.json({ success: true, insertedId: result.insertedId }, 201);
  }
});

costCenters.put("/:id", async (c) => {
  const coll = getCostCenterCollection(c);
  const id = c.req.param("id");
  const body = await c.req.json();
  const result = await coll.updateOne({ _id: new ObjectId(id) }, { $set: body });

  if (result.matchedCount === 0) {
    return c.json({ success: false, message: "Cost center not found" }, 404);
  }
  return c.json({ success: true, message: "Cost center updated successfully" }, 200);
});

costCenters.delete("/:id", async (c) => {
  const coll = getCostCenterCollection(c);
  const id = c.req.param("id");
  const result = await coll.deleteOne({ _id: new ObjectId(id) });

  if (result.deletedCount === 0) {
    return c.json({ success: false, message: "Cost center not found" }, 404);
  }
  return c.json({ success: true, message: "Cost center deleted successfully" }, 200);
});

export default costCenters;
