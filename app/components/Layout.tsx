import { type ReactNode } from "react";
import { AppSidebar } from "./Sidebar";
import { SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarMenu, SidebarProvider } from "./ui/sidebar";
import { SidebarInset } from "./ui/sidebar";
import { SidebarTrigger } from "./ui/sidebar";
import { GalleryVerticalEnd } from "lucide-react";
import { Separator } from "./ui/separator";
interface LayoutProps {
children: ReactNode;
}

export default function LayoutWrapper({ children }: LayoutProps) {
return (
    <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b">
        <div className="flex items-center gap-2 px-3">
          <SidebarTrigger />
        </div>
      </header>
        {children}
    </SidebarInset>
  </SidebarProvider>
);
}

