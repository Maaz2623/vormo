"use client";
import React from "react";
import {
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import { items } from "@/constants";
import { useParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";

const SidebarLinks = () => {
  const params = useParams();

  const pathname = usePathname();

  console.log(pathname);

  return (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem
          key={item.title}
          className={cn(
            "",
            pathname.includes(item.tag) &&
              "text-green-500 bg-green-200/40 hover:bg-green-200 "
          )}
        >
          <SidebarMenuButton
            asChild
            className={cn("", pathname.includes(item.tag) && " ")}
          >
            <Link
              href={item.url.replace(
                ":slug",
                params.organizationSlug as string
              )}
            >
              <item.icon />
              <span
                className={cn(
                  "",
                  pathname.includes(item.tag) && "font-semibold"
                )}
              >
                {item.title}
              </span>
            </Link>
          </SidebarMenuButton>
          <SidebarMenuBadge
            className={cn(
              "",
              pathname.includes(item.tag) && "text-green-500 bg-green-200/80"
            )}
          >
            25
          </SidebarMenuBadge>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
};

export default SidebarLinks;
