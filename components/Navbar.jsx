"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Building, Crown, LucideLayoutDashboard, Plus, Ticket } from "lucide-react";
import { Show, SignInButton, useAuth, UserButton } from "@clerk/nextjs";
import { BarLoader } from "react-spinners";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Badge } from "./ui/badge";
import {motion} from 'framer-motion'


export default function Navbar() {
  // const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const { isLoaded } = useAuth();

  // const { has } = useAuth();
  // const hasPro = has?.({ plan: "pro" });

  return (
    <>
      <nav className="fixed top-0 left-0 right-0  bg-background/80 backdrop-blur-xl z-20 border-b">
        <motion.div initial={{y:-20}} animate={{y:0}} transition={{duration:0.7}}
         className="max-w-7xl mx-auto px-20 py-4 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="divine logo"
              width={100}
              height={100}
              className="w-full h-11"
              priority
            />

             {/* <span className="text-purple-500 text-2xl font-bold">spott*</span> */}
            {/* {hasPro && (
              <Badge className="bg-linear-to-r from-pink-500 to-orange-500 gap-1 text-white ml-3">
                <Crown className="w-3 h-3" />
                Pro
              </Badge>
            )} */}
          </Link>

        


          {/* Right Side Actions */}
          <div className="flex items-center">
             {/* {!hasPro && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowUpgradeModal(true)}
              >
                Pricing
              </Button>
            )} */}

            {/* <Button variant="ghost" size="sm" asChild className="mr-2 font-bold text-1xl">
              <Link href="/explore">Explore</Link>
            </Button> */}

            <Show when="signed-out">
              <SignInButton mode="modal">
                <Button size="sm">Sign In</Button>
              </SignInButton>
            </Show>

            <Show when="signed-in">

              {/* User Button */}
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-9 h-9",
                  },
                }}
              >
                <UserButton.MenuItems>
                  <UserButton.Link
                    label="Dashboard"
                    labelIcon={<LucideLayoutDashboard />}
                    href="/dashboard"
                  />
                  
                  <UserButton.Action label="manageAccount" />
                </UserButton.MenuItems>
              </UserButton>
            </Show>
          </div>
        </motion.div>

        {/* Loading Bar */}
        {!isLoaded && (
          <div className="absolute bottom-0 left-0 w-full">
            <BarLoader width={"100%"} color="#a855f7" />
          </div>
        )}
      </nav>
     

    </>
  );
}