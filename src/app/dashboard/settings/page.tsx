"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { categories } from "@/lib/mock-data";
import {
  Settings,
  Building2,
  Globe,
  Tag,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Loader2,
} from "lucide-react";

export default function DashboardSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [stripeLoading, setStripeLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [stripeMessage, setStripeMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [showKey, setShowKey] = useState(false);

  const [form, setForm] = useState({
    name: "",
    website: "",
    category: "",
    description: "",
  });
  const [stripeKey, setStripeKey] = useState("");
  const [hasStripe, setHasStripe] = useState(false);

  useEffect(() => {
    fetch("/api/onboarding/company")
      .then((r) => r.json())
      .then(({ company }) => {
        if (company) {
          setForm({
            name: company.name ?? "",
            website: company.website ?? "",
            category: company.category ?? "",
            description: company.description ?? "",
          });
          setHasStripe(!!company.stripeAccountId);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleSaveProfile() {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/dashboard/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to save.");
      setMessage({ type: "success", text: "Profile updated." });
    } catch (e) {
      setMessage({ type: "error", text: e instanceof Error ? e.message : "Something went wrong." });
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdateStripe() {
    if (!stripeKey.startsWith("rk_")) {
      setStripeMessage({ type: "error", text: "Key must start with rk_" });
      return;
    }
    setStripeLoading(true);
    setStripeMessage(null);
    try {
      const res = await fetch("/api/onboarding/stripe-connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey: stripeKey }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to validate key.");
      setHasStripe(true);
      setStripeKey("");
      setStripeMessage({ type: "success", text: "Stripe key updated and verified." });
    } catch (e) {
      setStripeMessage({ type: "error", text: e instanceof Error ? e.message : "Something went wrong." });
    } finally {
      setStripeLoading(false);
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="pt-32 pb-20 flex items-center justify-center min-h-screen">
          <Loader2 className="h-6 w-6 animate-spin text-cyan-500" />
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="pt-32 pb-20">
        <div className="mx-auto max-w-2xl px-6 space-y-8">
          <div>
            <h1 className="font-heading text-3xl font-bold text-cyan-950 flex items-center gap-2">
              <Settings className="h-7 w-7 text-cyan-600" />
              Settings
            </h1>
            <p className="mt-1 text-cyan-600">Manage your company profile and integrations.</p>
          </div>

          {/* Company profile */}
          <Card className="border-cyan-100">
            <CardHeader className="pb-2">
              <CardTitle className="font-heading text-lg text-cyan-900">Company Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-cyan-800">Company name</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cyan-400" />
                  <Input
                    value={form.name}
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    className="pl-10 border-cyan-200 text-cyan-900"
                  />
                </div>
                <p className="mt-1 text-xs text-cyan-400">
                  Your public URL slug is permanent and won&apos;t change if you rename your company.
                </p>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-cyan-800">Website</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cyan-400" />
                  <Input
                    value={form.website}
                    onChange={(e) => setForm((p) => ({ ...p, website: e.target.value }))}
                    placeholder="https://yourcompany.com"
                    className="pl-10 border-cyan-200 text-cyan-900"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-cyan-800">Industry category</label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cyan-400 pointer-events-none" />
                  <select
                    value={form.category}
                    onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                    className="w-full h-10 pl-10 pr-4 rounded-md border border-cyan-200 bg-white text-sm text-cyan-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="">Select a category…</option>
                    {categories.map((cat) => (
                      <option key={cat.slug} value={cat.slug}>{cat.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-cyan-800">
                  Short bio <span className="text-cyan-400 font-normal">(max 500 chars)</span>
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value.slice(0, 500) }))}
                  rows={3}
                  maxLength={500}
                  className="w-full rounded-md border border-cyan-200 bg-white px-3 py-2.5 text-sm text-cyan-900 placeholder:text-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
                />
              </div>

              {message && (
                <div className={`flex items-center gap-2 text-sm ${message.type === "success" ? "text-green-600" : "text-red-500"}`}>
                  {message.type === "success"
                    ? <CheckCircle2 className="h-4 w-4" />
                    : <AlertCircle className="h-4 w-4" />}
                  {message.text}
                </div>
              )}

              <Button
                onClick={handleSaveProfile}
                disabled={saving}
                className="bg-cyan-600 text-white hover:bg-cyan-700 disabled:opacity-60"
              >
                {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving…</> : "Save Changes"}
              </Button>
            </CardContent>
          </Card>

          {/* Stripe connection */}
          <Card className="border-cyan-100">
            <CardHeader className="pb-2">
              <CardTitle className="font-heading text-lg text-cyan-900 flex items-center justify-between">
                Stripe Connection
                {hasStripe && (
                  <span className="flex items-center gap-1 text-xs font-normal text-green-600">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Connected
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-cyan-600">
                {hasStripe
                  ? "Your Stripe account is connected. To update, create a new restricted key and paste it below."
                  : "Connect your Stripe account so GiveCheck can verify your MRR."}
              </p>

              <div className="rounded-lg border border-cyan-100 bg-cyan-50/60 p-3 space-y-1.5 text-xs text-cyan-800">
                <p className="font-medium text-cyan-700">To create a new key:</p>
                <ol className="list-decimal list-inside space-y-1 leading-relaxed">
                  <li>Stripe Dashboard → Developers → API Keys</li>
                  <li>Create restricted key → &quot;Providing to a third-party app&quot;</li>
                  <li>Name: GiveCheck · URL: https://givecheck.org</li>
                  <li>Check &quot;Customize permissions&quot; → Balance → Read only</li>
                  <li>Copy and paste below</li>
                </ol>
                <a
                  href="https://dashboard.stripe.com/apikeys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-medium text-cyan-600 hover:text-cyan-800"
                >
                  Open Stripe API Keys <ExternalLink className="h-3 w-3" />
                </a>
              </div>

              <div className="relative">
                <Input
                  type={showKey ? "text" : "password"}
                  placeholder="rk_test_... or rk_live_..."
                  value={stripeKey}
                  onChange={(e) => setStripeKey(e.target.value)}
                  className="pr-10 border-cyan-200 font-mono text-sm text-cyan-900"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-400 hover:text-cyan-600"
                >
                  {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {stripeMessage && (
                <div className={`flex items-center gap-2 text-sm ${stripeMessage.type === "success" ? "text-green-600" : "text-red-500"}`}>
                  {stripeMessage.type === "success"
                    ? <CheckCircle2 className="h-4 w-4" />
                    : <AlertCircle className="h-4 w-4" />}
                  {stripeMessage.text}
                </div>
              )}

              <Button
                onClick={handleUpdateStripe}
                disabled={stripeLoading || !stripeKey}
                className="bg-cyan-600 text-white hover:bg-cyan-700 disabled:opacity-60"
              >
                {stripeLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Verifying…</> : hasStripe ? "Update Key" : "Connect Stripe"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}
