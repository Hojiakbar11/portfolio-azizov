'use client'

import { motion } from 'framer-motion'
import { 
  Wrench, 
  Terminal, 
  Code2, 
  Database, 
  Globe, 
  Layers, 
  Layout, 
  Cpu, 
  ShieldCheck, 
  Smartphone,
  Cloud
} from 'lucide-react'

const ICON_MAP: Record<string, any> = {
  Terminal,
  Code2,
  Database,
  Globe,
  Layers,
  Layout,
  Cpu,
  ShieldCheck,
  Smartphone,
  Cloud
}

interface Skill {
  id: string
  name: string
  category: string
  icon_name?: string
}

interface SkillsProps {
  skills: Skill[]
}

export default function Skills({ skills }: SkillsProps) {
  // Group skills by category
  const categories = Array.from(new Set(skills.map(s => s.category || 'General')))

  return (
    <section id="skills" className="py-24 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex items-center gap-4 mb-16">
          <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500">
            <Wrench size={28} />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">Technical Skills</h2>
            <p className="text-gray-500 text-sm mt-1">My specialized toolkit for building secure, scalable applications.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat, i) => (
            <motion.div
              key={cat}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-[#111] border border-white/5 rounded-3xl p-8 hover:border-blue-500/20 transition-all group"
            >
              <h3 className="text-blue-500 font-bold uppercase tracking-widest text-xs mb-8">{cat}</h3>
              <div className="flex flex-wrap gap-3">
                {skills.filter(s => (s.category || 'General') === cat).map(skill => {
                  const IconComponent = ICON_MAP[skill.icon_name || ''] || Terminal
                  return (
                    <div 
                      key={skill.id}
                      className="px-4 py-2 bg-white/5 border border-white/5 rounded-xl flex items-center gap-2 group-hover:bg-white/10 transition-colors"
                    >
                      <IconComponent size={14} className="text-blue-400" />
                      <span className="text-sm font-medium text-gray-300">{skill.name}</span>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          ))}
          {skills.length === 0 && (
            <div className="lg:col-span-3 text-center py-12 text-gray-500 italic">
              Skills entries are waiting in the Cockpit...
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
