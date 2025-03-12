// app/routes/login.tsx
import { Form } from "@remix-run/react";
import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";
import { Label } from "~/components/ui/label";
import { createSupabaseClientForServer } from "~/utils/supabase";

export let action = async ({ request }: ActionFunctionArgs) => {
    const headers = new Headers();
    const supabase = createSupabaseClientForServer(request, headers);

    let formData = await request.formData();
    let email = formData.get('email');
    let password = formData.get('password');

    let { data, error } = await supabase.auth.signInWithPassword({
        email: email as string,
        password: password as string
    })

    if (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 400 });
    }

    return redirect('/calendar', { headers })
}
export default function Login({
    className,
    ...props
  }: React.ComponentPropsWithoutRef<"div">) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Enter your email below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
              <div className="flex flex-col gap-6">
          <Form className="space-y-6" method="post">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email" 
                    type="email"
                    placeholder="m@example.com"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <a
                      href="#"
                      className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </a>
                  </div>
                  <Input id="password" name="password" type="password" required />
                </div>
                <Button type="submit" className="w-full">
                  Login
                </Button>
              </Form>
                <Link to="/auth/google">
                <Button variant="outline" className="w-full">
                  Login with Google
                </Button>
                </Link>
              </div>
              <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link to="/signup" className="underline underline-offset-4">
                  Sign up
                </Link>
              </div>
          </CardContent>
        </Card>
      </div>
    )     
}
