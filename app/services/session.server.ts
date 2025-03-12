import { createCookieSessionStorage, redirect, Session } from "@remix-run/node";

// create User model
export type User = {
    id: string;
    email: string;
    name: string;
    avatar_url: any
}

// Session secret should be an environment variable in production
const sessionSecret = process.env.SESSION_SECRET || "s3cr3t";

if (!sessionSecret) {
throw new Error("SESSION_SECRET must be set");
}


export const sessionStorage = createCookieSessionStorage({
cookie: {
    name: "mets_signup_session",
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    httpOnly: true,
},
});

// Helper function to get the session from the request
export async function getSession(request: Request) {
const cookie = request.headers.get("Cookie");
return sessionStorage.getSession(cookie);
}

export async function getUser(request: Request) {
    const session = await getSession(request);
    const userId = session.get("userId");
    if (!userId || typeof userId !== "string") return null;
    const email = session.get("email");
    const name = session.get("name");

    return { id: userId, email, name };
}


// Create a user session
export async function createUserSession({
request,
userId,
email,
name,
remember,
redirectTo,
}: {
request: Request;
userId: string;
email: string;
name: string;
remember: boolean;
redirectTo: string;
}) {
const session = await getSession(request);
session.set("userId", userId);
session.set("email", email);
session.set("name", name);

return redirect(redirectTo, {
    headers: {
    "Set-Cookie": await sessionStorage.commitSession(session, {
        maxAge: remember
        ? 60 * 60 * 24 * 7 // 7 days
        : undefined,
    }),
    },
});
}

// Get the logged in user ID from the session
export async function getUserId(request: Request) {
const session = await getSession(request);
const userId = session.get("userId");
if (!userId || typeof userId !== "string") return null;
return userId;
}

// Check if a user is logged in, and redirect to login if not
export async function requireUserId(
request: Request,
redirectTo: string = new URL(request.url).pathname
) {
const userId = await getUserId(request);
if (!userId) {
    const searchParams = new URLSearchParams([
    ["redirectTo", redirectTo],
    ]);
    throw redirect(`/login?${searchParams}`);
}
return userId;
}

// Log out a user by destroying their session
export async function logout(request: Request, redirectTo: string = "/") {
const session = await getSession(request);
return redirect(redirectTo, {
    headers: {
    "Set-Cookie": await sessionStorage.destroySession(session),
    },
});
}
