"use client";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import React from "react";

const SigninPage = () => {
  return (
    <div>
      <Button
        variant={`outline`}
        onClick={() =>
          signIn("google", {
            redirectTo: "/",
          })
        }
      >
        Google
      </Button>
    </div>
  );
};

export default SigninPage;
