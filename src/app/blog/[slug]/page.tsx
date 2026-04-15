import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { blogPosts, getBlogPost, getRelatedPosts } from "@/lib/blog-data";
import { ArrowLeft, ArrowRight, BadgeCheck, BarChart2, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

const categoryColors: Record<string, string> = {
  Education: "bg-cyan-50 text-cyan-700 border-cyan-200",
  Comparison: "bg-orange-50 text-orange-700 border-orange-200",
  Guide: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Technical: "bg-violet-50 text-violet-700 border-violet-200",
  "Thought Leadership": "bg-amber-50 text-amber-700 border-amber-200",
};

function formatDate(dateStr: string) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) {
    return { title: "Post Not Found — GiveCheck" };
  }
  return {
    title: `${post.title} — GiveCheck Blog`,
    description: post.description,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const related = getRelatedPosts(slug, 3);

  return (
    <>
      <Navbar />

      <main className="pt-32 pb-20">
        <article className="mx-auto max-w-3xl px-6">
          {/* Back link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-cyan-600 hover:text-cyan-800 transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Blog
          </Link>

          {/* Header */}
          <div className="mt-8">
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
              <span className="text-cyan-400">|</span>
              <span className="text-cyan-500">{post.author}</span>
            </div>

            <h1 className="mt-4 font-heading text-3xl font-bold leading-tight text-cyan-950 sm:text-4xl">
              {post.title}
            </h1>

            <p className="mt-4 text-lg leading-relaxed text-cyan-700">
              {post.description}
            </p>
          </div>

          {/* Divider */}
          <hr className="my-8 border-cyan-100" />

          {/* Content */}
          <div
            className="prose prose-lg max-w-none
              prose-headings:font-heading prose-headings:font-bold prose-headings:text-cyan-950 prose-headings:tracking-tight
              prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4 prose-h2:pb-2 prose-h2:border-b prose-h2:border-cyan-100
              prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
              prose-p:text-cyan-800 prose-p:leading-relaxed prose-p:my-5
              prose-li:text-cyan-800 prose-li:leading-relaxed
              prose-strong:text-cyan-900 prose-strong:font-semibold
              prose-a:text-cyan-600 prose-a:underline hover:prose-a:text-cyan-800
              prose-code:bg-cyan-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-cyan-800 prose-code:text-sm prose-code:font-mono prose-code:before:content-none prose-code:after:content-none
              prose-ol:list-decimal prose-ul:list-disc
              prose-ul:my-5 prose-ol:my-5
              prose-em:text-cyan-700"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>

        {/* CTA Banner */}
        <section className="mx-auto mt-16 max-w-3xl px-6">
          <div className="rounded-2xl bg-gradient-to-br from-cyan-600 to-cyan-800 p-8 text-white">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-heading text-xl font-bold">
                  Ready to verify your giving?
                </h2>
                <p className="mt-1.5 text-sm text-cyan-100 leading-relaxed max-w-sm">
                  Connect Stripe, choose your nonprofits, and get a verified
                  badge you can embed anywhere. Takes about 5 minutes.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:items-end shrink-0">
                <Link
                  href="/#waitlist"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-cyan-800 hover:bg-cyan-50 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Heart className="h-4 w-4" />
                  Join the Waitlist
                </Link>
                <Link
                  href="/leaderboard"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-medium text-white hover:bg-white/20 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <BarChart2 className="h-4 w-4" />
                  See the Leaderboard
                </Link>
              </div>
            </div>

            {/* Trust signals */}
            <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-white/20 pt-5 text-xs text-cyan-100">
              <span className="flex items-center gap-1.5">
                <BadgeCheck className="h-3.5 w-3.5" />
                Verified via Stripe + Every.org
              </span>
              <span className="flex items-center gap-1.5">
                <BadgeCheck className="h-3.5 w-3.5" />
                Read-only access, never charges customers
              </span>
              <span className="flex items-center gap-1.5">
                <BadgeCheck className="h-3.5 w-3.5" />
                Embeddable badge for your site
              </span>
            </div>
          </div>
        </section>

        {/* Related Articles */}
        {related.length > 0 && (
          <section className="mx-auto mt-12 max-w-3xl px-6">
            <hr className="mb-10 border-cyan-100" />
            <h2 className="font-heading text-2xl font-bold text-cyan-950">
              Related Articles
            </h2>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {related.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/blog/${rel.slug}`}
                  className="group rounded-xl border border-cyan-100 bg-white/80 backdrop-blur-sm p-4 transition-all duration-200 hover:shadow-md hover:border-cyan-200 cursor-pointer"
                >
                  <span
                    className={cn(
                      "inline-block rounded-full border px-2 py-0.5 text-[10px] font-medium",
                      categoryColors[rel.category] ??
                        "bg-cyan-50 text-cyan-700 border-cyan-200"
                    )}
                  >
                    {rel.category}
                  </span>
                  <h3 className="mt-2 font-heading text-sm font-bold text-cyan-950 group-hover:text-cyan-700 transition-colors line-clamp-2">
                    {rel.title}
                  </h3>
                  <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-cyan-600 group-hover:text-cyan-800 transition-colors">
                    Read
                    <ArrowRight className="h-3 w-3" />
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}
