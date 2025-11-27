import { Search } from "lucide-react";
import { Skeleton } from "@/components/app-components/ui/skeleton";
import { Input } from "@/components/app-components/ui/input";
import { Button } from "@/components/app-components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
} from "@/components/app-components/ui/card";
import { ScrollArea } from "@/components/app-components/ui/scroll-area";
import { Separator } from "@/components/app-components/ui/separator";

// Helper function to render a list of skeleton items
const SkeletonList = ({ count }: { count: number }) => (
  <div className="flex flex-col gap-1">
    {Array.from({ length: count }).map((_, index) => (
      <Skeleton key={index} className="h-9 w-full rounded-md" />
    ))}
  </div>
);

// Helper function to render job item skeletons
const JobItemSkeleton = () => (
  <div className="flex items-start space-x-3 p-3 rounded-lg border bg-secondary/20">
    <Skeleton className="h-4 w-4 rounded-sm mt-0.5" />
    <div className="grid gap-1.5 leading-none">
      <Skeleton className="h-4 w-32" />
    </div>
  </div>
);

export function JobSelectorSkeleton() {
  return (
    <div className="flex flex-col h-[90vh] md:h-[100vh] max-w-7xl mx-auto gap-6 p-4 md:p-6 animate-pulse">
      {/* --- Header Section Skeleton --- */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between sticky top-0 bg-background/95 backdrop-blur-sm z-10 py-2 border-b">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-48" /> {/* Title */}
          <Skeleton className="h-4 w-72" /> {/* Description */}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-center w-full md:w-auto">
          <div className="relative w-full md:w-[300px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search jobs or categories..."
              className="pl-9"
              disabled
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Skeleton className="hidden sm:block h-6 w-24 rounded-md" />{" "}
            {/* Selected count */}
            <Button
              variant="outline"
              size="sm"
              className="ml-auto sm:ml-0 bg-transparent"
              disabled
            >
              <Skeleton className="h-4 w-12" />
            </Button>
          </div>
        </div>
      </div>

      {/* --- Main Content Layout Skeleton --- */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 h-[90vh] md:h-full min-h-0">
        {/* Sidebar Navigation Skeleton */}
        <div className="hidden md:block md:col-span-3 lg:col-span-3">
          <ScrollArea className="h-[calc(100vh-12rem)] pr-4">
            <SkeletonList count={7} /> {/* Mimic 7 category items */}
          </ScrollArea>
        </div>

        {/* Main Content Area Skeleton */}
        <div className="col-span-1 md:col-span-9 lg:col-span-9 overflow-y-auto pr-2">
          <div className="space-y-8">
            {/* Category Card 1 */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="h-8 w-24 rounded-md" />
                </div>
                <Separator className="mt-2" />
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <JobItemSkeleton key={i} />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Category Card 2 */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="h-8 w-24 rounded-md" />
                </div>
                <Separator className="mt-2" />
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <JobItemSkeleton key={i} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* --- Footer Buttons Skeleton --- */}
      <div className="flex justify-between">
        <Button disabled>
          <Skeleton className="h-4 w-20" />
        </Button>
        <Button disabled>
          <Skeleton className="h-4 w-12" />
        </Button>
      </div>
    </div>
  );
}
