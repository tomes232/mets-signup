// app/routes/login.tsx
import { Form } from "@remix-run/react";
import { ActionFunctionArgs } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";
import { Label } from "~/components/ui/label";
import { redirect } from "@remix-run/node";
import { createSupabaseClientForServer } from "~/utils/supabase";

export let action = async ({ request }: ActionFunctionArgs) => {
    const headers = new Headers();
    const supabase = createSupabaseClientForServer(request, headers);

    let formData = await request.formData();
    let email = formData.get('email');
    let password = formData.get('password');
    let name = formData.get('name');
    let { data, error } = await supabase.auth.signUp({
        email: email as string,
        password: password as string,
        options: {
            data: {
                name: name as string
            },
            emailRedirectTo: 'http://localhost:5173/calendar'
        }
    })
    if (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 400 });
    }
    return redirect('/email-verification');

}
export default function Signup({
    className,
    ...props
  }: React.ComponentPropsWithoutRef<"div">) {
    return (
      <div className={cn("flex flex-col gap-6 w-[400px]", className)} {...props}>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Signup</CardTitle>
            <CardDescription>
              Enter your information below to create an account
            </CardDescription>
          </CardHeader>
          <CardContent>
              <div className="flex flex-col gap-6">
            <Form className="space-y-6" method="post">
            <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name" 
                      type="text"
                      placeholder="John Doe"
                      required
                    />
                  </div>
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
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" name="password" type="password" required />
                  </div>
                  <Button type="submit" className="w-full">
                    Signup
                  </Button>
                </Form>
                </div>
            </CardContent>
          </Card>
        </div>
    )     
}
