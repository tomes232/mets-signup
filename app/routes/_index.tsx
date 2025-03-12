import type { MetaFunction } from "@remix-run/node";
import { Form, Link } from "@remix-run/react";
import metsLogo from '~/assets/mets-logo.png';
import { Button } from "~/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
// import { Badge } from "~/components/ui/badge";


export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {

  
    return (
      <div className="min-h-screen bg-gradient-to-r from-blue-900 to-orange-500 text-white">
        {/* Header with Mets logo and navigation */}
        {/* Main hero section */}
        <main className="flex flex-col items-center justify-center flex-1 px-4">
          <div className="text-center my-8">
            <h2 className="text-4xl font-extrabold">Welcome Mets Fans!</h2>
            <p className="mt-4 text-lg">
              Your one-stop hub for all things Mets. Stay updated with game stats,
              news, and exclusive content.
            </p>
          </div>
  
          {/* Featured Card using shadcn UI components */}
          <Card className="max-w-md w-full bg-white text-black shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">
                {/* Game Day Special <Badge className="ml-2">Live</Badge> */}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Don't miss the excitement! Check out our latest game highlights
                and upcoming events.
              </p>
              <div className="mt-4 flex justify-center">
                <Link to="/calendar">
                <Button variant="default">Explore Now</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </main>
  
        {/* Footer */}
        <footer className="p-4 text-center">
          <p>&copy; {new Date().getFullYear()} Mets Mania. All rights reserved.</p>
        </footer>
      </div>
    );
  }


export function ErrorBoundary() {
  return (
    <div>
      <h1>Error</h1>
    </div>
  );
}