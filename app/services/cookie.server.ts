import { createCookie } from "@remix-run/node";

const cookie = createCookie("app-cookie", {
  secrets: [process.env.COOKIE_SECRET ?? "default-secret"],
  sameSite: "lax",
  maxAge: 60 * 60 * 24 * 30, // 30 days
  secure: process.env.NODE_ENV === "production",
});

export async function getItem(request: Request, key: string) {
  const cookieHeader = request.headers.get("Cookie");
  const parsedCookie = await cookie.parse(cookieHeader);
  return parsedCookie?.[key];
}

export async function setItem(key: string, value: any) {
  const cookieValue = { [key]: value };
  return cookie.serialize(cookieValue);
}

export async function removeItem(key: string) {
  return cookie.serialize({ [key]: null }, { maxAge: 0 });
}

export async function commitCookieHeaders(cookieHeader: string) {
  return new Headers({
    "Set-Cookie": cookieHeader,
  });
} 