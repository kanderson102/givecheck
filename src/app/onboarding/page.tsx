"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { ShieldCheck, ArrowRight, Building2, Globe, Tag, ExternalLink, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { categories } from "@/lib/mock-data";
import Link from "next/link";

const STEPS = ["Your Company", "Category & Bio", "Connect Stripe"];

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useUser();

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [checkingExisting, setCheckingExisting] = useState(true);
  const [companyCreated, setCompanyCreated] = useState(false);
  const [error, setError] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [form, setForm] = useState({
    name: "",
    website: "",
    category: "",
    description: "",
    stripeKey: "",
  });

  // Check if user already has a company — redirect to dashboard if so
  useEffect(() => {
    fetch("/api/onboarding/company")
      .then((r) => r.json())
      .then(({ company }) => {
        if (company) {
          router.replace("/dashboard");
        } else {
          setCheckingExisting(false);
        }
      })
      .catch(() => setCheckingExisting(false));
  }, [router]);

  function set(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError("");
  }

  async function handleSubmitCompany() {
    if (form.name.trim().length < 2) {
      setError("Please enter your company name.");
      return;
    }
    setStep(1);
  }

  async function handleSubmitCategory() {
    setStep(2);
  }

  /**
   * Creates the company if it doesn't exist yet.
   * The API is idempotent — returns existing company on duplicate.
   */
  async function ensureCompany() {
    if (companyCreated) return;

    const res = await fetch("/api/onboarding/company", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        website: form.website,
        category: form.category,
        description: form.description,
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? "Failed to save company.");
    setCompanyCreated(true);
    return data.company;
  }

  async function handleFinish() {
    setLoading(true);
    setError("");
    try {
      await ensureCompany();
      router.push("/dashboard?onboarded=1");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setLoading(false);
    }
  }

  async function handleConnectStripe() {
    if (!form.stripeKey.startsWith("rk_")) {
      setError("Please enter a valid Stripe restricted key (starts with rk_).");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await ensureCompany();

      const stripeRes = await fetch("/api/onboarding/stripe-connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey: form.stripeKey }),
      });
      const stripeData = await stripeRes.json();

      if (!stripeRes.ok) {
        setError(stripeData.error ?? "Could not validate Stripe key.");
        setLoading(false);
        return;
      }

      router.push("/dashboard?onboarded=1&stripe=connected");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setLoading(false);
    }
  }

  const firstName = user?.firstName ?? user?.emailAddresses?.[0]?.emailAddress?.split("@")[0] ?? "there";

  if (checkingExisting) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-cyan-500" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-cyan-50 to-white px-4 py-16">
      {/* Background orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-cyan-200/30 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-orange-200/20 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-lg">
        {/* Logo */}
        <Link href="/" className="mb-8 flex items-center justify-center gap-2">
          <ShieldCheck className="h-7 w-7 text-cyan-600" />
          <span className="font-heading text-xl font-bold text-cyan-900">GiveCheck</span>
        </Link>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {STEPS.map((label, i) => (
              <div key={label} className="flex flex-1 items-center">
                <div className="flex flex-col items-center gap-1 flex-1">
                  <div
                    className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                      i < step
                        ? "bg-cyan-600 text-white"
                        : i === step
                        ? "bg-cyan-600 text-white ring-4 ring-cyan-100"
                        : "bg-cyan-100 text-cyan-400"
                    }`}
                  >
                    {i < step ? "✓" : i + 1}
                  </div>
                  <span className={`text-[11px] font-medium text-center ${i === step ? "text-cyan-700" : "text-cyan-400"}`}>
                    {label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`h-0.5 flex-1 mb-5 mx-1 ${i < step ? "bg-cyan-600" : "bg-cyan-100"}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-cyan-100 bg-white/90 backdrop-blur-sm shadow-lg p-8">

          {/* Step 0: Company basics */}
          {step === 0 && (
            <div className="space-y-5">
              <div>
                <h1 className="font-heading text-2xl font-bold text-cyan-950">
                  Welcome, {firstName}!
                </h1>
                <p className="mt-1 text-sm text-cyan-600">
                  Let&apos;s set up your GiveCheck profile. It takes about 2 minutes.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-cyan-800">
                    Company name <span className="text-orange-500">*</span>
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cyan-400" />
                    <Input
                      placeholder="Acme Inc."
                      value={form.name}
                      onChange={(e) => set("name", e.target.value)}
                      className="pl-10 h-11 border-cyan-200 text-cyan-900 placeholder:text-cyan-400"
                      onKeyDown={(e) => e.key === "Enter" && handleSubmitCompany()}
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-cyan-800">
                    Website
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cyan-400" />
                    <Input
                      placeholder="https://yourcompany.com"
                      value={form.website}
                      onChange={(e) => set("website", e.target.value)}
                      className="pl-10 h-11 border-cyan-200 text-cyan-900 placeholder:text-cyan-400"
                      onKeyDown={(e) => e.key === "Enter" && handleSubmitCompany()}
                    />
                  </div>
                </div>
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <Button
                onClick={handleSubmitCompany}
                className="w-full h-11 bg-cyan-600 text-white hover:bg-cyan-700"
              >
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Step 1: Category & bio */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <h1 className="font-heading text-2xl font-bold text-cyan-950">
                  Tell us about {form.name}
                </h1>
                <p className="mt-1 text-sm text-cyan-600">
                  This shows on your public leaderboard profile.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-cyan-800">
                    Industry category
                  </label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cyan-400 pointer-events-none" />
                    <select
                      value={form.category}
                      onChange={(e) => set("category", e.target.value)}
                      className="w-full h-11 pl-10 pr-4 rounded-md border border-cyan-200 bg-white text-sm text-cyan-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 cursor-pointer"
                    >
                      <option value="">Select a category…</option>
                      {categories.map((cat) => (
                        <option key={cat.slug} value={cat.slug}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-cyan-800">
                    Short bio <span className="text-cyan-400 font-normal">(optional, max 500 chars)</span>
                  </label>
                  <textarea
                    placeholder="What does your company do? (2–3 sentences)"
                    value={form.description}
                    onChange={(e) => set("description", e.target.value.slice(0, 500))}
                    rows={3}
                    maxLength={500}
                    className="w-full rounded-md border border-cyan-200 bg-white px-3 py-2.5 text-sm text-cyan-900 placeholder:text-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
                  />
                </div>
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep(0)}
                  className="flex-1 h-11 border-cyan-200 text-cyan-700"
                >
                  Back
                </Button>
                <Button
                  onClick={handleSubmitCategory}
                  className="flex-1 h-11 bg-cyan-600 text-white hover:bg-cyan-700"
                >
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Connect Stripe via restricted key */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h1 className="font-heading text-2xl font-bold text-cyan-950">
                  Connect your revenue
                </h1>
                <p className="mt-1 text-sm text-cyan-600">
                  Create a read-only Stripe key so GiveCheck can verify your MRR and calculate your giving percentage.
                </p>
              </div>

              <div className="rounded-xl border border-cyan-100 bg-cyan-50/60 p-4 space-y-2.5">
                <p className="text-xs font-semibold uppercase tracking-wide text-cyan-600">How to get your key — 60 seconds</p>
                <ol className="space-y-1.5 text-xs text-cyan-800 list-decimal list-inside leading-relaxed">
                  <li>Go to your Stripe Dashboard → Developers → API Keys</li>
                  <li>Click <strong>Create restricted key</strong></li>
                  <li>Select <strong>&quot;Providing this key to a third-party application&quot;</strong></li>
                  <li>Name: <strong>GiveCheck</strong> · URL: <strong>https://givecheck.org</strong></li>
                  <li>Check <strong>&quot;Customize permissions for this key&quot;</strong> → Continue</li>
                  <li>Under <strong>Permissions</strong> (left column): click each section header to set all to <strong>None</strong>, then find <strong>Balance</strong> and set it to <strong>Read</strong>. Leave the Connect Permissions column entirely as <strong>None</strong>.</li>
                  <li>Click <strong>Create key</strong> — on the next screen, find the key you just named (e.g. &quot;API key for GiveCheck&quot;) and copy its token. Paste it below.</li>
                </ol>
                <a
                  href="https://dashboard.stripe.com/apikeys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-medium text-cyan-600 hover:text-cyan-800 transition-colors"
                >
                  Open Stripe API Keys
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-cyan-800">
                  Restricted API Key
                </label>
                <div className="relative">
                  <Input
                    type={showKey ? "text" : "password"}
                    placeholder="rk_test_... or rk_live_..."
                    value={form.stripeKey}
                    onChange={(e) => set("stripeKey", e.target.value)}
                    className="pr-10 h-11 border-cyan-200 text-cyan-900 placeholder:text-cyan-400 font-mono text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-400 hover:text-cyan-600"
                  >
                    {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="mt-1.5 text-xs text-cyan-500">
                  Encrypted at rest. Read-only — we can never move money or see customer data.
                </p>
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <Button
                onClick={handleConnectStripe}
                disabled={loading || !form.stripeKey}
                className="w-full h-11 bg-cyan-600 text-white hover:bg-cyan-700 disabled:opacity-60"
              >
                {loading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Verifying…</>
                ) : (
                  <>Connect & Finish<ArrowRight className="ml-2 h-4 w-4" /></>
                )}
              </Button>

              <button
                onClick={handleFinish}
                disabled={loading}
                className="w-full text-sm text-cyan-500 hover:text-cyan-700 transition-colors disabled:opacity-40"
              >
                Skip for now — I&apos;ll connect later
              </button>

              <p className="text-xs text-center text-cyan-400">
                By connecting, you agree to our{" "}
                <Link href="/terms" className="underline hover:text-cyan-600">Terms</Link>{" "}
                and{" "}
                <Link href="/privacy" className="underline hover:text-cyan-600">Privacy Policy</Link>.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
