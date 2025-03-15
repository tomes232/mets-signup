// app/routes/auth.google.tsx
import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { createSupabaseClientForServer } from "../utils/supabase";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const headers = new Headers();

  const supabase = createSupabaseClientForServer(request, headers);
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${!process.env.GOOGLE_REDIRECT_URL}`,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  // This will redirect to Google's authentication page
  return redirect(data.url, { headers });
};
