"use client";

import React, { useState } from "react";
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "../ui/sidebar";
import { ChevronDownIcon, PlusIcon } from "lucide-react";
import { Button } from "../ui/button";

import { useParams } from "next/navigation";
import { useGetOrganizationBySlug } from "@/features/organizations/api/use-get-organization-by-slug";
import OrganizationSearchDialog from "./organization-search-dialog";
import { cn } from "@/lib/utils";
import { useCreateOrganizationStore } from "@/features/organizations/store/use-create-organization-store";

const OrganizationSwitcher = ({
  email,
}: {
  name: string;
  userId: string;
  email: string;
}) => {
  const { state } = useSidebar();

  const [searchDialog, setSearchDialog] = useState(false);

  const [, setOpen] = useCreateOrganizationStore();

  const params = useParams();

  const { data: currentOrganization } = useGetOrganizationBySlug(
    params.organizationSlug as string
  );

  return (
    <>
      <OrganizationSearchDialog
        searchDialog={searchDialog}
        setSearchDialog={setSearchDialog}
        email={email}
      />
      <SidebarHeader className="rounded-lg bg-white" id="sidebar-header">
        <SidebarMenu className="flex flex-col gap-y-2">
          <SidebarMenuItem className="">
            <Button
              onClick={() => setSearchDialog(true)}
              className={cn(
                "w-full flex justify-between items-center",
                state === "collapsed" && "flex justify-center items-center"
              )}
              variant={`secondary`}
            >
              <div className="h-full bg-neutral-500 rounded-full aspect-square" />
              {state === "expanded" && (
                <>
                  <p className="w-full truncate transition-all duration-500 transform">
                    {currentOrganization?.name}
                  </p>
                  <ChevronDownIcon />
                </>
              )}
            </Button>
          </SidebarMenuItem>
          <SidebarMenuItem className="">
            <Button
              onClick={() => setOpen(true)}
              className={cn(
                "w-full flex justify-start items-center",
                state === "collapsed" && "flex justify-center items-center"
              )}
              variant={`outline`}
            >
              <PlusIcon />
              {state === "expanded" && (
                <p className="transition-all duration-500 transform w-full truncate">
                  Create organization
                </p>
              )}
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
    </>
  );
};

export default OrganizationSwitcher;
