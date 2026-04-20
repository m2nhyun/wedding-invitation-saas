import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { getOptionalEnv } from "@/lib/env";

const ADMIN_SESSION_COOKIE = "wedding_admin_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

function getSessionSecret() {
  return getOptionalEnv("ADMIN_SESSION_SECRET") ?? "local-development-session-secret-change-me";
}

function sign(value: string) {
  return createHmac("sha256", getSessionSecret()).update(value).digest("base64url");
}

function createSessionValue() {
  const issuedAt = Date.now().toString();
  return `${issuedAt}.${sign(issuedAt)}`;
}

function verifySessionValue(value: string) {
  const [issuedAt, signature] = value.split(".");

  if (!issuedAt || !signature) {
    return false;
  }

  const issuedAtNumber = Number(issuedAt);
  if (!Number.isFinite(issuedAtNumber)) {
    return false;
  }

  if (Date.now() - issuedAtNumber > SESSION_MAX_AGE_SECONDS * 1000) {
    return false;
  }

  const expected = sign(issuedAt);
  const expectedBuffer = Buffer.from(expected);
  const signatureBuffer = Buffer.from(signature);

  return (
    expectedBuffer.length === signatureBuffer.length &&
    timingSafeEqual(expectedBuffer, signatureBuffer)
  );
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  return session ? verifySessionValue(session) : false;
}

export async function setAdminSession() {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, createSessionValue(), {
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

export function verifyAdminPassword(password: string) {
  const configuredPassword = getOptionalEnv("ADMIN_PASSWORD") ?? "jjym0818";
  return password === configuredPassword;
}
