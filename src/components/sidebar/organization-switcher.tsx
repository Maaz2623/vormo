"use client";
import React, { useState } from "react";
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ChevronDown, PlusCircleIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { createOrganization } from "@/db/actions";

const OrganizationSwitcher = ({
  name,
  userId,
}: {
  name: string;
  userId: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const [organizationName, setOrganizationName] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  Select Workspace
                  <ChevronDown className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[--radix-popper-anchor-width]">
                <DropdownMenuItem>
                  <span>Acme Inc</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Acme Corp.</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setIsOpen(true)}>
                  <PlusCircleIcon className="size-6" />
                  <p className="font-medium">Create Organization</p>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader className="mb-2">
            <DialogTitle className="text-2xl -mb-2">
              Create Organization
            </DialogTitle>
            <DialogDescription>
              Manage your own organizations and manage events and much more.
            </DialogDescription>
          </DialogHeader>
          <label className="text-sm font-semibold -mb-2">
            Organization Name
          </label>
          <Input
            disabled={isLoading}
            placeholder={`e.g. ${name}'s organization`}
            className=""
            onChange={(e) => setOrganizationName(e.target.value)}
          />
          <DialogFooter>
            <Button
              disabled={isLoading}
              onClick={() => {
                setIsLoading(true);
                createOrganization({
                  organizationName,
                  userId,
                });
                setIsOpen(false);
                setIsLoading(false);
              }}
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default OrganizationSwitcher;
