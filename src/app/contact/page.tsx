"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Mail,
  AtSign,
  CheckCircle2,
  ArrowRight,
  MessageSquare,
} from "lucide-react";

// Metadata must be in a separate file for client components — see layout.tsx
// or use generateMetadata in a parent layout.

export default function ContactPage() {
  const [formState, setFormState] = useState<"idle" | "submitting" | "success">(
    "idle"
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email || !message) return;

    setFormState("submitting");

    // Simulate submission — no API integration yet
    setTimeout(() => {
      setFormState("success");
    }, 800);
  }

  return (
    <>
      <Navbar />

      <main className="pt-32 pb-20 sm:pt-40 sm:pb-28">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-cyan-200/40 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-3xl px-6 text-center">
            <div className="inline-flex items-center gap-2 mb-6">
              <MessageSquare className="h-10 w-10 text-cyan-600" />
            </div>
            <h1 className="font-heading text-4xl font-bold text-cyan-950 sm:text-5xl">
              Get in Touch
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-lg text-cyan-700">
              Have a question, partnership idea, or just want to say hi? We would
              love to hear from you.
            </p>
          </div>
        </section>

        <div className="mx-auto mt-16 max-w-4xl px-6">
          <div className="grid gap-12 lg:grid-cols-5">
            {/* Contact methods */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="font-heading text-lg font-semibold text-cyan-950 mb-4">
                  Contact Info
                </h2>
                <div className="space-y-4">
                  <a
                    href="mailto:hello@givecheck.com"
                    className="flex items-center gap-3 rounded-xl border border-cyan-200 bg-white/80 backdrop-blur-sm p-4 transition-all duration-200 hover:shadow-md hover:border-cyan-300"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-cyan-900">Email</p>
                      <p className="text-sm text-cyan-600">
                        hello@givecheck.com
                      </p>
                    </div>
                  </a>

                  <a
                    href="https://x.com/givecheck"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-xl border border-cyan-200 bg-white/80 backdrop-blur-sm p-4 transition-all duration-200 hover:shadow-md hover:border-cyan-300"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600">
                      <AtSign className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-cyan-900">
                        Twitter / X
                      </p>
                      <p className="text-sm text-cyan-600">@givecheck</p>
                    </div>
                  </a>
                </div>
              </div>

              <div className="rounded-xl border border-cyan-200 bg-cyan-50/50 p-5">
                <p className="text-sm font-medium text-cyan-900 mb-1">
                  Have a question?
                </p>
                <p className="text-sm text-cyan-700">
                  Check our{" "}
                  <Link
                    href="/#faq"
                    className="text-cyan-600 underline hover:text-cyan-800 font-medium"
                  >
                    FAQ
                  </Link>{" "}
                  first — it may already be answered.
                </p>
              </div>
            </div>

            {/* Contact form */}
            <div className="lg:col-span-3">
              <div className="rounded-2xl border border-cyan-200 bg-white/80 backdrop-blur-sm p-6 sm:p-8">
                <h2 className="font-heading text-lg font-semibold text-cyan-950 mb-6">
                  Send a Message
                </h2>

                {formState === "success" ? (
                  <div className="flex flex-col items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-8 text-center">
                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                    <p className="font-heading text-lg font-semibold text-green-900">
                      Message sent!
                    </p>
                    <p className="text-sm text-green-700">
                      Thanks for reaching out. We will get back to you as soon as
                      possible.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label
                        htmlFor="contact-name"
                        className="mb-1.5 block text-sm font-medium text-cyan-900"
                      >
                        Name
                      </label>
                      <Input
                        id="contact-name"
                        type="text"
                        placeholder="Your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        disabled={formState === "submitting"}
                        className="h-11 border-cyan-200 bg-white/90 text-cyan-900 placeholder:text-cyan-400"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="contact-email"
                        className="mb-1.5 block text-sm font-medium text-cyan-900"
                      >
                        Email
                      </label>
                      <Input
                        id="contact-email"
                        type="email"
                        placeholder="you@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={formState === "submitting"}
                        className="h-11 border-cyan-200 bg-white/90 text-cyan-900 placeholder:text-cyan-400"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="contact-message"
                        className="mb-1.5 block text-sm font-medium text-cyan-900"
                      >
                        Message
                      </label>
                      <textarea
                        id="contact-message"
                        rows={5}
                        placeholder="How can we help?"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                        disabled={formState === "submitting"}
                        className="flex w-full rounded-md border border-cyan-200 bg-white/90 px-3 py-2 text-sm text-cyan-900 placeholder:text-cyan-400 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={formState === "submitting"}
                      className="h-11 w-full bg-cyan-600 text-white hover:bg-cyan-700 cursor-pointer transition-colors duration-200"
                    >
                      {formState === "submitting" ? (
                        <span className="flex items-center gap-2">
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Sending...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          Send Message
                          <ArrowRight className="h-4 w-4" />
                        </span>
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
