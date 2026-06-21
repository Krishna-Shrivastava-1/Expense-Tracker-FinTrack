// app/(protected)/layout.js
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "@/components/ModeToggle";

export default function ProtectedLayout({ children }) {
  return (
    <SidebarProvider>
      {/* The Sidebar component */}
      <AppSidebar />

      <SidebarInset>
        {/* Top Sticky/Fixed Navbar */}
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
          <div className="flex items-center justify-between w-full gap-2">
            {/* The structural toggle button (handles mobile drawer & desktop collapse) */}
            <div className="flex items-center">
<SidebarTrigger className="-ml-3" />
            
            <Separator orientation="vertical" className="mr-2 h-4" />
            
            {/* Optional Breadcrumbs or Application Title text space */}
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm tracking-tight text-muted-foreground">
                Workspace
              </span>
            </div>
            </div>
            
            <ModeToggle />
          </div>
        </header>

        {/* Dynamic Main Workspace Content Wrapper */}
        <main className="flex-1">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}