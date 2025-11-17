import { notFound } from "next/navigation";
import Link from "next/link";
import ProfileData from "./ProfileData";

interface ProfilePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { id } = await params;
  if (!id) notFound();

  return (
    <div className="min-h-screen bg-background">
      {/* Header - Renders immediately */}
      <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/app"
              className="hidden md:block text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent hover:from-accent hover:to-primary transition-all duration-300"
            >
              FreeJobSearcher
            </Link>
            <h1 className="text-xl font-bold text-foreground">
              Profile Details
            </h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <ProfileData candidateId={id} />
      </div>
    </div>
  );
}
