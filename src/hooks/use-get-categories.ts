import { Category } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

export function useGetCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async (): Promise<Category[]> => {
      const response = await fetch("/api/category");
      return response.json();
    },
    refetchOnWindowFocus: false,
  });
}
