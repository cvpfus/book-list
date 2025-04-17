"use client";

import { Category } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Category>[] = [
  {
    accessorKey: "no",
    header: "No",
    cell: ({ row }) => row.index + 1,
    
  },
  {
    accessorKey: "name",
    header: "Category",
  },
];
