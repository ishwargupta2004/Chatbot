"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Show, SignInButton, useAuth, UserButton } from "@clerk/nextjs";
import { BarLoader } from "react-spinners";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Badge } from "./ui/badge";
import UpgradeModal from "./upgrade-model";
import { motion } from "framer-motion";


export default function Header() {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const { isLoaded } = useAuth();

  const { has } = useAuth();
  const hasPro = has?.({ plan: "pro" });

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-xl  z-20 border-b">
        <motion.div initial={{y:-50}} animate={{y:0}} transition={{duration:0.5}}
         className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center">

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-[0.95] tracking-tight">
              <span className="bg-linear-to-r from-blue-400 via-purple-400 to-orange-400 bg-clip-text text-transparent">
                Divine
              </span>
            </h1>

            {/* <span className="text-purple-500 text-2xl font-bold">spott*</span> */}
            {hasPro && (
              <Badge className="bg-linear-to-r from-pink-500 to-orange-500 gap-1 text-white ml-3">
                <Crown className="w-3 h-3" />
                Pro
              </Badge>
            )}

          </Link>



          {/* Right Side Actions */}
          <div className="flex items-center">

            {!hasPro && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowUpgradeModal(true)}
              >
                Pricing
              </Button>
            )}

            <Show when="signed-out">
              <SignInButton mode="modal">
                <Button size="sm">Sign In</Button>
              </SignInButton>
            </Show>

            <Show when="signed-in">
              {/* Create Event Button */}
              <Button size="sm" asChild className="flex gap-2 mr-4">
                <Link href="/dashboard">
                  <span className="font-bold sm:inline">Dashboard</span>
                </Link>
              </Button>

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
                  <UserButton.Action label="manageAccount" />
                </UserButton.MenuItems>
              </UserButton>

            </Show>
          </div>
        </motion.div>

        {/* Loading Bar */}
        {!isLoaded && (
          <div className="absolute bottom-0 left-0 w-full">
            <BarLoader width={"100%"} color="#eab308" />
          </div>
        )}
      </nav>



      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        trigger="header"
      />

    </>
  );
}