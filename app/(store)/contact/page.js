"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Send, Loader2 } from "lucide-react"

// TODO: replace with your own Formspree endpoint (formspree.io)
const FORMSPREE_ENDPOINT = "https://formspree.io/f/xjgqjdaj"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error("Please fill in all fields")
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address")
      return
    }

    setLoading(true)

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error("Form submission failed")

      toast.success("Message sent. We'll get back to you soon.")
      setFormData({ name: "", email: "", subject: "", message: "" })
    } catch (err) {
      toast.error("Something went wrong. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black dark:text-white mb-2">
          Contact
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Have questions or feedback? We'd love to hear from you.
        </p>
      </div>

      <div className="bg-white dark:bg-neutral-900 border dark:border-neutral-800 rounded-xl p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
              Your Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              className="w-full border dark:border-neutral-700 rounded-md px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black dark:focus:ring-white bg-white dark:bg-neutral-800 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full border dark:border-neutral-700 rounded-md px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black dark:focus:ring-white bg-white dark:bg-neutral-800 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
              Subject
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="How can we help?"
              className="w-full border dark:border-neutral-700 rounded-md px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black dark:focus:ring-white bg-white dark:bg-neutral-800 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
              Message
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell us more..."
              rows={5}
              className="w-full border dark:border-neutral-700 rounded-md px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black dark:focus:ring-white bg-white dark:bg-neutral-800 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-black dark:bg-white text-white dark:text-black py-2.5 rounded-md text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Send Message
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}