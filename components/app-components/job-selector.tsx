"use client";

import * as React from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/app-components/ui/badge";
import { Button } from "@/components/app-components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/app-components/ui/card";
import { Checkbox } from "@/components/app-components/ui/checkbox";
import { Input } from "@/components/app-components/ui/input";
import { ScrollArea } from "@/components/app-components/ui/scroll-area";
import { Separator } from "@/components/app-components/ui/separator";
import type { JobCategory } from "@/lib/jobCategories";
import { useRouter } from "next/navigation";

interface JobSelectorProps {
  data: JobCategory[];
}

export function JobSelector({ data }: JobSelectorProps) {
  const [selectedJobs, setSelectedJobs] = React.useState<string[]>([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeCategory, setActiveCategory] = React.useState<string | null>(
    null,
  );
  const router = useRouter();

  // Filter data based on search query
  const filteredData = React.useMemo(() => {
    if (!searchQuery) return data;

    const lowerQuery = searchQuery.toLowerCase();
    return data
      .map((category) => {
        const matchingJobs = category.jobs.filter((job) =>
          job.toLowerCase().includes(lowerQuery),
        );
        // Keep category if it matches name OR has matching jobs
        if (
          category.category.toLowerCase().includes(lowerQuery) ||
          matchingJobs.length > 0
        ) {
          return {
            ...category,
            // If category name matches, show all jobs, otherwise only matching jobs
            jobs: category.category.toLowerCase().includes(lowerQuery)
              ? category.jobs
              : matchingJobs,
          };
        }
        return null;
      })
      .filter((cat): cat is JobCategory => cat !== null);
  }, [data, searchQuery]);

  const toggleJob = (job: string) => {
    setSelectedJobs((prev) =>
      prev.includes(job) ? prev.filter((j) => j !== job) : [...prev, job],
    );
  };

  const toggleCategory = (categoryName: string, jobs: string[]) => {
    const allSelected = jobs.every((job) => selectedJobs.includes(job));

    if (allSelected) {
      // Deselect all in category
      setSelectedJobs((prev) => prev.filter((job) => !jobs.includes(job)));
    } else {
      // Select all in category
      // Add jobs that aren't already selected
      const newJobs = jobs.filter((job) => !selectedJobs.includes(job));
      setSelectedJobs((prev) => [...prev, ...newJobs]);
    }
  };

  const clearSelection = () => setSelectedJobs([]);

  const scrollToCategory = (categoryId: string) => {
    const element = document.getElementById(categoryId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveCategory(categoryId);
    }
  };

  // Get selected count for a category
  const getCategorySelectedCount = (jobs: string[]) => {
    return jobs.filter((job) => selectedJobs.includes(job)).length;
  };

  return (
    <div className="flex flex-col h-[calc(100vh-1rem)] max-w-7xl mx-auto gap-6 p-4 md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between sticky top-0 bg-background/95 backdrop-blur-sm z-10 py-2 border-b">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight">Select Jobs</h1>
          <p className="text-muted-foreground text-sm">
            Choose the roles you are interested in.
          </p>
        </div>

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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 h-full min-h-0">
        {/* Sidebar Navigation - Hidden on mobile */}
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

        {/* Main Content Area */}
        <div className="col-span-1 md:col-span-9 lg:col-span-9 h-full overflow-y-auto pr-2 pb-20 scroll-smooth">
          <div className="space-y-8">
            {filteredData.length > 0 ? (
              filteredData.map((category) => {
                const id = category.category.replace(/\s+/g, "-").toLowerCase();
                const allSelected = category.jobs.every((job) =>
                  selectedJobs.includes(job),
                );
                const someSelected = category.jobs.some((job) =>
                  selectedJobs.includes(job),
                );

                return (
                  <Card
                    key={category.category}
                    id={id}
                    className="scroll-mt-24"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">
                          {category.category}
                        </CardTitle>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs h-8"
                          onClick={() =>
                            toggleCategory(category.category, category.jobs)
                          }
                        >
                          {allSelected ? "Deselect All" : "Select All"}
                        </Button>
                      </div>
                      <Separator className="mt-2" />
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {category.jobs.map((job) => {
                          const isSelected = selectedJobs.includes(job);
                          return (
                            <div
                              key={job}
                              className={cn(
                                "flex items-start space-x-3 p-3 rounded-lg border transition-all cursor-pointer hover:border-primary/50 hover:bg-secondary/30",
                                isSelected
                                  ? "border-primary bg-primary/5"
                                  : "border-transparent bg-secondary/20",
                              )}
                              onClick={() => toggleJob(job)}
                            >
                              <Checkbox
                                id={job}
                                checked={isSelected}
                                onCheckedChange={() => toggleJob(job)}
                                className="mt-0.5"
                              />
                              <div className="grid gap-1.5 leading-none">
                                <label
                                  htmlFor={job}
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                >
                                  {job}
                                </label>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-secondary/50 p-4 mb-4">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold">No jobs found</h3>
                <p className="text-muted-foreground max-w-sm mt-2">
                  We couldn't find any jobs matching "{searchQuery}". Try
                  adjusting your search terms.
                </p>
                <Button
                  variant="outline"
                  className="mt-6 bg-transparent"
                  onClick={() => setSearchQuery("")}
                >
                  Clear search
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-start p-2 space-x-1">
        <Button onClick={() => router.back()}>Go Back</Button>
        <Button>Save</Button>
      </div>
    </div>
  );
}
