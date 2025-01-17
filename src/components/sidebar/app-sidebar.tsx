import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import UserButton from "./user-button";
import { auth } from "@/auth";
import OrganizationSwitcher from "./organization-switcher";
import { getUserData } from "@/lib/upstash/cache";

// Menu items.
const items = [
  {
    title: "Home",
    url: "#",
    icon: Home,
  },
  {
    title: "Inbox",
    url: "#",
    icon: Inbox,
  },
  {
    title: "Calendar",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
];

export async function AppSidebar() {
  const session = await auth();

  if (!session || !session.user || !session.user.email) return;

  const currentUser = await getUserData(session.user.email);

  return (
    <Sidebar collapsible="icon" variant="inset" className="">
      <OrganizationSwitcher
        name={`${currentUser.firstName}`}
        userId={currentUser.id}
        email={currentUser.email}
      />
      <SidebarContent className="rounded-lg">
        <SidebarGroup className="rounded-lg bg-white">
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                  <SidebarMenuBadge className="bg-gray-200">
                    25
                  </SidebarMenuBadge>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <UserButton
        type="sidebar"
        name={`${currentUser.firstName} ${currentUser.lastName}`}
        email={currentUser.email}
        image={currentUser.picture}
      />
    </Sidebar>
  );
}
