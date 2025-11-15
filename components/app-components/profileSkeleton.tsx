import { Card } from "./ui/card";

// Skeleton UI shown while loading
export default function ProfileSkeleton() {
  return (
    <div className="min-h-screen animate-pulse bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column skeleton */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="h-32 w-32 rounded-full bg-muted" />
                <div className="h-5 w-2/3 bg-muted rounded" />
                <div className="h-4 w-1/2 bg-muted rounded" />
                <div className="h-3 w-1/3 bg-muted rounded" />
                <div className="h-3 w-1/4 bg-muted rounded" />
                <div className="w-full border-t border-border/50 pt-4 mt-2 space-y-3">
                  <div className="h-4 w-1/2 bg-muted rounded mx-auto" />
                  <div className="flex flex-col gap-2">
                    <div className="h-10 bg-muted rounded" />
                    <div className="h-10 bg-muted rounded" />
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right column skeleton */}
          <div className="lg:col-span-2 space-y-6">
            {[...Array(5)].map((_, i) => (
              <Card key={i} className="p-6 space-y-4">
                <div className="h-5 w-1/3 bg-muted rounded" />
                <div className="space-y-2">
                  {[...Array(3)].map((__, j) => (
                    <div key={j} className="h-3 w-full bg-muted rounded" />
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
