'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Lock, EyeOff, ChevronRight } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import GithubIcon from '@/components/icons/GithubIcon'
import { useRouter } from 'next/navigation'

interface Project {
  id: string
  title: string
  description: string
  image_url: string
  github_url?: string
  live_url?: string
  is_private: boolean
  technologies: string[] | string
  category?: string
}

interface ProjectCardProps {
  project: Project
  index: number
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  const [isAdmin, setIsAdmin] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setIsAdmin(!!session)
    }
    checkUser()
  }, [supabase])

  // Hide links if project is private, even for admins on the main page cards
  // Links should only be accessible on the inner project page after password entry
  const showLinks = !project.is_private

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      onClick={() => router.push(`/projects/${project.id}`)}
      className={`group relative bg-[#111] rounded-2xl overflow-hidden border border-white/5 hover:border-blue-500/50 transition-all duration-300 cursor-pointer`}
    >
      <div className="aspect-video relative overflow-hidden">
        <img 
          src={project.image_url || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop'} 
          alt={project.title}
          className={`object-cover w-full h-full group-hover:scale-105 transition-transform duration-500 ${project.is_private ? 'blur-[8px] grayscale' : ''}`}
        />
        <div className="absolute top-4 left-4 z-20">
          <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-bold text-gray-300 uppercase tracking-widest">
            {project.category || 'Web Development'}
          </span>
        </div>
        {project.is_private && (
          <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-yellow-500/30 text-yellow-500 z-20">
            <Lock size={14} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Private</span>
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex flex-wrap gap-2 mb-4">
          {(Array.isArray(project.technologies) 
            ? project.technologies 
            : (typeof project.technologies === 'string' ? project.technologies.split(',').map(t => t.trim()).filter(Boolean) : [])
          ).map((tech: string) => (
            <span key={tech} className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider bg-white/5 text-gray-400 rounded-md border border-white/5">
              {tech}
            </span>
          ))}
        </div>
        
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors flex items-center gap-2">
          {project.title}
          {project.is_private && <Lock size={16} className="text-yellow-500/50" />}
        </h3>
        
        <p className="text-gray-400 text-sm mb-6 line-clamp-2 leading-relaxed">
          {project.is_private 
            ? "This project is encrypted. Access to details and source code is restricted and requires a secure key."
            : project.description
          }
        </p>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-4">
            {showLinks && project.live_url && (
              <a 
                href={project.live_url} 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 transition-all"
                title="Live Demo"
              >
                <ExternalLink size={18} />
              </a>
            )}
            {showLinks && project.github_url && (
              <a 
                href={project.github_url} 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                title="Source Code"
              >
                <GithubIcon size={18} />
              </a>
            )}
          </div>
          
          <span className="text-xs font-bold text-blue-500 group-hover:translate-x-1 transition-transform flex items-center gap-1.5">
            {project.is_private && <Lock size={12} />}
            View Details <ChevronRight size={14} />
          </span>
        </div>
      </div>
    </motion.div>
  )
}
