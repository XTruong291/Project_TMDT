import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductView } from "@/components/sites/raycon/product-view";
import { getProductByHandle, products } from "@/data/products";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return products.map((product) => ({
    slug: product.handle,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductByHandle(slug);

  if (!product) {
    return {
      title: "Product Not Found – Raycon Audio",
    };
  }

  return {
    title: `${product.name} – Raycon Audio`,
    description: product.tagline,
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getProductByHandle(slug);

  if (!product) {
    notFound();
  }

  // Related products from the same or other categories
  const relatedProducts = products.filter((p) => p.id !== product.id);

  return (
    <main>
      <ProductView product={product} relatedProducts={relatedProducts} />
    </main>
  );
}

