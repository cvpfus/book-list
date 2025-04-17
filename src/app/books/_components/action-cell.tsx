import { deleteBook } from "@/actions/book";
import { Button } from "@/components/ui/button";
import { BookWithCategory } from "@/lib/types";
import { Row } from "@tanstack/react-table";
import { Edit, Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EditBookForm } from "./edit-book-form";
import { useGetCategories } from "@/hooks/use-get-categories";

interface ActionCellProps {
  row: Row<BookWithCategory>;
}

export const ActionCell = ({ row }: ActionCellProps) => {
  const [loading, setLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const { data: categories } = useGetCategories();

  const handleDelete = async () => {
    setLoading(true);

    const result = await deleteBook(row.original.id);

    setLoading(false);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success("Book deleted successfully");

    setDeleteDialogOpen(false);
  };

  return (
    <div className="flex items-center gap-2">
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon">
            <Edit />
          </Button>
        </DialogTrigger>
        <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Edit a Book</DialogTitle>
            <DialogDescription>
              Fill in the form below to edit the book&apos;s details.
            </DialogDescription>
          </DialogHeader>
          <EditBookForm
            book={row.original}
            categories={categories}
            setEditDialogOpen={setEditDialogOpen}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="destructive" size="icon" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : <Trash2 />}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the
              book.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
              className="flex items-center gap-2"
            >
              {loading && <Loader2 className="animate-spin" />}
              <span>Delete</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
