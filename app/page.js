"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LandingPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="pb-16 relative overflow-hidden">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
          {/* Left content */}
          <motion.div initial = {{opacity:0, y:40}} animate={{opacity:1, y:0}} transition={{duration:0.7}}
           className="text-center sm:text-left">
          

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-[0.95] tracking-tight">
              AI Customer Support <br />
              Built for Modern Websites & "  
              <span className="bg-linear-to-r from-blue-400 via-purple-400 to-orange-400 bg-clip-text text-transparent">
                events".
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-400 mb-12 max-w-lg font-light">
             Add a powerful AI chatbot to your website in minutes.
             Let your customers get instant answers using your own business knowledge.
            </p>

            <Link href="/dashboard">
              <Button size="xl" className={"rounded-full"}>
                Get Started
              </Button>
            </Link>
          </motion.div>

          {/* Right - 3D Phone Mockup */}

          {/* <div className="relative block">
            <Image
              // src="/hero.png"
              src="/hero.gif"
              alt="react meetup"
              width={700}
              height={700}
              className="w-full h-auto"
              priority
            />
           
          </div> */}

            <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} transition={{duration:0.7, delay:0.3}}
             className="relative">
              <div className="rounded-2xl bg-white shadow-2xl border border-zinc-600 p-6 ">
                <div className="text-md text-zinc-600 mb-3 font-bold">Live Chat Preview</div>
                <div className="space-y-3">
                  <div className="bg-black text-white rounded-lg px-4 py-2 text-sm ml-auto w-fit">
                    Do You Offer CashOnDelivery?
                  </div>
                  <div className="bg-zinc-500 rounded-lg px-4 py-2 text-sm w-fit">
                    yes CashOnDelivery is available.
                  </div>
                </div>

                {/* icon */}
                <motion.div animate = {{ y:[0, -12, 0] }} transition = {{repeat:Infinity, duration:1}}
                className="absolute -bottom-6 -right-6 w-14 h-14 rounded-full
                 bg-black text-white text-2xl flex items-center justify-center shadow-xl">
                  💬
                </motion.div>

                </div>
            </motion.div>

        </div>
      </section>
    </div>
  );
}