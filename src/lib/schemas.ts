import { z } from "zod";

export const bookSchema = z.object({
  title: z
    .string()
    .min(5, "Minimum 5 characters")
    .max(100, "Maximum 100 characters"),
  pages: z.number().min(10, "Minimum 10 pages"),
  author: z
    .string()
    .min(5, "Minimum 5 characters")
    .max(35, "Maximum 35 characters")
    .regex(/^[A-Za-z\s]+$/, "Invalid author name"),
  publisher: z
    .string()
    .min(5, "Minimum 5 characters")
    .max(35, "Maximum 35 characters"),
  publicationDate: z.coerce.date(),
  categoryId: z.number(),
});

export const bookFilterSchema = z.object({
  query: z.string().optional(),
  fromDate: z.coerce.date().optional(),
  toDate: z.coerce.date().optional(),
  excludedCategoryIds: z.number().array(),
});

export const categorySchema = z.object({
  name: z.string(),
});