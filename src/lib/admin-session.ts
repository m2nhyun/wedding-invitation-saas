import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { getOptionalEnv } from "@/lib/env";

const ADMIN_SESSION_COOKIE = "wedding_admin_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

function getSessionSecret() {
  return getOptionalEnv("ADMIN_SESSION_SECRET") ?? "local-development-session-secret-change-me";
}

function getAdminCodeSecret() {
  return getOptionalEnv("ADMIN_CODE_SECRET") ?? getSessionSecret();
}

function sign(value: string) {
  return createHmac("sha256", getSessionSecret()).update(value).digest("base64url");
}

export function hashAdminCode(code: string) {
  return createHmac("sha256", getAdminCodeSecret()).update(code.trim()).digest("hex");
}

export function getAdminCodeHashCandidates(code: string) {
  const normalizedCode = code.trim();

  return [
    hashAdminCode(normalizedCode),
    createHash("sha256").update(normalizedCode).digest("hex"),
  ];
}

function createSessionValue(slug: string) {
  const issuedAt = Date.now().toString();
  const payload = `${issuedAt}.${slug}`;
  return `${payload}.${sign(payload)}`;
}

function verifySessionValue(value: string) {
  const [issuedAt, slug, signature] = value.split(".");

  if (!issuedAt || !slug || !signature) {
    return undefined;
  }

  const issuedAtNumber = Number(issuedAt);
  if (!Number.isFinite(issuedAtNumber)) {
    return undefined;
  }

  if (Date.now() - issuedAtNumber > SESSION_MAX_AGE_SECONDS * 1000) {
    return undefined;
  }

  const payload = `${issuedAt}.${slug}`;
  const expected = sign(payload);
  const expectedBuffer = Buffer.from(expected);
  const signatureBuffer = Buffer.from(signature);

  if (
    expectedBuffer.length !== signatureBuffer.length ||
    !timingSafeEqual(expectedBuffer, signatureBuffer)
  ) {
    return undefined;
  }

  return slug;
}

export async function getAdminSessionSlug() {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  return session ? verifySessionValue(session) : undefined;
}

export async function isAdminAuthenticated(slug?: string) {
  const sessionSlug = await getAdminSessionSlug();

  if (!sessionSlug) {
    return false;
  }

  return slug ? sessionSlug === slug : true;
}

export async function setAdminSession(slug: string) {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, createSessionValue(slug), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
}
