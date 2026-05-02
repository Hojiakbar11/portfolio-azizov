'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { createClient } from '@/lib/supabase'
import { Terminal as TerminalIcon, ChevronRight, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Fuse from 'fuse.js'

interface Command {
  command_name: string
  response_text: string
  category: string
}

export default function Terminal() {
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<{ type: 'input' | 'output'; content: string }[]>([
    { type: 'output', content: 'Welcome to the Secure Terminal v2.0.4' },
    { type: 'output', content: "Type 'help' to see available commands." }
  ])
  const [commands, setCommands] = useState<Command[]>([])
  const [loading, setLoading] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  useEffect(() => {
    async function fetchCommands() {
      try {
        const { data, error } = await supabase.from('terminal_commands').select('*')
        if (error) {
          console.error('Supabase error fetching terminal_commands:', error.message, error.hint)
          return
        }
        if (data) setCommands(data)
      } catch (err: any) {
        console.error('Error fetching terminal commands:', err.message || err)
      } finally {
        setLoading(false)
      }
    }
    fetchCommands()
  }, [supabase])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [history])

  const fuse = useMemo(() => {
    return new Fuse(commands, {
      keys: ['command_name'],
      threshold: 0.4,
      includeScore: true
    })
  }, [commands])

  const findBestMatch = (cmd: string) => {
    if (cmd === 'help' || cmd === 'clear') return null
    
    const results = fuse.search(cmd)
    if (results.length > 0) {
      return results[0].item
    }

    return null
  }

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault()
    const rawInput = input.trim()
    const cmd = rawInput.toLowerCase()
    
    if (!cmd) return

    setHistory(prev => [...prev, { type: 'input', content: rawInput }])
    setInput('')

    if (cmd === 'clear') {
      setHistory([])
      return
    }

    if (cmd === 'help') {
      const dynamicCmds = commands.map(c => c.command_name).join(', ')
      setHistory(prev => [
        ...prev, 
        { type: 'output', content: `Available commands: help, clear, ${dynamicCmds}` }
      ])
      return
    }

    const match = findBestMatch(cmd)
    
    if (match) {
      if (cmd !== match.command_name.toLowerCase()) {
        setHistory(prev => [...prev, { type: 'output', content: `Showing results for '${match.command_name}':` }])
      }
      setHistory(prev => [...prev, { type: 'output', content: match.response_text }])
    } else {
      setHistory(prev => [...prev, { type: 'output', content: `Command '${rawInput}' not recognized. Type 'help' for assistance.` }])
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto bg-[#050505] border border-blue-500/20 rounded-2xl overflow-hidden shadow-2xl shadow-blue-500/5 font-mono">
      <div className="bg-[#111] px-4 py-3 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TerminalIcon size={16} className="text-blue-500" />
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">System Access</span>
        </div>
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/20" />
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="h-[400px] overflow-y-auto p-6 space-y-3 text-sm scrollbar-hide"
      >
        {loading && (
          <div className="flex items-center gap-2 text-blue-500/50">
            <Loader2 className="animate-spin" size={14} />
            <span>Initializing core modules...</span>
          </div>
        )}
        
        <AnimatePresence mode="popLayout">
          {history.map((line, i) => (
            <motion.div 
              key={`${line.content}-${i}`}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex gap-3 ${line.type === 'input' ? 'text-blue-400' : 'text-gray-300'}`}
            >
              {line.type === 'input' && <ChevronRight size={16} className="shrink-0 mt-0.5" />}
              <span className="leading-relaxed whitespace-pre-wrap">{line.content}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <form onSubmit={handleCommand} className="p-6 pt-0 flex items-center gap-3">
        <ChevronRight size={18} className="text-blue-500 shrink-0" />
        <input 
          autoFocus
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Enter command..."
          className="flex-1 bg-transparent border-none outline-none text-blue-400 placeholder:text-blue-900/50"
        />
      </form>
    </div>
  )
}
