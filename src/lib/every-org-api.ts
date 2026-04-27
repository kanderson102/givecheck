/**
 * Every.org Partner API client.
 *
 * Used by the daily verification cron to reconcile donations for a company's
 * just-closed period. This is the "authoritative" side of our belt-and-
 * suspenders setup — the Partner Webhook handler (`/api/every-org/webhook`)
 * captures donations in real time, and this API poll backfills anything the
 * webhook missed.
 *
 * ⚠️  The exact endpoint shape (`/partner/donations?partnerDonorId=...`) is
 * still pending confirmation from Every.org — see the "Outreach to Every.org"
 * section in the P0.4 plan. If the call 404s or returns an unexpected shape,
 * we log to Sentry and return an empty list so verification falls back to the
 * webhook-ingested donations already in our DB. That keeps verification
 * working (possibly under-counting) rather than crashing.
 */

export interface EveryOrgDonationRecord {
  everyOrgId: string;
  amountCents: number;
  recipientName: string;
  recipientSlug: string;
  createdAt: Date;
  partnerDonorId: string | null;
}

const BASE_URL = "https://partners.every.org/v0.2";
const TIMEOUT_MS = 10_000;

function getApiKey(): string | null {
  const key = process.env.EVERY_ORG_API_KEY;
  if (!key) {
    console.warn("EVERY_ORG_API_KEY not set — skipping Partner API poll");
    return null;
  }
  return key;
}

async function fetchWithTimeout(url: string, init: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Fetches all donations tagged with the given `partnerDonorId` within a
 * window. Paginates until the API signals no more results. Returns [] on
 * error (see file-level comment).
 */
export async function fetchDonationsForCompany(
  partnerDonorId: string,
  windowStart: Date,
  windowEnd: Date
): Promise<EveryOrgDonationRecord[]> {
  const apiKey = getApiKey();
  if (!apiKey) return [];

  const results: EveryOrgDonationRecord[] = [];
  let cursor: string | undefined;
  let pageCount = 0;
  const MAX_PAGES = 20; // safety cap

  try {
    while (pageCount < MAX_PAGES) {
      const params = new URLSearchParams({
        partnerDonorId,
        startDate: windowStart.toISOString(),
        endDate: windowEnd.toISOString(),
        ...(cursor ? { cursor } : {}),
      });

      const url = `${BASE_URL}/partner/donations?${params.toString()}`;
      const res = await fetchWithTimeout(url, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          Accept: "application/json",
        },
      });

      if (!res.ok) {
        console.error(
          `every-org-api: ${res.status} ${res.statusText} for ${url} — falling back to webhook data`
        );
        return results;
      }

      const data = (await res.json()) as {
        donations?: Array<Record<string, unknown>>;
        nextCursor?: string;
      };

      for (const d of data.donations ?? []) {
        const record = parseDonation(d);
        if (record) results.push(record);
      }

      if (!data.nextCursor) break;
      cursor = data.nextCursor;
      pageCount += 1;
    }
  } catch (err) {
    console.error("every-org-api: request failed", err);
    return results;
  }

  return results;
}

function parseDonation(raw: Record<string, unknown>): EveryOrgDonationRecord | null {
  // Every.org's exact field names pending confirmation. Accept a few common
  // shapes defensively.
  const id = (raw.id ?? raw.donationId ?? raw.everyOrgId) as string | undefined;
  const amountCents = coerceCents(raw.amountCents ?? raw.amount ?? raw.amountInCents);
  const recipientName = (raw.recipientName ?? raw.nonprofitName ?? raw.recipient) as
    | string
    | undefined;
  const recipientSlug = (raw.recipientSlug ?? raw.nonprofitSlug ?? raw.slug) as
    | string
    | undefined;
  const createdAtRaw = (raw.createdAt ?? raw.date ?? raw.timestamp) as string | undefined;
  const partnerDonorId = (raw.partnerDonorId ?? raw.externalDonorId ?? null) as string | null;

  if (!id || amountCents === null || !recipientName || !recipientSlug || !createdAtRaw) {
    return null;
  }

  const createdAt = new Date(createdAtRaw);
  if (isNaN(createdAt.getTime())) return null;

  return {
    everyOrgId: id,
    amountCents,
    recipientName,
    recipientSlug,
    createdAt,
    partnerDonorId,
  };
}

function coerceCents(v: unknown): number | null {
  if (typeof v === "number") {
    // If value looks like dollars (< 100_000), convert. Otherwise assume cents.
    return v < 100_000 && !Number.isInteger(v) ? Math.round(v * 100) : Math.round(v);
  }
  if (typeof v === "string") {
    const n = Number(v);
    return isNaN(n) ? null : Math.round(n);
  }
  return null;
}
