import { Header } from "./header";
import { CandidateGridCategory } from "./category-candidate-grid";
import { deslugify } from "@/lib/utils";
import { Footer } from "./footer";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/app-components/ui/breadcrumb"
import Link from "next/link";

export function CategoryRouteComponent({ slug }: { slug: string }) {
  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/app">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/app/category">category</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{slug}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-4xl font-bold text-foreground my-4 text-balance">{deslugify(slug)}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl text-pretty">
            Browse through our curated list of talented professionals ready to join your team.
          </p>
        </div>
        <CandidateGridCategory category={slug} />
      </main>
      <Footer />
    </>
  );
}
