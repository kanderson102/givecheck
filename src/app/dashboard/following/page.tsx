import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { FollowingContent } from "./following-content";

export const metadata: Metadata = {
  title: "Following — GiveCheck",
  description: "Companies and people you follow on GiveCheck.",
};

export const dynamic = "force-dynamic";

export default function FollowingPage() {
  return (
    <>
      <Navbar />
      <main className="pt-32 pb-20">
        <FollowingContent />
      </main>
      <Footer />
    </>
  );
}
