/**
 * Environment variable validation.
 *
 * Imported by the app at startup — fails fast with clear error messages
 * if any required variable is missing or malformed.
 *
 * Usage: import "@/lib/env" in layout.tsx or a top-level server component.
 */

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. ` +
        `Check .env.local (local dev) or Vercel environment settings (preview/prod).`
    );
  }
  return value;
}

function optional(name: string): string | undefined {
  return process.env[name] || undefined;
}

export const env = {
  // Database
  DATABASE_URL: required("DATABASE_URL"),

  // Clerk Auth
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: required(
    "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"
  ),
  CLERK_SECRET_KEY: required("CLERK_SECRET_KEY"),

  // Stripe
  STRIPE_SECRET_KEY: optional("STRIPE_SECRET_KEY"),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: optional(
    "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
  ),
  STRIPE_CONNECT_CLIENT_ID: optional("STRIPE_CONNECT_CLIENT_ID"),
  STRIPE_WEBHOOK_SECRET: optional("STRIPE_WEBHOOK_SECRET"),

  // Encryption (required when Stripe keys are stored)
  STRIPE_KEY_ENCRYPTION_KEY: optional("STRIPE_KEY_ENCRYPTION_KEY"),

  // Every.org
  EVERY_ORG_API_KEY: optional("EVERY_ORG_API_KEY"),

  // App
  NEXT_PUBLIC_APP_URL:
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
} as const;

// Validate encryption key format if present
if (env.STRIPE_KEY_ENCRYPTION_KEY) {
  if (!/^[0-9a-f]{64}$/i.test(env.STRIPE_KEY_ENCRYPTION_KEY)) {
    throw new Error(
      "STRIPE_KEY_ENCRYPTION_KEY must be a 64-character hex string (32 bytes). " +
        'Generate one with: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"'
    );
  }
}
