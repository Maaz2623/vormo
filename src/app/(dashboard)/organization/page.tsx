"use client";
import { useGetOrganizations } from "@/features/organizations/api/use-get-organizations";
import { useCreateOrganizationStore } from "@/features/organizations/store/use-create-organization-store";
import React from "react";

const OrganizationPage = () => {
  const { data: organizations } = useGetOrganizations();

  const [, setOpen] = useCreateOrganizationStore();

  if (organizations?.length === 0) {
    setOpen(true);
  }

  return <div>OrganizationPage</div>;
};

export default OrganizationPage;
