"use client"
import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

export default function LandingPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="pb-16 relative overflow-hidden">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
          {/* Left content */}
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
            className="text-center sm:text-left">

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-[0.95] tracking-tight">
              Ai Customer Support <br />
              Built for Modern Websites & "

              <span className="bg-linear-to-r from-blue-400 via-green-400 to-orange-400 bg-clip-text text-transparent">
                events"
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-400 mb-12 max-w-lg font-semibold">
                  Add a powerful Ai Chatbot to your websites in minutes
              Let Your Users get Instant answers using their own Buisness knowledge.
            </p>

            <Link href="/dashboard">
              <Button size="xl" className={"rounded-full"}>
                Get Started
              </Button>
            </Link>
          </motion.div>

          {/* Right - 3D Phone Mockup */}
         <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.2 }}
  className="relative block w-full max-w-sm mx-auto sm:max-w-md">

  <Card className="bg-zinc-300">
    <CardContent className="p-4 sm:p-5">
      <h3 className="text-blue-900 text-xl sm:text-2xl font-bold text-center">Live Chat Preview</h3>

      <div className="space-y-3 pt-4 sm:pt-5">
        <div className="bg-black text-white rounded-lg px-3 py-2 sm:px-4 text-sm sm:text-md ml-auto w-fit max-w-[80%]">
          Do You Offer Cash Delivery?
        </div>

        <div className="bg-blue-400 text-black rounded-lg px-3 py-2 sm:px-4 text-sm sm:text-md w-fit max-w-[80%]">
          Yes Cash On Delivery is Available.
        </div>
      </div>

      <motion.div animate={{ y: [0, -12, 0] }} transition={{ repeat: Infinity, duration: 2 }}
        className="absolute -bottom-5 -right-5 sm:-bottom-6 sm:-right-6 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-blue-600 text-white text-xl sm:text-2xl flex items-center justify-center shadow-2xl">
        💬
      </motion.div>
    </CardContent>
  </Card>
</motion.div>

        </div>
      </section>
    </div>
  );
}