import { JobSelector } from "@/components/app-components/job-selector";
import { jobData } from "@/lib/jobCategories";

export default function Page() {
  return (
    <main className="min-h-screen bg-background">
      <JobSelector data={jobData} />
    </main>
  );
}
