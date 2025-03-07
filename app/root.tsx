import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  redirect,
} from "@remix-run/react";
import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { getUserId } from "./services/session.server";
import { createClient } from '@supabase/supabase-js'
import "./tailwind.css";
import { Toaster } from "~/components/ui/sonner";
import LayoutWrapper from "~/components/Layout";
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
  const requestUrl = new URL(request.url)

  const userId = await getUserId(request);

  // Get the current URL path
  const url = new URL(request.url);
  const path = url.pathname;
  
  // If user is not logged in and not on login/signup pages, redirect to login
  if (!userId && !path.match(/^\/(login|signup|auth\/callback|$)/)) {
    const searchParams = new URLSearchParams([
      ["redirectTo", path]
    ]);
    return redirect(`/login?${searchParams}`);
  }
  
  return { userId };
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

  return (
    <div className="flex flex-row">
      <LayoutWrapper>
        <Outlet />
      </LayoutWrapper>
    </div>
  );
}
