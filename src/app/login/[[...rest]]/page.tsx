import { SignIn } from "@clerk/nextjs";
import { ShieldCheck } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Log In — GiveCheck",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-cyan-50 to-white px-4">
      {/* Background orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-cyan-200/30 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-orange-200/20 blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-6">
        <Link href="/" className="flex items-center gap-2">
          <ShieldCheck className="h-8 w-8 text-cyan-600" />
          <span className="font-heading text-2xl font-bold text-cyan-900">
            GiveCheck
          </span>
        </Link>

        <SignIn
          appearance={{
            variables: {
              colorPrimary: "#0891B2",
              colorText: "#164e63",
              colorBackground: "#ffffff",
              colorInputBackground: "#ffffff",
              colorInputText: "#164e63",
              borderRadius: "0.5rem",
            },
            elements: {
              card: "shadow-lg border border-cyan-100",
              formButtonPrimary:
                "bg-cyan-600 hover:bg-cyan-700 text-white transition-colors",
              footerActionLink: "text-cyan-600 hover:text-cyan-800",
            },
          }}
        />
      </div>
    </div>
  );
}
