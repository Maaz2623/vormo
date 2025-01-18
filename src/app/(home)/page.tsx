"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useGetOrganizations } from "@/features/organizations/api/use-get-organizations";
const HomePage = () => {
  const { data: organizations } = useGetOrganizations();

  return (
    <Button asChild>
      <Link href={`/organization/${organizations?.[0].slug}/overview`}>
        Dashboard
      </Link>
    </Button>
  );
};

export default HomePage;
