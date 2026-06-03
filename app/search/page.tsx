import { CandidateGrid } from "@/components/app-components/candidate-grid";
import { Footer } from "@/components/app-components/footer";
import { Header } from "@/components/app-components/header";

type SearchPageProps = {
  searchParams: Promise<{ q: string }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const param = await searchParams;
  const query = param.q;

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <CandidateGrid searchQuery={query} />
      </main>
      <Footer />
    </>
  )
}
