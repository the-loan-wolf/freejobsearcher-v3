import { Search, X } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Dispatch, SetStateAction } from "react";

export default function JobSelectorSearch({
  searchQuery,
  setSearchQuery,
  selectedJobs,
  clearSelection,
}: {
  searchQuery: string;
  setSearchQuery: Dispatch<SetStateAction<string>>;
  selectedJobs: string[];
  clearSelection: () => void;
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-center w-full md:w-auto">
      <div className="relative w-full md:w-[300px]">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search jobs or categories..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto">
        <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground whitespace-nowrap px-2">
          <span className="font-medium text-foreground">
            {selectedJobs.length}
          </span>{" "}
          selected
        </div>
        {selectedJobs.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearSelection}
            className="ml-auto sm:ml-0 bg-transparent"
          >
            Clear
          </Button>
        )}
        <div className="sm:hidden flex items-center gap-2 text-sm text-muted-foreground ml-auto">
          <span className="font-medium text-foreground">
            {selectedJobs.length}
          </span>{" "}
          selected
        </div>
      </div>
    </div>
  );
}
