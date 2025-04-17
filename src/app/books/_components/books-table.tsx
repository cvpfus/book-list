"use client";

import { Category } from "@prisma/client";
import { columns } from "./columns";
import { DataTable } from "@/app/_components/data-table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { CalendarIcon, ChevronDown, ListIcon, Plus } from "lucide-react";
import { useSearchParams } from "@/hooks/use-search-params";
import { BookWithCategory } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AddBookForm } from "./add-book-form";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useDebouncedCallback } from "use-debounce";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";
import { id } from "date-fns/locale";

export function BooksTable({
  books,
  categories,
}: {
  books: BookWithCategory[];
  categories: Category[];
}) {
  const { searchParams, setSearchParams } = useSearchParams();

  const [bookDialogOpen, setBookDialogOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    const fromDate = searchParams.get("fromDate");
    const toDate = searchParams.get("toDate");

    return {
      from: fromDate ? new Date(fromDate) : undefined,
      to: toDate ? new Date(toDate) : undefined,
    };
  });
  const [selectAll, setSelectAll] = useState(() => {
    const excludedCategoryIds = searchParams.getAll("excludedCategoryIds");

    if (
      excludedCategoryIds.length === categories.length &&
      categories.length > 0
    ) {
      return true;
    }

    return false;
  });

  const debounced = useDebouncedCallback((value: string) => {
    if (!value) {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete("query");
      setSearchParams(newSearchParams);
    } else {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set("query", value);
      setSearchParams(newSearchParams);
    }
  }, 1000);

  const excludedCategoryIds = searchParams.getAll("excludedCategoryIds");
  const query = searchParams.get("query");

  const handleDateRange = (range: DateRange | undefined) => {
    setDateRange(range);

    if (!range) {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete("fromDate");
      newSearchParams.delete("toDate");
      setSearchParams(newSearchParams);
    } else {
      const newSearchParams = new URLSearchParams(searchParams);
      if (range.from) {
        newSearchParams.set("fromDate", range.from.toLocaleDateString());
      }
      if (range.to) {
        newSearchParams.set("toDate", range.to.toLocaleDateString());
      }
      setSearchParams(newSearchParams);
    }
  };

  const handleCategorySelected = (selected: boolean, category: Category) => {
    if (!selected) {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.append("excludedCategoryIds", String(category.id));
      setSearchParams(newSearchParams);

      if (
        newSearchParams.getAll("excludedCategoryIds").length ===
        categories.length
      ) {
        setSelectAll(true);
      }
    } else {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete("excludedCategoryIds", String(category.id));
      setSearchParams(newSearchParams);

      if (newSearchParams.getAll("excludedCategoryIds").length === 0) {
        setSelectAll(false);
      }
    }
  };

  const handleSelectAll = () => {
    if (!selectAll) {
      const newSearchParams = new URLSearchParams(searchParams);
      categories.forEach((category) => {
        newSearchParams.append("excludedCategoryIds", String(category.id));
        setSearchParams(newSearchParams);
        setSelectAll(true);
      });
    } else {
      const newSearchParams = new URLSearchParams(searchParams);
      categories.forEach((category) => {
        newSearchParams.delete("excludedCategoryIds", String(category.id));
        setSearchParams(newSearchParams);
        setSelectAll(false);
      });
    }
  };

  return (
    <div className="flex justify-center">
      <div className="max-w-6xl w-full flex flex-col gap-4">
        <div className="flex gap-4 justify-between">
          <div className="flex gap-4 items-center">
            <Input
              placeholder="Search.."
              className="md:w-80 w-full self-start"
              defaultValue={query ?? ""}
              onChange={(e) => debounced(e.target.value)}
            />
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "pl-3 text-left font-normal",
                    !dateRange && "text-muted-foreground",
                  )}
                >
                  {dateRange && dateRange.from && dateRange.to ? (
                    `${format(dateRange.from, "P", {
                      locale: id,
                    })} - ${format(dateRange.to, "P", {
                      locale: id,
                    })}`
                  ) : (
                    <span className="hidden md:inline">Filter books by date range</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={handleDateRange}
                  disabled={(date) =>
                    date > new Date() || date < new Date("1900-01-01")
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <ListIcon />
                  <span className="hidden md:inline"> Categories </span>
                  <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {categories.length > 0 && (
                  <>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={handleSelectAll}
                    >
                      {selectAll ? "Select All" : "Deselect All"}
                    </Button>
                    <DropdownMenuSeparator />
                  </>
                )}
                {categories.length === 0 && (
                  <DropdownMenuLabel>
                    <span>No categories.</span>
                  </DropdownMenuLabel>
                )}
                {categories.map((category) => (
                  <DropdownMenuCheckboxItem
                    key={category.id}
                    checked={
                      excludedCategoryIds.length === 0
                        ? true
                        : !excludedCategoryIds.includes(String(category.id))
                    }
                    onCheckedChange={(value) => {
                      handleCategorySelected(value, category);
                    }}
                  >
                    {category.name}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Dialog open={bookDialogOpen} onOpenChange={setBookDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus /> <span className="hidden md:inline">Add a Book</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add a Book</DialogTitle>
                <DialogDescription>
                  Fill in the form below to add a new book.
                </DialogDescription>
              </DialogHeader>
              <AddBookForm
                categories={categories}
                setBookDialogOpen={setBookDialogOpen}
              />
            </DialogContent>
          </Dialog>
        </div>
        <DataTable columns={columns} data={books} />
      </div>
    </div>
  );
}
