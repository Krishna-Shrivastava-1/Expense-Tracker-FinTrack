// components/AppSidebar.jsx
"use client"

import * as React from "react"
import { usePathname } from "next/navigation"

// 1. Import TooltipProvider from your components folder
import { TooltipProvider } from "@/components/ui/tooltip" 

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { IconLayoutDashboard, IconUser, IconSettings, IconWallet } from "@tabler/icons-react"
import LogoutButton from "./LogoutButton"


const navigationItems = [
  { title: "Dashboard", url: "/dashboard", icon: IconLayoutDashboard },
  { title: "Profile", url: "/dashboard/profile", icon: IconUser },
  { title: "Settings", url: "/dashboard/settings", icon: IconSettings },
]

export function AppSidebar({ ...props }) {
  const pathname = usePathname()

  return (
    // 2. Wrap the entire tree inside the TooltipProvider
    <TooltipProvider delayDuration={0}>
      <Sidebar {...props}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <a href="/">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <IconWallet className="size-4 text-white" />
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="font-semibold text-sm">XpenseHub</span>
                    <span className="text-xs text-muted-foreground">Expense Tracker</span>
                  </div>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              
              {navigationItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.url

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive}
                      tooltip={item.title} // This now works safely!
                    >
                      <a href={item.url} className="flex items-center gap-3">
                        <Icon className="size-4 shrink-0" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
              <LogoutButton />
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
    </TooltipProvider>
  )
}