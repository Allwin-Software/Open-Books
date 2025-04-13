import { Context, Hono } from "hono";
import { getDbInstance } from "./helpers/db.helper";
import { ExpensesSchema } from "./schemas/expenses-schema";

const expenses = new Hono();

function getExpensesCollection(context: Context) {
  const db = getDbInstance(context);
  const expensesCollectionName = "expenses";
  const coll = db.collection(expensesCollectionName);
  return coll;
}

expenses.get("/", async (c) => {
  const coll = getExpensesCollection(c);
  const result = await coll.find().toArray();
  return c.json(result);
});

expenses.post("/", async (c) => {
  const coll = getExpensesCollection(c);
  const body = await c.req.json();
  const parseResult = ExpensesSchema.safeParse(body);
  if (!parseResult.success) {
    return c.json({ success: false, error: parseResult.error.format() }, 400);
  } else {
    const result = await coll.insertOne(body);
    return c.json({ success: true, insertedId: result.insertedId }, 201);
  }
});

export default expenses;
