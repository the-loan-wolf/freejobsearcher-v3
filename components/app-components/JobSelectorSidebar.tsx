import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { JobCategory } from "@/lib/jobCategories";

export default function JobSelectorSidebar({
  filteredData,
  getCategorySelectedCount,
  scrollToCategory,
  activeCategory,
}: {
  filteredData: JobCategory[];
  getCategorySelectedCount: (jobs: string[]) => number;
  scrollToCategory: (categoryId: string) => void;
  activeCategory: string | null;
}) {
  return (
    <div className="hidden md:block md:col-span-3 lg:col-span-3">
      <ScrollArea className="h-[calc(100vh-12rem)] pr-4">
        <div className="flex flex-col gap-1">
          {filteredData.map((category) => {
            const id = category.category.replace(/\s+/g, "-").toLowerCase();
            const count = getCategorySelectedCount(category.jobs);
            const isAllSelected =
              category.jobs.length > 0 && count === category.jobs.length;

            return (
              <button
                key={category.category}
                onClick={() => scrollToCategory(id)}
                className={cn(
                  "flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors text-left",
                  activeCategory === id
                    ? "bg-secondary text-secondary-foreground"
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground",
                )}
              >
                <span className="truncate">{category.category}</span>
                {count > 0 && (
                  <Badge
                    variant={isAllSelected ? "default" : "secondary"}
                    className="ml-2 h-5 min-w-5 px-1.5 flex items-center justify-center text-[10px]"
                  >
                    {count}
                  </Badge>
                )}
              </button>
            );
          })}
          {filteredData.length === 0 && (
            <div className="px-3 py-2 text-sm text-muted-foreground">
              No categories found
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
