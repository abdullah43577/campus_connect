import z from "zod";

const CreateEventSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.date(),
  location: z.string(),
  status: z.enum(["upcoming", "ongoing", "completed", "cancelled"]),
  packages: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      price: z.number(),
    })
  ),
  // target_amount: z.number(),
  // contributed_so_far: z.number(),
  bank_name: z.string(),
  account_no: z.string(),
  bank_code: z.string(),
});

export { CreateEventSchema };
