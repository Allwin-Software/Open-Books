import { Context, Hono } from "hono";
import { ObjectId } from "mongodb";

import { getDbInstance, getCostCenterCollection, getExpensesCollection } from "./helpers/db.helper";
import { CostCenterSchema } from "./schemas/cost-center-schema";

const costCenters = new Hono();

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

costCenters.get("/reconcile", async (c) => {
  const costCenterCollection = getCostCenterCollection(c);
  const expensesCollection = getExpensesCollection(c);

  const aggregationResult = await expensesCollection
    .aggregate([{ $group: { _id: "$costCenterId", totalCost: { $sum: "$amount" } } }])
    .toArray();

  console.log("Aggregation Result:", aggregationResult);

  for (let i = 0; i < aggregationResult.length; i++) {
    const result = aggregationResult[i];
    const costCenterId: string = result._id;
    const totalCost = result.totalCost;
    const updateResult = await costCenterCollection.updateOne(
      { _id: new ObjectId(costCenterId) },
      { $set: { totalCost } }
    );
  }
  return c.json({ success: true, message: "Cost center reconciled successfully" }, 200);
});

costCenters.get("/reconcile/:id", async (c) => {
  const costCenterCollection = getCostCenterCollection(c);
  const expensesCollection = getExpensesCollection(c);
  const costCenterId = c.req.param("id");
  console.log("Cost Center ID:", costCenterId);
  const costCenter = await expensesCollection.findOne({ costCenterId: costCenterId });
  console.log("Cost Center:", costCenter);

  const aggregationResult = await expensesCollection
    .aggregate([{ $match: { costCenterId: costCenterId } }, { $group: { _id: null, totalCost: { $sum: "$amount" } } }])
    .toArray();
  console.log("Aggregation Result:", aggregationResult);
  const totalCost = aggregationResult.length > 0 ? aggregationResult[0].totalCost : 0;
  await costCenterCollection.updateOne({ _id: new ObjectId(costCenterId) }, { $set: { totalCost } });
  return c.json({ success: true, message: "Cost center reconciled successfully" }, 200);
});

export default costCenters;
