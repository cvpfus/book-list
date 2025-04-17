import { generateErrorMessages } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { categorySchema } from "@/lib/schemas";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const result = categorySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: generateErrorMessages(result.error) },
        {
          status: 400,
        },
      );
    }

    const { name } = result.data;

    const category = await prisma.category.create({
      data: {
        name,
      },
    });

    return NextResponse.json(category);
  } catch (error: unknown) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "Category already exists" },
        {
          status: 400,
        },
      );
    }

    return NextResponse.json(
      { error: "Failed to create category" },
      {
        status: 500,
      },
    );
  }
}

export async function GET() {
  try {
    const categories = await prisma.category.findMany();

    return NextResponse.json(categories);
  } catch (_) {
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 },
    );
  }
}
