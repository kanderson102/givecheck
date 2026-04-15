"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { blogPosts } from "@/lib/blog-data";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const categories = [
  "All",
  "Education",
  "Comparison",
  "Guide",
  "Technical",
  "Thought Leadership",
] as const;

type CategoryFilter = (typeof categories)[number];

function formatDate(dateStr: string) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const categoryColors: Record<string, string> = {
  Education: "bg-cyan-50 text-cyan-700 border-cyan-200",
  Comparison: "bg-orange-50 text-orange-700 border-orange-200",
  Guide: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Technical: "bg-violet-50 text-violet-700 border-violet-200",
  "Thought Leadership": "bg-amber-50 text-amber-700 border-amber-200",
};

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("All");

  const filtered = useMemo(() => {
    const sorted = [...blogPosts].sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
    if (activeCategory === "All") return sorted;
    return sorted.filter((p) => p.category === activeCategory);
  }, [activeCategory]);

  return (
    <>
      <Navbar />

      <main className="pt-32 pb-20">
        <div className="mx-auto max-w-5xl px-6">
          {/* Hero */}
          <div className="text-center">
            <h1 className="font-heading text-4xl font-bold text-cyan-950 sm:text-5xl">
              The GiveCheck Blog
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-cyan-700">
              Insights on verified giving, founder generosity, and the MRG
              movement.
            </p>
          </div>

          {/* Category filter pills */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "rounded-full px-4 py-1.5 text-sm font-medium transition-colors cursor-pointer",
                  activeCategory === cat
                    ? "bg-cyan-600 text-white"
                    : "border border-cyan-200 bg-white text-cyan-700 hover:bg-cyan-50"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Article grid */}
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {filtered.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group rounded-2xl border border-cyan-100 bg-white/80 backdrop-blur-sm p-6 transition-all duration-200 hover:shadow-lg hover:border-cyan-200 cursor-pointer"
              >
                <div className="flex items-center gap-3 text-sm">
                  <span
                    className={cn(
                      "rounded-full border px-2.5 py-0.5 text-xs font-medium",
                      categoryColors[post.category] ??
                        "bg-cyan-50 text-cyan-700 border-cyan-200"
                    )}
                  >
                    {post.category}
                  </span>
                  <span className="text-cyan-500">
                    {formatDate(post.publishedAt)}
                  </span>
                </div>

                <h2 className="mt-3 font-heading text-lg font-bold text-cyan-950 group-hover:text-cyan-700 transition-colors">
                  {post.title}
                </h2>

                <p className="mt-2 text-sm leading-relaxed text-cyan-600 line-clamp-2">
                  {post.description}
                </p>

                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-cyan-600 group-hover:text-cyan-800 transition-colors">
                  Read more
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="mt-12 text-center text-cyan-500">
              No articles found in this category.
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
