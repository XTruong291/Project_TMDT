import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CollectionView } from "@/components/sites/raycon/collection-view";
import {
  collectionsMeta,
  getCollectionInfo,
  getProductsByCollection,
} from "@/data/products";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const slugs = Object.keys(collectionsMeta);
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const collection = getCollectionInfo(slug);

  return {
    title: `${collection.title} – Raycon Audio`,
    description: collection.tagline,
  };
}

export default async function CollectionPage({ params }: PageProps) {
  const { slug } = await params;
  const collection = getCollectionInfo(slug);
  const collectionProducts = getProductsByCollection(slug);

  if (collectionProducts.length === 0 && !collectionsMeta[slug]) {
    notFound();
  }

  return (
    <main>
      <CollectionView
        initialProducts={collectionProducts}
        collection={collection}
      />
    </main>
  );
}

