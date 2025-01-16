"use client";

import React, { useState, useRef } from "react";
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
import {
  CheckIcon,
  ChevronDown,
  Loader2Icon,
  PlusCircleIcon,
  XIcon,
} from "lucide-react";
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
import { checkSlug, createOrganization } from "@/db/actions";

const OrganizationSwitcher = ({
  name,
  userId,
}: {
  name: string;
  userId: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [organizationName, setOrganizationName] = useState("");
  const [slug, setSlug] = useState("");
  const [isSlugValid, setIsSlugValid] = useState<
    boolean | "invalid-format" | null
  >(null); // true, false, or null for "not checked"
  const [isChecking, setIsChecking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleCreateOrganization = async () => {
    if (organizationName.trim() === "" || slug.trim() === "" || !isSlugValid) {
      return;
    }

    setIsLoading(true);

    try {
      await createOrganization({
        organizationName: organizationName.trim(),
        userId,
        organizationSlug: slug.trim(),
      });
      setIsOpen(false);
      setOrganizationName("");
      setSlug("");
    } catch (error) {
      console.error("Error creating organization:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSlugChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setSlug(value);

    // Clear any previous timeout
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    // Set a new timeout
    debounceTimeout.current = setTimeout(async () => {
      // Validate slug: letters, numbers, hyphens only, no consecutive hyphens, and no hyphens at start/end
      const isValidFormat =
        /^[a-zA-Z0-9]+(-[a-zA-Z0-9]+)*$/.test(value) && !/[\/]/.test(value);

      if (!isValidFormat) {
        setIsSlugValid("invalid-format");
        return;
      }

      setIsChecking(true);

      try {
        const result = await checkSlug(value);
        setIsSlugValid(result);
      } catch (error) {
        console.error("Error checking slug validity:", error);
        setIsSlugValid(false);
      } finally {
        setIsChecking(false);
      }
    }, 500); // 500ms debounce delay
  };

  const getSlugMessage = () => {
    if (isSlugValid === "invalid-format") {
      return (
        <p className="text-sm text-rose-600 mt-1">
          Slug can only contain letters, numbers, and hyphens, must not
          start/end with a hyphen, and cannot have consecutive hyphens.
        </p>
      );
    }

    if (isSlugValid === false && slug.length > 0 && !isChecking) {
      return (
        <p className="text-sm text-rose-600 mt-1">
          This slug is already taken. Please choose another.
        </p>
      );
    }

    if (isSlugValid === true && slug.length > 0 && !isChecking) {
      return (
        <p className="text-sm text-green-600 mt-1">This slug is available.</p>
      );
    }

    return null;
  };

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
              Manage your organizations and events seamlessly.
            </DialogDescription>
          </DialogHeader>
          <div>
            <label className="text-sm font-semibold mb-1 block">
              Organization Name
            </label>
            <Input
              disabled={isLoading}
              placeholder={`e.g. ${name}'s organization`}
              value={organizationName}
              onChange={(e) => setOrganizationName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreateOrganization();
              }}
            />
          </div>
          <div className="mt-4">
            <label className="text-sm font-semibold mb-1 block">
              Organization Slug
            </label>
            <div className="flex items-center gap-x-2">
              <Input
                disabled={isLoading}
                placeholder={`e.g. ${name.toLowerCase()}-organization`}
                value={slug}
                onChange={handleSlugChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreateOrganization();
                }}
              />
              {slug.length > 0 && (
                <div className="size-6 flex rounded-full bg-neutral-100 justify-center items-center border">
                  {isChecking ? (
                    <Loader2Icon className="size-4 animate-spin" />
                  ) : isSlugValid === true ? (
                    <CheckIcon
                      className="size-4 text-green-600"
                      strokeWidth={3}
                    />
                  ) : isSlugValid === false ? (
                    <XIcon className="size-4 text-rose-600" strokeWidth={3} />
                  ) : isSlugValid === "invalid-format" ? (
                    <XIcon className="size-4 text-rose-600" strokeWidth={3} />
                  ) : null}
                </div>
              )}
            </div>
            {getSlugMessage()}
          </div>
          <DialogFooter>
            <Button
              disabled={
                isLoading ||
                isChecking ||
                !organizationName ||
                !slug ||
                !isSlugValid ||
                isSlugValid === "invalid-format"
              }
              onClick={handleCreateOrganization}
            >
              {isLoading ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default OrganizationSwitcher;
