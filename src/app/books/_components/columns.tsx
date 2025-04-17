"use client";

import { BookWithCategory } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { ActionCell } from "./action-cell";

export const columns: ColumnDef<BookWithCategory>[] = [
  {
    accessorKey: "no",
    header: "No",
    cell: ({ row }) => row.index + 1,
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "pages",
    header: "Pages",
  },
  {
    accessorKey: "author",
    header: "Author",
  },
  {
    accessorKey: "publisher",
    header: "Publisher",
  },
  {
    accessorKey: "publicationDate",
    header: "Publication Date",
    cell: ({ row }) =>
      new Date(row.original.publicationDate).toLocaleDateString("id-ID"),
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => row.original.category?.name ?? "-",
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => <ActionCell row={row} />,
  },
];
