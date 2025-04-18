import { Context } from "hono";
import { MongoClient } from "mongodb";

export function getDbInstance(context: Context) {
  const dbConnectionString = (context.env as any).MONGODB_URI;
  const dbName = (context.env as any).MONGODB_DB_NAME;
  const client = new MongoClient(dbConnectionString);
  return client.db(dbName);
}

export function getCostCenterCollection(context: Context) {
  const db = getDbInstance(context);
  const costCenterCollectionName = "costCenters";
  const coll = db.collection(costCenterCollectionName);
  return coll;
}

export function getExpensesCollection(context: Context) {
  const db = getDbInstance(context);
  const expensesCollectionName = "expenses";
  const coll = db.collection(expensesCollectionName);
  return coll;
}
