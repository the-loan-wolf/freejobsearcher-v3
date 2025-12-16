import { Header } from "@/components/app-components/header";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/app-components/ui/breadcrumb";
import Link from "next/link";
import { Footer } from "@/components/app-components/footer";
import { FavoriteProfiles } from "./Favoriteprofiles";

export function FavoriteRouteComponent() {
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
                <BreadcrumbPage>favorite</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-4xl font-bold text-foreground my-4 text-balance">
            Favorite
          </h1>
        </div>
        <FavoriteProfiles />
      </main>
      <Footer />
    </>
  );
}
