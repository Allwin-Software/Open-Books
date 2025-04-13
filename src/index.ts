import { Hono } from "hono";
import { cors } from "hono/cors";

import costCenters from "./cost-centers";
import expenses from "./expense";

const app = new Hono();
app.use("/*", cors());

app.get("/", async (c) => {
  return c.json({ status: true });
});

app.route("/costCenters", costCenters);
app.route("/expenses", expenses);

export default app;
