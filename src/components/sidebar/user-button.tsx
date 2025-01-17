"use client";
import React from "react";
import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ChevronUp } from "lucide-react";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

const UserButton = ({
  type,
  name,
  email,
  image,
}: {
  type: "sidebar" | "rounded";
  name: string;
  email: string;
  image: string;
}) => {
  const { state } = useSidebar();

  return (
    <>
      {type === "sidebar" && (
        <SidebarFooter className="bg-white rounded-lg">
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton className={cn("h-12 ",
                    state === "collapsed" && "flex justify-center items-center"
                  )}>
                    {state !== "collapsed" && (
                      <>
                        <div
                          className={cn(
                            "flex w-full justify-start items-center gap-x-1.5"
                          )}
                        >
                          <Image
                            className="rounded-full size-8 shrink-0"
                            src={image}
                            alt="profile_image"
                            width={25}
                            height={25}
                          />{" "}
                          <div className={cn("")}>
                            <p className="text-neutral-800 font-medium">
                              {name}
                            </p>
                            <p className="text-sm text-neutral-700 w-28">
                              {email
                                ? `${email.slice(0, 6)}...${email.slice(
                                    email.indexOf("@")
                                  )}`
                                : ""}
                            </p>
                          </div>
                        </div>
                        <ChevronUp className="ml-auto" />
                      </>
                    )}
                    {state === "collapsed" && (
                      <div className="bg-neutral-500 relative size-6 flex justify-center items-center flex-shrink-0 overflow-hidden transition-all duration-300 rounded-full">
                        <Image src={image} alt="image" fill />
                      </div>
                    )}
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  className="w-[--radix-popper-anchor-width]"
                >
                  <DropdownMenuItem>
                    <span>Account</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span>Billing</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      signOut({
                        redirectTo: "/",
                      })
                    }
                  >
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      )}
    </>
  );
};

export default UserButton;
