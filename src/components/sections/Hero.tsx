'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Terminal, Mail, Phone, Download } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import GithubIcon from '@/components/icons/GithubIcon'

export default function Hero() {
  const [cvUrl, setCvUrl] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    async function getCvUrl() {
      if (!supabase || !supabase.storage) return

      const { data } = supabase.storage
        .from('cvs')
        .getPublicUrl('cv.pdf')
      
      if (data) {
        setCvUrl(data.publicUrl)
      }
    }
    getCvUrl()
  }, [supabase])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0a0a] text-white">
      {/* Animated background grid */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(60,60,255,0.15),transparent_70%)]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-50" />
      </div>

      <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center gap-12">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1 text-center md:text-left"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6"
          >
            <Terminal size={14} />
            <span>Available for new projects</span>
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Hojiakbar Azizov</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-400 mb-8 max-w-2xl leading-relaxed">
            A full-stack developer specialized in building modern, high-performance web applications with Next.js and Supabase.
          </p>

          <div className="flex flex-col gap-4 mb-8">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-gray-400">
              <a href="mailto:hojiakbarazizov092@gmail.com" className="flex items-center gap-2 hover:text-white transition-colors">
                <Mail size={18} />
                <span>hojiakbarazizov092@gmail.com</span>
              </a>
              <a href="tel:+998902119970" className="flex items-center gap-2 hover:text-white transition-colors">
                <Phone size={18} />
                <span>+998 90 211 99 70</span>
              </a>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
            <a 
              href="#projects"
              className="px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 transition-all font-semibold shadow-lg shadow-blue-500/20"
            >
              View Work
            </a>
            
            {cvUrl && (
              <a 
                href={cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all font-semibold flex items-center gap-2"
              >
                <Download size={20} />
                Download CV
              </a>
            )}

            <div className="flex items-center gap-4">
              <a 
                href="https://github.com/Hojiakbar11/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                title="GitHub"
              >
                <GithubIcon size={24} />
              </a>
              <a 
                href="https://app.netlify.com/teams/hojiakbar11/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                title="Netlify"
              >
                <Send size={24} />
              </a>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex-1 relative w-full max-w-lg aspect-square"
        >
          {/* Developer-themed SVG Illustration */}
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-2xl">
            <defs>
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#6366f1', stopOpacity: 1 }} />
              </linearGradient>
            </defs>
            <circle cx="100" cy="100" r="80" fill="url(#grad1)" opacity="0.1" />
            <path d="M40 60 L160 60 L160 140 L40 140 Z" fill="#1e293b" />
            <rect x="50" y="70" width="100" height="60" fill="#0f172a" rx="4" />
            <rect x="55" y="75" width="20" height="4" fill="#3b82f6" rx="2" />
            <rect x="55" y="85" width="60" height="2" fill="#475569" rx="1" />
            <rect x="55" y="90" width="40" height="2" fill="#475569" rx="1" />
            <rect x="55" y="95" width="70" height="2" fill="#475569" rx="1" />
            <rect x="120" y="105" width="20" height="20" fill="#6366f1" rx="4" />
            <path d="M125 115 L135 115 M130 110 L130 120" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
          
          {/* Floating elements for visual interest */}
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 right-0 p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 shadow-xl"
          >
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/50" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
              <div className="w-3 h-3 rounded-full bg-green-500/50" />
            </div>
            <div className="mt-3 text-xs font-mono text-blue-400">Next.js + Tailwind</div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
