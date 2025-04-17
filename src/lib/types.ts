import { z } from "zod";
import { bookFilterSchema } from "@/lib/schemas";
import { Prisma } from "@prisma/client";

export type BookFilter = z.infer<typeof bookFilterSchema>;
export type BookWithCategory = Prisma.BookGetPayload<{
  include: { category: true };
}>;
