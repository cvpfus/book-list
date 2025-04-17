import { getBaseUrl } from "@/actions/utils";
import { CategoriesTable } from "./_components/categories-table";
import { Category } from "@prisma/client";

export default async function CategoriesPage() {
  const baseUrl = await getBaseUrl();

  const categoryData = await fetch(`${baseUrl}/api/category`);

  const categories: Category[] = await categoryData.json();

  return (
    <div className="w-full flex flex-col gap-4 p-4">
      <h2 className="text-2xl font-bold self-center">Categories</h2>
      <CategoriesTable categories={categories} />
    </div>
  );
}
