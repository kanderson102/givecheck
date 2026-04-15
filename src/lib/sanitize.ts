/**
 * Sanitize user-submitted text by stripping HTML/script tags.
 * Prevents stored XSS when text is rendered in the UI.
 *
 * This is a lightweight approach — strips tags but preserves the text content.
 * For rich text fields, use a proper HTML sanitizer like DOMPurify.
 */
export function stripHtml(input: string): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<[^>]*>/g, "")
    .trim();
}
