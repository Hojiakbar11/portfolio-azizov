'use client'

import { motion } from 'framer-motion'
import { Briefcase, GraduationCap, Calendar } from 'lucide-react'

interface Entry {
  id: string
  title: string
  company: string
  school?: string
  degree?: string
  date_range: string
  description: string
}

interface TimelineProps {
  experience: Entry[]
  education: Entry[]
}

export default function Timeline({ experience, education }: TimelineProps) {
  return (
    <section id="about" className="py-24 bg-[#0a0a0a]">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          
          {/* Experience */}
          <div className="space-y-12">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500">
                <Briefcase size={28} />
              </div>
              <h2 className="text-3xl font-bold text-white">Experience</h2>
            </div>

            <div className="space-y-8 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-white/5">
              {experience.map((item, i) => (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="relative pl-12"
                >
                  <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full bg-[#0a0a0a] border-2 border-blue-500 z-10" />
                  <div className="bg-[#111] border border-white/5 p-6 rounded-2xl hover:border-blue-500/30 transition-all group">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-blue-500 flex items-center gap-2 uppercase tracking-widest">
                        <Calendar size={12} /> {item.date_range}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{item.title}</h3>
                    <p className="text-gray-400 font-medium mb-4">{item.company}</p>
                    <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
                  </div>
                </motion.div>
              ))}
              {experience.length === 0 && <p className="text-gray-500 italic ml-12">Experience entries pending...</p>}
            </div>
          </div>

          {/* Education */}
          <div className="space-y-12">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-500">
                <GraduationCap size={28} />
              </div>
              <h2 className="text-3xl font-bold text-white">Education</h2>
            </div>

            <div className="space-y-8 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-white/5">
              {education.map((item, i) => (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="relative pl-12"
                >
                  <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full bg-[#0a0a0a] border-2 border-purple-500 z-10" />
                  <div className="bg-[#111] border border-white/5 p-6 rounded-2xl hover:border-purple-500/30 transition-all group">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-purple-500 flex items-center gap-2 uppercase tracking-widest">
                        <Calendar size={12} /> {item.date_range}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors">{item.degree}</h3>
                    <p className="text-gray-400 font-medium mb-4">{item.school}</p>
                    <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
                  </div>
                </motion.div>
              ))}
              {education.length === 0 && <p className="text-gray-500 italic ml-12">Education entries pending...</p>}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
