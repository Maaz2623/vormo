import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import UserButton from "./user-button";
import { auth } from "@/auth";
import OrganizationSwitcher from "./organization-switcher";
import { getUserData } from "@/lib/upstash/cache";
import SidebarLinks from "./sidebar-links";

// Menu items.

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
      <SidebarContent className="rounded-lg mt-1">
        <SidebarGroup className="rounded-lg bg-white">
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarLinks />
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
