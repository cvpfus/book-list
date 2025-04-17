import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateErrorMessages } from "@/lib/utils";
import { bookSchema } from "@/lib/schemas";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const body = await request.json();

    const { id: idString } = await params;

    const id = Number(idString);

    if (!Number.isInteger(id))
      return NextResponse.json(
        { error: "Invalid ID" },
        {
          status: 400,
        },
      );

    const result = bookSchema.partial().safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: generateErrorMessages(result.error) },
        {
          status: 400,
        },
      );
    }

    const existingBook = await prisma.book.findUnique({
      where: { id: Number(id) },
    });

    if (!existingBook) {
      return NextResponse.json(
        { error: "Book not found" },
        {
          status: 404,
        },
      );
    }

    if (result.data.categoryId) {
      const existingCategory = await prisma.category.findUnique({
        where: { id: result.data.categoryId },
      });

      if (!existingCategory) {
        return NextResponse.json(
          { error: "Category not found" },
          {
            status: 404,
          },
        );
      }
    }

    const updatedBook = await prisma.book.update({
      where: { id },
      data: { ...result.data },
    });

    return NextResponse.json(updatedBook);
  } catch (_) {
    return NextResponse.json(
      { error: "Failed to update book" },
      {
        status: 500,
      },
    );
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: idString } = await params;

    const id = Number(idString);

    if (!Number.isInteger(id))
      return NextResponse.json(
        { error: "Invalid ID" },
        {
          status: 400,
        },
      );

    const book = await prisma.book.findUnique({ where: { id } });

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    await prisma.book.delete({ where: { id } });

    return NextResponse.json({ message: "Book deleted" });
  } catch (_) {
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 },
    );
  }
}
