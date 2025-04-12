import { z } from "zod";

const CostCenterSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().optional(),
});

type CostCenter = z.infer<typeof CostCenterSchema>;

export { CostCenterSchema, type CostCenter };
