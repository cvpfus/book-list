"use server";

import { bookSchema } from "@/lib/schemas";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getBaseUrl } from "./utils";

export async function addBook(book: z.infer<typeof bookSchema>) {
  const baseUrl = await getBaseUrl();

  const response = await fetch(`${baseUrl}/api/book`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(book),
  });

  if (!response.ok) {
    const errorData = await response.json();

    return {
      error: errorData.error || "Failed to add book",
    };
  }

  revalidatePath("/");
  
  return response.json();
}
