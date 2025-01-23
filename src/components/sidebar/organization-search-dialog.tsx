"use client";
import React from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGetOrganizations } from "@/features/organizations/api/use-get-organizations";
import Link from "next/link";
import { CheckIcon } from "lucide-react";
import { useParams } from "next/navigation";

const OrganizationSearchDialog = ({
  searchDialog,
  setSearchDialog,
}: {
  searchDialog: boolean;
  setSearchDialog: (open: boolean) => void;
  email: string;
}) => {
  const { data: organizations } = useGetOrganizations();

  const params = useParams();

  return (
    <Dialog open={searchDialog} onOpenChange={setSearchDialog}>
      <DialogContent className="bg-transparent border-none shadow-none flex justify-center items-center">
        <DialogHeader>
          <DialogTitle></DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <Command className="border font-medium h-[400px] w-[600px]">
          <CommandInput
            placeholder="Type a command or search..."
            className="h-12"
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup
              heading="Joined Organizations"
              className="flex flex-col"
            >
              {organizations?.map((organization) => (
                <Link
                  key={organization.slug}
                  href={`/organization/${organization.slug}/overview`}
                  onClick={() => setSearchDialog(false)}
                >
                  <CommandItem
                    key={organization.slug}
                    asChild
                    className="cursor-pointer h-10 mb-1 flex "
                  >
                    <div className="flex justify-between">
                      <p>{organization.name}</p>
                      {params.organizationSlug === organization.slug && (
                        <CheckIcon />
                      )}
                    </div>
                  </CommandItem>
                </Link>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
};

export default OrganizationSearchDialog;
