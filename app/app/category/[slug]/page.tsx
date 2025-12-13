import { CategoryRouteComponent } from "@/components/app-components/CategoryRouteComponent";
import { notFound } from "next/navigation";

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  if (!slug) notFound();
  return <CategoryRouteComponent slug={slug} />
}
