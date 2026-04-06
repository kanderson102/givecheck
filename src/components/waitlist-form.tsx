"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    // TODO: integrate with actual waitlist API
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 p-4 text-green-800">
        <CheckCircle2 className="h-5 w-5 shrink-0" />
        <span className="text-sm font-medium">
          You&apos;re on the list! We&apos;ll be in touch soon.
        </span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <label htmlFor="waitlist-email" className="sr-only">
        Email address
      </label>
      <Input
        id="waitlist-email"
        type="email"
        placeholder="you@company.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="h-12 flex-1 border-cyan-200 bg-white/90 backdrop-blur-sm text-cyan-900 placeholder:text-cyan-400"
      />
      <Button
        type="submit"
        className="h-12 bg-orange-500 px-6 text-white hover:bg-orange-600 cursor-pointer transition-colors duration-200"
      >
        Join Waitlist
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </form>
  );
}
