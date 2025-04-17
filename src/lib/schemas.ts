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
    .regex(/^[A-Za-z\s]+$/, "Author name can only contain letters and spaces"),
  publisher: z
    .string()
    .min(5, "Minimum 5 characters")
    .max(35, "Maximum 35 characters"),
  publicationDate: z.coerce.date(),
  categoryId: z.number().optional(),
});

export const bookFilterSchema = z.object({
  query: z.string().optional(),
  fromDate: z.coerce.date().optional(),
  toDate: z.coerce.date().optional(),
  excludedCategoryIds: z.number().array(),
});

export const categorySchema = z.object({
  name: z
    .string()
    .min(2, "Minimum 2 characters")
    .max(35, "Maximum 35 characters")
    .regex(
      /^[A-Za-z\s]+$/,
      "Category name can only contain letters and spaces",
    ),
});
