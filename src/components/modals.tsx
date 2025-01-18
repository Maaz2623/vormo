"use client";

import CreateOrganizationModal from "@/features/organizations/components/create-organization-modal";
import { useEffect, useState } from "react";

export const Modals = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <CreateOrganizationModal />
    </>
  );
};
