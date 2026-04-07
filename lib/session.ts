export const AUTH_COOKIE_NAME = process.env.AUTH_COOKIE_NAME || "dealer_session";

export type SessionPayload = {
  userId: string;
  role: "ADMIN" | "SALES";
};

const encodeBase64Url = (value: string) =>
  Buffer.from(value, "utf8").toString("base64url");

const decodeBase64Url = (value: string) =>
  Buffer.from(value, "base64url").toString("utf8");

export function encodeSession(payload: SessionPayload) {
  return encodeBase64Url(JSON.stringify(payload));
}

export function decodeSession(value: string | undefined): SessionPayload | null {
  if (!value) return null;

  try {
    return JSON.parse(decodeBase64Url(value)) as SessionPayload;
  } catch {
    return null;
  }
}
