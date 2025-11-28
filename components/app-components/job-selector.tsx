"use client";

import { useState, useEffect, useMemo } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/app-components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/app-components/ui/card";
import { Checkbox } from "@/components/app-components/ui/checkbox";
import { Separator } from "@/components/app-components/ui/separator";
import type { JobCategory } from "@/lib/jobCategories";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import fetchCandidate from "@/lib/fetchCandidate";
import { Spinner } from "./ui/spinner";
import { doc, getFirestore, updateDoc } from "firebase/firestore";
import { app } from "@/lib/firebaseLib";
import { toast } from "sonner";
import { JobSelectorSkeleton } from "./JobSelectorSkeleton";
import JobSelectorSearch from "./JobSelectorSearch";
import JobSelectorSidebar from "./JobSelectorSidebar";

export interface JobSelectorProps {
  data: JobCategory[];
}

export function JobSelector({ data }: JobSelectorProps) {
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const router = useRouter();

  const queryClient = useQueryClient();

  const { user, loading: isAuthLoading } = useAuth();
  const userId = user?.uid;
  const {
    data: form,
    isLoading: isProfileLoading,
    isError,
  } = useQuery({
    queryKey: [userId],
    queryFn: () => fetchCandidate(userId!),
    enabled: !!userId,
  });

  // Initialize selectedJobs with existing data from the fetched form
  useEffect(() => {
    if (form && form.categories && selectedJobs.length === 0) {
      // Assuming 'form' is the candidate object and 'categories' is the array of saved jobs
      setSelectedJobs(form.categories as string[]);
    }
    // Dependency array includes 'form', but carefully exclude 'selectedJobs'
    // to avoid infinite loop when setting the state.
    // The condition 'selectedJobs.length === 0' prevents re-initialization.
  }, [form]);

  /* --- MUTATION LOGIC --- */
  const saveResumeToFirebase = async () => {
    const db = getFirestore(app);
    const docRef = doc(db, "resumes", user!.uid);

    await updateDoc(docRef, { categories: selectedJobs });
    return selectedJobs; // Return the saved data (optional)
  };

  const { mutate: saveResume, isPending: isSaving } = useMutation({
    mutationFn: saveResumeToFirebase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [user!.uid] });
      toast.success("Saved successfully");
    },
    onError: (error) => {
      console.error("Error during saving:", error);
      toast.error("Failed to save. Try again.");
    },
  });

  // Filter data based on search query
  const filteredData = useMemo(() => {
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

  // --- Render Logic ---

  if (isAuthLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner className="size-auto" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        Please sign in to view your profile.
      </div>
    );
  }

  if (isProfileLoading) {
    return <JobSelectorSkeleton />;
  }

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

  const jobSaveHandler = () => {
    saveResume();
  };

  return (
    <div className="flex flex-col h-[90vh] md:h-[100vh] max-w-7xl mx-auto gap-6 p-4 md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between sticky top-0 bg-background/95 backdrop-blur-sm z-10 py-2 border-b">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight">Select Jobs</h1>
          <p className="text-muted-foreground text-sm">
            Choose the roles you are interested in.
          </p>
        </div>

        <JobSelectorSearch
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedJobs={selectedJobs}
          clearSelection={clearSelection}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 h-[90vh] md:h-full min-h-0">
        {/* Sidebar Navigation - Hidden on mobile */}
        <JobSelectorSidebar
          filteredData={filteredData}
          getCategorySelectedCount={getCategorySelectedCount}
          scrollToCategory={scrollToCategory}
          activeCategory={activeCategory}
        />

        {/* Main Content Area */}
        <div className="col-span-1 md:col-span-9 lg:col-span-9 overflow-y-auto pr-2 scroll-smooth">
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
      <div className="flex justify-between">
        <Button onClick={() => router.back()}>Go Back</Button>
        <Button onClick={jobSaveHandler} disabled={isSaving}>
          {isSaving ? (
            <>
              "Saving..."
              <Spinner />
            </>
          ) : (
            "Save"
          )}
        </Button>
      </div>
    </div>
  );
}
