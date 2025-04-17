"use server";

import { bookSchema } from "@/lib/schemas";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getBaseUrl } from "./utils";

export async function addBook(book: z.infer<typeof bookSchema>) {
  try {
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

    revalidatePath("/books");

    return response.json();
  } catch (_) {
    return {
      error: "Failed to add book",
    };
  }
}

export async function deleteBook(id: number) {
  try {
    const baseUrl = await getBaseUrl();

    const response = await fetch(`${baseUrl}/api/book/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json();

      return {
        error: errorData.error || "Failed to delete book",
      };
    }

    revalidatePath("/books");

    return response.json();
  } catch (_) {
    return {
      error: "Failed to delete book",
    };
  }
}

export async function editBook(id: number, book: z.infer<typeof bookSchema>) {
  try {
    const baseUrl = await getBaseUrl();

    const response = await fetch(`${baseUrl}/api/book/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(book),
    });

    if (!response.ok) {
      const errorData = await response.json();

      return {
        error: errorData.error || "Failed to edit book",
      };
    }

    revalidatePath("/books");

    return response.json();
  } catch (_) {
    return {
      error: "Failed to edit book",
    };
  }
}
