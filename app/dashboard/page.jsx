"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import {
  Bot, Save, Info, Loader2, Trash2,
  Building2, Mail, FileText, Sparkles
} from "lucide-react"

// ─── Field Wrapper ─────────────────────────────────────────────────
const Field = ({ label, icon: Icon, children }) => (
  <div className="space-y-2">
    <label className="flex items-center gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
      <Icon size={14} className="text-violet-500" />
      {label}
    </label>
    {children}
  </div>
)

// ─── Animation Variants ────────────────────────────────────────────
const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
}
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
}

// ─── Main Page ─────────────────────────────────────────────────────
export default function DashboardPage() {
  const [supportName, setSupportName] = useState("")
  const [supportEmail, setSupportEmail] = useState("")
  const [supportDetails, setSupportDetails] = useState("")
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [hasExisting, setHasExisting] = useState(false)

  // ─── Fetch existing business ───────────────────────────────────
  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const res = await fetch("/api/business")
        const data = await res.json()
        if (data.success && data.business) {
          setSupportName(data.business.supportName || "")
          setSupportEmail(data.business.supportEmail || "")
          setSupportDetails(data.business.supportDetails || "")
          setHasExisting(true)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setFetching(false)
      }
    }
    fetchBusiness()
  }, [])

  // ─── Save / Update ─────────────────────────────────────────────
  const handleSave = async () => {
    if (!supportName.trim() || !supportEmail.trim() || !supportDetails.trim()) {
      toast.error("Please fill all fields before saving.")
      return
    }

    setLoading(true)
    try {
      const method = hasExisting ? "PUT" : "POST"
      const res = await fetch("/api/business", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ supportName, supportEmail, supportDetails }),
      })
      const data = await res.json()

      if (data.success) {
        setHasExisting(true)
        toast.success("Chatbot updated successfully!")
      } else {
        toast.error(data.error || "Something went wrong.")
      }
    } catch {
      toast.error("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // ─── Delete ────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete?")) return
    setDeleting(true)
    try {
      const res = await fetch("/api/business", { method: "DELETE" })
      const data = await res.json()
      if (data.success) {
        setSupportName("")
        setSupportEmail("")
        setSupportDetails("")
        setHasExisting(false)
        toast.success("Business deleted successfully.")
      } else {
        toast.error(data.error || "Could not delete.")
      }
    } catch {
      toast.error("Network error. Please try again.")
    } finally {
      setDeleting(false)
    }
  }

  // ─── Loading State ─────────────────────────────────────────────
  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-white to-cyan-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
        <div className="flex items-center gap-3 text-zinc-500">
          <Loader2 size={20} className="animate-spin text-violet-500" />
          <span className="text-sm font-medium">Loading your settings...</span>
        </div>
      </div>
    )
  }

  // ─── Main UI ───────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-linear-to-r from-blue-900 via-green-900 to-orange-900 px-4 py-10">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-2xl mx-auto space-y-6"
      >

        {/* ─── Header ─── */}
        <motion.div variants={item} className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-200 dark:shadow-violet-900/30">
              <Bot size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                Chatbot Settings
              </h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
                {hasExisting ? "Update your chatbot knowledge" : "Set up your AI chatbot"}
              </p>
            </div>
          </div>

          {/* Active Badge */}
          {hasExisting && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 bg-emerald-500 text-white rounded-full px-3 py-1.5 shadow-md shadow-emerald-200 dark:shadow-emerald-900/30"
            >
              <Sparkles size={12} />
              <span className="text-xs font-semibold">Active</span>
            </motion.div>
          )}
        </motion.div>

        {/* ─── Stats Row ─── */}
        <motion.div variants={item} className="grid grid-cols-3 gap-3">
          {[
            { label: "Business Name", value: supportName || "—", color: "from-violet-500 to-purple-600" },
            { label: "Support Email", value: supportEmail || "—", color: "from-cyan-500 to-blue-600" },
            { label: "Details Length", value: supportDetails ? `${supportDetails.length} chars` : "—", color: "from-rose-500 to-pink-600" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-4 shadow-sm"
            >
              <div className={`text-xs font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent uppercase tracking-wide mb-1`}>
                {stat.label}
              </div>
              <div className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 truncate">
                {stat.value}
              </div>
            </div>
          ))}
        </motion.div>

        {/* ─── Form Card ─── */}
        <motion.div variants={item}>
          <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl shadow-zinc-100 dark:shadow-none rounded-3xl overflow-hidden">

            {/* Gradient top accent */}
            <div className="h-1.5 w-full bg-gradient-to-r from-violet-500 via-cyan-500 to-rose-500" />

            <CardContent className="p-7 space-y-6">

              {/* Info tip */}
              <div className="flex gap-3 items-start bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-900/50 rounded-2xl px-4 py-3">
                <Info size={14} className="text-violet-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-violet-700 dark:text-violet-300 leading-relaxed">
                  Your chatbot uses these details to answer customer queries. The more detail you add, the smarter it becomes.
                </p>
              </div>

              {/* Business Name */}
              <Field label="Business Name" icon={Building2}>
                <Input
                  type="text"
                  value={supportName}
                  onChange={(e) => setSupportName(e.target.value)}
                  placeholder="e.g. Gada Electronics"
                  className="rounded-xl h-11 text-sm border-zinc-200 dark:border-zinc-700 focus-visible:ring-violet-500 bg-zinc-50 dark:bg-zinc-800"
                />
              </Field>

              {/* Support Email */}
              <Field label="Support Email" icon={Mail}>
                <Input
                  type="email"
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                  placeholder="e.g. support@gada.com"
                  className="rounded-xl h-11 text-sm border-zinc-200 dark:border-zinc-700 focus-visible:ring-violet-500 bg-zinc-50 dark:bg-zinc-800"
                />
              </Field>

              <div className="border-t border-zinc-100 dark:border-zinc-800" />

              {/* Business Details */}
              <Field label="Business Details" icon={FileText}>
                <Textarea
                  value={supportDetails}
                  onChange={(e) => setSupportDetails(e.target.value)}
                  placeholder="Describe your business — products, services, timings, offers, location, FAQs..."
                  className="rounded-xl text-sm min-h-[150px] resize-none border-zinc-200 dark:border-zinc-700 focus-visible:ring-violet-500 bg-zinc-50 dark:bg-zinc-800"
                />
                <p className="text-xs text-zinc-400 text-right">
                  {supportDetails.length} characters
                </p>
              </Field>

              {/* Save + Delete Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={handleSave}
                  disabled={loading || deleting}
                  className="flex-1 h-12 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-semibold text-sm gap-2 shadow-lg shadow-violet-200 dark:shadow-violet-900/30 disabled:opacity-60 transition-all duration-200"
                >
                  {loading ? (
                    <><Loader2 size={16} className="animate-spin" /> Saving...</>
                  ) : (
                    <><Save size={16} /> {hasExisting ? "Update Chatbot" : "Save & Activate Chatbot"}</>
                  )}
                </Button>

                {hasExisting && (
                  <Button
                    onClick={handleDelete}
                    disabled={loading || deleting}
                    className="h-12 px-5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-semibold text-sm gap-2 shadow-lg shadow-rose-200 dark:shadow-rose-900/30 disabled:opacity-60 transition-all duration-200"
                  >
                    {deleting ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Trash2 size={16} />
                    )}
                  </Button>
                )}
              </div>

            </CardContent>
          </Card>
        </motion.div>

      </motion.div>
    </div>
  )
}