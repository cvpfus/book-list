"use server";

import { categorySchema } from "@/lib/schemas";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getBaseUrl } from "./utils";

export async function addCategory(category: z.infer<typeof categorySchema>) {
  try {
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

    revalidatePath("/categories");

    return await response.json();
  } catch (_) {
    return {
      error: "Failed to add category",
    };
  }
}

export async function editCategory(
  id: number,
  category: z.infer<typeof categorySchema>,
) {
  try {
    const baseUrl = await getBaseUrl();

    const response = await fetch(`${baseUrl}/api/category/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(category),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        error: errorData.error || "Failed to edit category",
      };
    }

    revalidatePath("/categories");

    return await response.json();
  } catch (_) {
    return {
      error: "Failed to edit category",
    };
  }
}

export async function deleteCategory(id: number) {
  try {
    const baseUrl = await getBaseUrl();

    const response = await fetch(`${baseUrl}/api/category/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        error: errorData.error || "Failed to delete category",
      };
    }

    revalidatePath("/categories");

    return await response.json();
  } catch (_) {
    return {
      error: "Failed to delete category",
    };
  }
}
