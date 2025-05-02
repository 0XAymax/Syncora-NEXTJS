import React from "react";
import { type LucideIcon } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import UserProfileSheet from "@/components/profileComponents/user-profile";

export function NavSecondary({
  items,
  ...props
}: {
  items: {
    title: string;
    url: string;
    icon: LucideIcon;
    badge?: React.ReactNode;
    hasButton: boolean;
  }[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                {item.hasButton ? (
                    <UserProfileSheet>
                      <div className="flex items-center gap-2 text-primary rounded-md hover:bg-sidebar-accent w-[240px] h-8 cursor-pointer">
                        <item.icon className="h-4 w-4 ml-2 " />
                        <span>{item.title}</span>
                      </div>
                    </UserProfileSheet>
                ):(
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  )}
              </SidebarMenuButton>
              {item.badge && <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
