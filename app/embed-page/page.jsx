"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@clerk/nextjs"
import { toast } from "sonner"
import {
  Code2, Copy, CheckCheck, Bot, Loader2,
  Globe, Mail, ChevronRight, AlertCircle
} from "lucide-react"

// ─── Animation Variants ────────────────────────────────────────────
const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
}
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
}

// ─── Copy Button ───────────────────────────────────────────────────
const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    toast.success("Script copied to clipboard!")
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg
        bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white
        transition-all duration-200 font-medium"
    >
      {copied
        ? <><CheckCheck size={13} className="text-emerald-400" /> Copied!</>
        : <><Copy size={13} /> Copy</>
      }
    </button>
  )
}

// ─── Business Card ─────────────────────────────────────────────────
const BusinessCard = ({ business, ownerId, index }) => {
  const [expanded, setExpanded] = useState(false)

  const scriptCode =
  `<script\n  src="${window.location.origin}/chatbot.js"\n  data-owner-id="${ownerId}"\n></script>`
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: "easeOut" }}
    >
      <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden shadow-xl shadow-zinc-100 dark:shadow-none">

        {/* Gradient top accent — same as dashboard */}
        <div className="h-1.5 w-full bg-gradient-to-r from-violet-500 via-cyan-500 to-rose-500" />

        <CardContent className="p-0">

          {/* ─── Card Header ─── */}
          <div className="p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-200 dark:shadow-violet-900/30 flex-shrink-0">
                <Bot size={20} className="text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-base leading-tight">
                  {business.supportName}
                </h3>
                <div className="flex items-center gap-1.5 mt-1">
                  <Mail size={12} className="text-zinc-400" />
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">
                    {business.supportEmail}
                  </span>
                </div>
              </div>
            </div>

            {/* Expand Button */}
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1.5 text-sm text-violet-600 dark:text-violet-400 font-semibold hover:text-violet-700 transition-colors"
            >
              {expanded ? "Hide script" : "Get script"}
              <motion.div animate={{ rotate: expanded ? 90 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronRight size={16} />
              </motion.div>
            </button>
          </div>

          {/* ─── Script Section ─── */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="mx-5 mb-5">
                  <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4 space-y-3">

                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      Paste this script before the closing{" "}
                      <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-700 dark:text-zinc-300">
                        &lt;/body&gt;
                      </code>{" "}
                      tag on your website.
                    </p>

                    {/* Code Block */}
                    <div className="bg-zinc-950 rounded-xl overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-800">
                        <div className="flex items-center gap-2">
                          <Code2 size={13} className="text-zinc-500" />
                          <span className="text-xs text-zinc-500 font-medium">HTML</span>
                        </div>
                        <CopyButton text={scriptCode} />
                      </div>
                      <pre className="p-4 text-xs text-emerald-400 font-mono overflow-x-auto leading-relaxed">
                        {scriptCode}
                      </pre>
                    </div>

                    {/* Tip */}
                    <div className="flex items-start gap-2 bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-900/50 rounded-2xl px-3.5 py-2.5">
                      <Globe size={13} className="text-violet-500 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-violet-700 dark:text-violet-300 leading-relaxed">
                        This chatbot will only answer questions based on{" "}
                        <span className="font-semibold">{business.supportName}</span>'s details.
                      </p>
                    </div>

                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </CardContent>
      </Card>
    </motion.div>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────
export default function EmbedPage() {
  const { userId } = useAuth()
  const [business, setBusiness] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const res = await fetch("/api/business")
        const data = await res.json()
        if (data.success && data.business) {
          setBusiness(data.business)
        } else if (!data.success) {
          setError(data.error || "Something went wrong.")
        }
        // business nahi mila toh null — empty state dikhega
      } catch {
        setError("Network error. Please try again.")
      } finally {
        setLoading(false)
      }
    }
    fetchBusiness()
  }, [])

  return (
    <div className="min-h-screen bg-linear-to-r from-purple-900 via-green-900 to-blue-900 px-4 py-10">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-2xl mx-auto space-y-6"
      >

        {/* ─── Header ─── */}
        <motion.div variants={item} className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-200 dark:shadow-violet-900/30">
            <Code2 size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              Embed Chatbot
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
              Copy your script and paste it on any website
            </p>
          </div>
        </motion.div>

        {/* ─── Loading ─── */}
        {loading && (
          <motion.div variants={item} className="flex items-center justify-center py-20">
            <div className="flex items-center gap-3 text-zinc-500">
              <Loader2 size={20} className="animate-spin text-violet-500" />
              <span className="text-sm font-medium">Loading your business...</span>
            </div>
          </motion.div>
        )}

        {/* ─── Error ─── */}
        {error && (
          <motion.div variants={item}>
            <div className="flex items-center gap-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 rounded-2xl px-4 py-3">
              <AlertCircle size={16} className="text-rose-500 flex-shrink-0" />
              <p className="text-sm text-rose-700 dark:text-rose-300">{error}</p>
            </div>
          </motion.div>
        )}

        {/* ─── Empty State ─── */}
        {!loading && !error && !business && (
          <motion.div variants={item}>
            <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden shadow-xl shadow-zinc-100 dark:shadow-none">
              <div className="h-1.5 w-full bg-gradient-to-r from-violet-500 via-cyan-500 to-rose-500" />
              <CardContent className="py-16 flex flex-col items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                  <Bot size={26} className="text-zinc-400" />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-zinc-700 dark:text-zinc-300">
                    No business found
                  </p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                    Set up your business from the settings page first
                  </p>
                </div>
                <Button
                  onClick={() => window.location.href = "/dashboard"}
                  className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-semibold shadow-lg shadow-violet-200 dark:shadow-violet-900/30 mt-2"
                >
                  Go to Settings
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* ─── Business Card ─── */}
        {!loading && !error && business && (
          <BusinessCard
            business={business}
            ownerId={userId}
            index={0}
          />
        )}

      </motion.div>
    </div>
  )
}