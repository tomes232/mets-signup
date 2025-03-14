import { type ReactNode } from "react";
import { AppSidebar } from "./Sidebar";
import { SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarMenu, SidebarProvider } from "./ui/sidebar";
import { SidebarInset } from "./ui/sidebar";
import { SidebarTrigger } from "./ui/sidebar";
import { Link } from "@remix-run/react";
import { User } from "~/services/session.server";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuItem } from "./ui/dropdown-menu";

export default function LayoutWrapper({ children, user }: { children: ReactNode, user: User | null }) {
  return (
    <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b">
        <div className="flex items-center gap-2 px-3">
          <SidebarTrigger />
        </div>
        <div className="flex-1"></div>
        <div className="flex gap-2 px-3">
          <DropdownMenu>
          <DropdownMenuTrigger asChild>
          <Avatar>
            <AvatarImage src={user?.avatar_url || ''} />
            <AvatarFallback>
              {user?.name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
          <DropdownMenuLabel><p className="text-sm">{user?.email}</p></DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Link to={`/profile/${user?.id}`} className="w-full">
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link to="/signout" className="w-full">
              Sign Out
            </Link>

          </DropdownMenuItem>
          </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
        {children}
    </SidebarInset>
  </SidebarProvider>
);
}

