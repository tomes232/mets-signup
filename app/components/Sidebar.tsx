import { Link } from "@remix-run/react";
import { Home, Calendar, Ticket } from "lucide-react";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Sidebar, SidebarHeader, SidebarMenu } from "~/components/ui/sidebar";

interface User {
  is_admin: boolean;
  // ...other user props
}

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  user?: User;
}

export function AppSidebar({ className, user, ...props }: SidebarProps) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <div className={cn("pb-12 w-[220px] h-screen", className)} {...props}>
            <div className="space-y-4 py-4">
              <div className="px-4 py-2">
                <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
                  Navigation
                </h2>
                <div className="space-y-1">
                  <Button
                    asChild
                    variant="ghost"
                    className="w-full justify-start"
                  >
                    <Link to="/">
                      <Home className="mr-2 h-4 w-4" />
                      Home
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="ghost"
                    className="w-full justify-start"
                  >
                    <Link to="/schedule">
                      <Calendar className="mr-2 h-4 w-4" />
                      Schedule
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="ghost"
                    className="w-full justify-start"
                  >
                    <Link to="/my-tickets">
                      <Ticket className="mr-2 h-4 w-4" />
                      My Tickets
                    </Link>
                  </Button>
                  {user?.is_admin && (
                    <Button
                      asChild
                      variant="ghost"
                      className="w-full justify-start"
                    >
                      <Link to="/requests">
                        <Ticket className="mr-2 h-4 w-4" />
                        Requests
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </SidebarMenu>
      </SidebarHeader>
    </Sidebar>
  );
}
