import { auth } from "@/auth";
import { redirect } from "next/navigation";
import React from "react";
import { signIn } from "@/auth";

const HomePage = async () => {
  const session = await auth();

  if (!session) redirect("/auth/sign-in");
  return <div>HomePage</div>;
};

export default HomePage;
