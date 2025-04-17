import { generateErrorMessages } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { bookFilterSchema, bookSchema } from "@/lib/schemas";
import { BookFilter } from "@/lib/types";
import { Prisma } from "@prisma/client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const result = bookSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: generateErrorMessages(result.error),
        },
        { status: 400 }
      );
    }

    const { title, pages, author, publisher, publicationDate, categoryId } =
      result.data;

    const book = await prisma.book.create({
      data: {
        title,
        pages,
        author,
        publisher,
        publicationDate,
        categoryId: categoryId ?? Prisma.skip,
      },
    });

    return NextResponse.json(book);
  } catch (_) {
    return NextResponse.json(
      {
        error: "Failed to create book",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const fromDateSearchParams = request.nextUrl.searchParams.get("fromDate");
    const toDateSearchParams = request.nextUrl.searchParams.get("toDate");
    const excludedCategoryIdsSearchParams = request.nextUrl.searchParams.getAll(
      "excludedCategoryIds"
    );

    const bookFilter: BookFilter = {
      query: request.nextUrl.searchParams.get("query") ?? undefined,
      fromDate: fromDateSearchParams
        ? new Date(fromDateSearchParams)
        : undefined,
      toDate: toDateSearchParams ? new Date(toDateSearchParams) : undefined,
      excludedCategoryIds: excludedCategoryIdsSearchParams
        ? excludedCategoryIdsSearchParams.map(Number)
        : [],
    };

    const result = bookFilterSchema.safeParse(bookFilter);

    if (!result.success) {
      return NextResponse.json(
        {
          error: generateErrorMessages(result.error),
        },
        { status: 400 }
      );
    }

    const filters: Prisma.BookWhereInput = {
      categoryId: {
        notIn:
          bookFilter.excludedCategoryIds.length > 0
            ? bookFilter.excludedCategoryIds
            : Prisma.skip,
      },
    };

    if (bookFilter.query) {
      filters.OR = [
        { title: { contains: bookFilter.query } },
        { author: { contains: bookFilter.query } },
        { publisher: { contains: bookFilter.query } },
      ];
    }

    if (bookFilter.fromDate && bookFilter.toDate) {
      const fromDateStart = new Date(bookFilter.fromDate);
      fromDateStart.setHours(0, 0, 0);

      const toDateEnd = new Date(bookFilter.toDate);
      toDateEnd.setHours(23, 59, 59);

      filters.publicationDate = {
        gte: fromDateStart,
        lte: toDateEnd,
      };
    }

    const books = await prisma.book.findMany({
      where: filters,
      include: { category: true },
    });

    return NextResponse.json(books);
  } catch (_) {
    return NextResponse.json(
      { error: "Failed to fetch books" },
      { status: 500 }
    );
  }
}
