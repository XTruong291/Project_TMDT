import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductView } from "@/components/sites/raycon/product-view";
import {
  getProductByHandle as fallbackGetProductByHandle,
  products as fallbackProducts,
} from "@/data/products";
import { getProductByHandle, getProducts } from "@/lib/api";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const products = await getProducts();
  const list = products && products.length > 0 ? products : fallbackProducts;
  return list.map((product) => ({
    slug: product.handle,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  let product = await getProductByHandle(slug);
  if (!product) {
    product = fallbackGetProductByHandle(slug);
  }

  if (!product) {
    return {
      title: "Product Not Found – RYVO Audio",
    };
  }

  return {
    title: `${product.name} – RYVO Audio`,
    description: product.tagline,
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  let product = await getProductByHandle(slug);
  if (!product) {
    product = fallbackGetProductByHandle(slug);
  }

  if (!product) {
    notFound();
  }

  // Related products
  const allProducts = await getProducts();
  const productList =
    allProducts && allProducts.length > 0 ? allProducts : fallbackProducts;
  const relatedProducts = productList.filter((p) => p.id !== product.id);

  return (
    <main>
      <ProductView product={product} relatedProducts={relatedProducts} />
    </main>
  );
}
