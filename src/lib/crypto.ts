import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;

function getKey(): Buffer {
  const hex = process.env.STRIPE_KEY_ENCRYPTION_KEY;
  if (!hex || hex.length !== 64) {
    throw new Error(
      "STRIPE_KEY_ENCRYPTION_KEY must be a 64-char hex string (32 bytes). " +
        "Generate one with: node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\""
    );
  }
  return Buffer.from(hex, "hex");
}

/**
 * Encrypts a plaintext string (e.g. a Stripe restricted key) using
 * AES-256-GCM. Returns a single base64 string: iv + authTag + ciphertext.
 */
export function encrypt(plaintext: string): string {
  const key = getKey();
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv);

  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();

  // Pack iv (12) + authTag (16) + ciphertext into one buffer
  const packed = Buffer.concat([iv, authTag, encrypted]);
  return packed.toString("base64");
}

/**
 * Decrypts a value produced by `encrypt()`.
 */
export function decrypt(packed64: string): string {
  const key = getKey();
  const packed = Buffer.from(packed64, "base64");

  const iv = packed.subarray(0, IV_LENGTH);
  const authTag = packed.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
  const ciphertext = packed.subarray(IV_LENGTH + AUTH_TAG_LENGTH);

  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]);
  return decrypted.toString("utf8");
}

/**
 * Returns true if the value looks like an encrypted blob (base64, no rk_ prefix).
 * Used to handle the migration period where old rows may still have plaintext keys.
 */
export function isEncrypted(value: string): boolean {
  return !value.startsWith("rk_");
}

/**
 * Safely gets the decrypted Stripe key, handling both encrypted and
 * legacy plaintext values during the migration period.
 */
export function getStripeKey(storedValue: string): string {
  if (isEncrypted(storedValue)) {
    return decrypt(storedValue);
  }
  // Legacy plaintext — still works but should be re-encrypted
  return storedValue;
}
