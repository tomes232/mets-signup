import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  redirect,
  useLoaderData,
} from "@remix-run/react";
import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import "./tailwind.css";
import { Toaster } from "~/components/ui/sonner";
import LayoutWrapper from "~/components/Layout";
import { createSupabaseClientForServer } from "~/utils/supabase";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export const loader: LoaderFunction = async ({ request }) => {
  const supabase = createSupabaseClientForServer(request, new Headers());
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userId = user?.id;
  // Get the current URL path
  const url = new URL(request.url);
  const path = url.pathname;

  // If user is not logged in and not on login/signup pages, redirect to login
  if (
    !userId &&
    !path.match(
      /^\/(login|signup|auth\/callback|auth\/google|email-verification|$)/
    )
  ) {
    const searchParams = new URLSearchParams([["redirectTo", path]]);
    return redirect(`/login?${searchParams}`);
  }

  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select("id, name, email, avatar_url, is_admin")
    .eq("id", userId);

  if (profileError) {
    console.error("Unable to get profle information");
    return {
      user: {
        id: user?.id || "",
        email: user?.email || "",
        name: user?.user_metadata?.name || "",
        avatar_url: user?.user_metadata?.avatar_url,
        is_admin: false,
      },
    };
  } else {
    const userInfo = profileData[0];
    return {
      user: {
        id: userInfo?.id,
        name: userInfo?.name,
        email: userInfo?.email,
        avatar_url: userInfo?.avatar_url,
        is_admin: userInfo?.is_admin,
      },
    };
  }
};

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        <Toaster />
      </body>
    </html>
  );
}

export default function App() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <>
      {user?.id ? (
        <div className="flex flex-row">
          {" "}
          <LayoutWrapper user={user}>
            <Outlet />
          </LayoutWrapper>
        </div>
      ) : (
        <div className="min-h-screen bg-gradient-to-r from-blue-900 to-orange-500 text-white">
          {" "}
          <div className="flex items-center justify-center min-h-screen">
            <Outlet />
          </div>{" "}
        </div>
      )}
    </>
  );
}
