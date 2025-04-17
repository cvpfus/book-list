import { BooksTable } from "@/app/books/_components/books-table";
import { Category } from "@prisma/client";
import { BookWithCategory } from "@/lib/types";
import { getBaseUrl } from "@/actions/utils";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function BooksPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const baseUrl = await getBaseUrl();

  const _searchParams = await searchParams;

  const cleanSearchParams = new URLSearchParams();

  Object.entries(_searchParams).forEach(([key, value]) => {
    if (value !== undefined) {
      if (Array.isArray(value)) {
        value.forEach((val) => cleanSearchParams.append(key, val));
      } else {
        cleanSearchParams.append(key, value);
      }
    }
  });

  const bookData = await fetch(
    `${baseUrl}/api/book?${cleanSearchParams.toString()}`,
  );

  const categoryData = await fetch(`${baseUrl}/api/category`);

  const books: BookWithCategory[] = await bookData.json();

  const categories: Category[] = await categoryData.json();

  return (
    <div className="w-full flex flex-col gap-4 p-4">
      <h2 className="text-2xl font-bold self-center">Books</h2>
      <BooksTable books={books} categories={categories} />
    </div>
  );
}
