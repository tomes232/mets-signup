import { type ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarMenu, SidebarProvider } from "./ui/sidebar";
import { SidebarInset } from "./ui/sidebar";
import { SidebarTrigger } from "./ui/sidebar";
import { GalleryVerticalEnd } from "lucide-react";

interface LayoutProps {
children: ReactNode;
}

export default function LayoutWrapper({ children }: LayoutProps) {
return (
    <SidebarProvider>
    <Sidebar />
    <SidebarInset>
        {children}
    </SidebarInset>
    <header className="flex h-16 shrink-0 items-center gap-2 border-b ">
          <div className="flex items-center gap-2 px-3 left-0">
            <SidebarTrigger />
          </div>
    </header>

  </SidebarProvider>
);
}

