"use client";

import React, { useState, useRef } from "react";
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "../ui/sidebar";
import {
  CheckIcon,
  ChevronDownIcon,
  Loader2Icon,
  PlusIcon,
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
import { checkSlug } from "@/db/actions";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { useCreateOrganization } from "@/features/organizations/api/use-create-organization";
import { useParams } from "next/navigation";
import { useGetOrganizationBySlug } from "@/features/organizations/api/use-get-organization-by-slug";
import OrganizationSearchDialog from "./organization-search-dialog";
import { cn } from "@/lib/utils";

const OrganizationSwitcher = ({
  name,
  email,
}: {
  name: string;
  userId: string;
  email: string;
}) => {
  const { state } = useSidebar();
  const { mutate } = useCreateOrganization();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [organizationName, setOrganizationName] = useState("");
  const [slug, setSlug] = useState("");
  const [isSlugValid, setIsSlugValid] = useState<
    boolean | "invalid-format" | null
  >(null); // true, false, or null for "not checked"
  const [isChecking, setIsChecking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [searchDialog, setSearchDialog] = useState(false);

  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleCreateOrganization = async () => {
    if (organizationName.trim() === "" || slug.trim() === "" || !isSlugValid) {
      return;
    }

    setIsLoading(true);

    try {
      mutate({
        organizationName: organizationName.trim(),
        organizationSlug: slug.trim(),
      });
      setIsCreateDialogOpen(false);
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
      <SidebarHeader className="rounded-lg bg-white">
        <SidebarMenu className="flex flex-col gap-y-2">
          <SidebarMenuItem className="">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="w-full">
                  <Button
                    onClick={() => setSearchDialog(true)}
                    className={cn(
                      "w-full flex justify-between items-center",
                      state === "collapsed" &&
                        "flex justify-center items-center"
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
                </TooltipTrigger>
                <TooltipContent className="bg-neutral-200 text-black text-sm ">
                  <p>{currentOrganization?.name}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </SidebarMenuItem>
          <SidebarMenuItem className="">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="w-full">
                  <Button
                    onClick={() => setIsCreateDialogOpen(true)}
                    className={cn(
                      "w-full flex justify-start items-center",
                      state === "collapsed" &&
                        "flex justify-center items-center"
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
                </TooltipTrigger>
                <TooltipContent className="bg-neutral-200 text-black text-sm ">
                  <p>Create a new organization</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
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
