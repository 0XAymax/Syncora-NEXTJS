"use client";
import { NavRecent } from "@/components/nav-recent";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import * as React from "react";
import Logo from "./Logo";
import {
  Building,
  Calendar,
  Inbox,
  LayoutDashboard,
  LogOut,
  Settings2,
  User, UserRound,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useWorkspaces } from "@/context/WorkspaceContext";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Inbox",
      url: "/dashboard/inbox",
      icon: Inbox,
    },
    {
      title: "My Workspaces",
      url: "/dashboard/workspace",
      icon: Building,
      hasDropdown: true,
      dropdownItems: [] as {
        name: string;
        url: string;
        active: boolean;
        icon?: string;
      }[],
    },
    {
      title: "Personal",
      url: "/dashboard/workspace",
      icon: User,
      hasDropdown: true,
      dropdownItems: [] as {
        name: string;
        url: string;
        active: boolean;
        icon?: string;
      }[],
    },
  ],
  navSecondary: [
    {
      title: "Profile",
      url: "", //no need
      icon: UserRound,
      hasButton : true,
    },
    {
      title: "Calendar",
      url: "#calendar",
      icon: Calendar,
      hasButton : false,
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings2,
      hasButton : false,
    },
    {
      title: "Logout",
      url: "/logout",
      icon: LogOut,
      hasButton : false,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { workspaces } = useWorkspaces();
  const publicWorkspaces = workspaces.filter(
    (workspace) => workspace.isPersonal == false
  );
  const personalWorkspaces = workspaces.filter(
    (workspace) => workspace.isPersonal == true
  );
  const updatedNavMain = React.useMemo(() => {
    return data.navMain.map((item) => {
      if (item.hasDropdown && item.title == "My Workspaces") {
        item.dropdownItems = publicWorkspaces.map((workspace) => ({
          name: workspace.name,
          url: `/dashboard/workspace/${workspace.id}`,
          active: workspace.id === "someDefaultWorkspaceId",
          icon: workspace.icon,
        }));
      }
      if (item.hasDropdown && item.title == "Personal") {
        item.dropdownItems = personalWorkspaces.map((workspace) => ({
          name: workspace.name,
          url: `/dashboard/workspace/${workspace.id}`,
          active: workspace.id === "someDefaultWorkspaceId",
          icon: workspace.icon,
        }));
      }
      return item;
    });
  }, [personalWorkspaces, publicWorkspaces]);

  return (
    <Sidebar className="border-r-0" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2">
          <Logo isText={true} width={100} hasBottomGutter={true} />
        </div>
        <NavMain items={updatedNavMain} />
      </SidebarHeader>
      <SidebarContent>
        <NavRecent />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
