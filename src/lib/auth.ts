export const SESSION_COOKIE = "cowva_session";
export const USER_COOKIE = "cowva_user";

export type AdminUser = {
  name: string;
  email: string;
  role: "admin";
};

/**
 * Mock credential store. This is the ONLY place auth is faked.
 * In Stage 7 this is replaced by a call to the Django JWT login endpoint,
 * which only issues a token if the user is a Cowva staff/admin account.
 */
const DEMO_ADMINS: Record<string, { password: string; name: string }> = {
  "admin@cowva.com": { password: "cowva2026", name: "Cowva Admin" },
};

export function verifyCredentials(
  email: string,
  password: string
): AdminUser | null {
  const record = DEMO_ADMINS[email.trim().toLowerCase()];
  if (!record || record.password !== password) return null;
  return { name: record.name, email: email.trim().toLowerCase(), role: "admin" };
}

export function encodeUser(user: AdminUser): string {
  return encodeURIComponent(JSON.stringify(user));
}

export function decodeUser(raw: string | undefined): AdminUser | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(decodeURIComponent(raw));
    if (parsed && parsed.email && parsed.role === "admin") return parsed;
    return null;
  } catch {
    return null;
  }
}
