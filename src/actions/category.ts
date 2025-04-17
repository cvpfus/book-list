"use server";

import { categorySchema } from "@/lib/schemas";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getBaseUrl } from "./utils";

export async function addCategory(category: z.infer<typeof categorySchema>) {
  const baseUrl = await getBaseUrl();

  const response = await fetch(`${baseUrl}/api/category`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(category),
  });

  if (!response.ok) {
    const errorData = await response.json();
    return {
      error: errorData.error || "Failed to add category",
    };
  }

  revalidatePath("/");

  return await response.json();
}
