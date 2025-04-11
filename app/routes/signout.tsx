import { LoaderFunctionArgs } from "@remix-run/node";
import { logout } from "~/services/session.server";
import { createSupabaseClientForServer } from "~/utils/supabase";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const headers = new Headers();
  const supabase = createSupabaseClientForServer(request, headers);
  await supabase.auth.signOut();
  return logout(request, "/login");
};

export default function SignOut() {
  return (
    <div>
      <h1>Signing out</h1>
    </div>
  );
}
