import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { categorySchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Category } from "@prisma/client";
import { editCategory } from "@/actions/category";

interface EditCategoryFormProps {
  category: Category;
  setEditDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function EditCategoryForm({ category, setEditDialogOpen }: EditCategoryFormProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category.name,
    },
  });

  async function onSubmit(categoryFields: z.infer<typeof categorySchema>) {
    setLoading(true);
    const result = await editCategory(category.id, categoryFields);

    setLoading(false);

    if (result.error) {
      form.setError("name", { message: result.error });
      return;
    }

    setEditDialogOpen(false);

    toast.success("Category updated successfully!");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Category Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="w-full flex justify-end">
          <Button type="submit" className="flex gap-2" disabled={loading}>
            {loading && <Loader2 className="animate-spin" />}
            <span>Edit</span>
          </Button>
        </div>
      </form>
    </Form>
  );
}
