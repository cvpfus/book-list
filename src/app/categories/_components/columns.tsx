"use client";

import { Category } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import ActionCell from "./action-cell";

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
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => <ActionCell row={row} />,
    size: 50,
  },
];
