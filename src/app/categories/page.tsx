import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, ArrowRight } from "lucide-react";
import { categories, leaderboardData } from "@/lib/mock-data";

export const metadata = {
  title: "Categories — GiveCheck",
  description:
    "Browse verified giving companies by industry category on GiveCheck.",
};

function getCategoryCount(slug: string) {
  return leaderboardData.filter((e) => e.category === slug).length;
}

export default function CategoriesPage() {
  return (
    <>
      <Navbar />

      <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-cyan-200/40 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-orange-200/30 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <Badge
              variant="secondary"
              className="mb-6 border-cyan-200 bg-cyan-50 text-cyan-700 px-4 py-1.5 text-sm font-medium"
            >
              <ShieldCheck className="mr-1.5 h-3.5 w-3.5" />
              32 Industry Categories
            </Badge>

            <h1 className="font-heading text-4xl font-bold leading-tight tracking-tight text-cyan-950 sm:text-5xl">
              Browse by Category
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-cyan-700">
              Explore the giving leaderboard by industry. See which companies
              lead in verified Monthly Recurring Giving across every sector.
            </p>
          </div>

          <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categories.map((cat) => {
              const count = getCategoryCount(cat.slug);
              return (
                <Link
                  key={cat.slug}
                  href={`/categories/${cat.slug}`}
                  className="group rounded-2xl border border-cyan-100 bg-white/80 backdrop-blur-sm p-5 transition-all duration-200 hover:shadow-lg hover:border-cyan-200 cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <h3 className="font-heading text-base font-semibold text-cyan-900 group-hover:text-cyan-700 transition-colors">
                      {cat.label}
                    </h3>
                    <ArrowRight className="h-4 w-4 text-cyan-400 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-cyan-600" />
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-cyan-600">
                    {cat.description}
                  </p>
                  <div className="mt-3">
                    <span className="text-xs font-medium text-cyan-500">
                      {count} {count === 1 ? "company" : "companies"}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
