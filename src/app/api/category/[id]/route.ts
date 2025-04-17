import { generateErrorMessages } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { categorySchema } from "@/lib/schemas";

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

    const result = categorySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: generateErrorMessages(result.error) },
        {
          status: 400,
        },
      );
    }

    const existingCategory = await prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 },
      );
    }

    const { name } = result.data;

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: { name },
    });

    return NextResponse.json(updatedCategory);
  } catch (_) {
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 },
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

    const category = await prisma.category.findUnique({ where: { id } });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 },
      );
    }

    await prisma.category.delete({ where: { id } });

    return NextResponse.json({ message: "Category deleted" });
  } catch (_) {
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 },
    );
  }
}
