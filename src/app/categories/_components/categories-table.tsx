"use client";

import { useState } from "react";
import { AddCategoryForm } from "./add-category-form";
import { Category } from "@prisma/client";
import { DataTable } from "@/app/_components/data-table";
import { columns } from "./columns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function CategoriesTable({
  categories,
}: {
  categories: Category[];
}) {
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);

  return (
    <div className="flex justify-center">
      <div className="max-w-6xl w-full flex flex-col gap-4">
        <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="self-end">
              <Plus /> Add a Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add a Category</DialogTitle>
            </DialogHeader>
            <AddCategoryForm setCategoryDialogOpen={setCategoryDialogOpen} />
          </DialogContent>
        </Dialog>
        <DataTable columns={columns} data={categories} />
      </div>
    </div>
  );
}
