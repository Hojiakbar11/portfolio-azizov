'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Lock } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import GithubIcon from '@/components/icons/GithubIcon'

interface Project {
  id: string
  title: string
  description: string
  image_url: string
  github_url?: string
  live_url?: string
  is_private: boolean
  technologies: string[]
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchProjects() {
      if (!supabase || !supabase.from) {
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })

      if (data) setProjects(data)
      setLoading(false)
    }

    fetchProjects()
  }, [supabase])

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    )
  }

  return (
    <section id="projects" className="py-24 bg-[#0a0a0a]">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-4xl font-bold text-white mb-4">Featured Projects</h2>
            <p className="text-gray-400 max-w-xl">
              A collection of my recent work, including web applications, experimental tools, and personal projects.
            </p>
          </div>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-20 rounded-3xl border border-dashed border-white/10 bg-white/5">
            <p className="text-gray-500 text-lg">No projects added yet. Admin panel is ready for data entry!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-[#111] rounded-2xl overflow-hidden border border-white/5 hover:border-blue-500/50 transition-all duration-300"
              >
                <div className="aspect-video relative overflow-hidden">
                  <img 
                    src={project.image_url || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop'} 
                    alt={project.title}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                  />
                  {project.is_private && (
                    <div className="absolute top-4 right-4 p-2 rounded-full bg-black/60 backdrop-blur-md text-yellow-500">
                      <Lock size={16} />
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {(Array.isArray(project.technologies) ? project.technologies : []).map(tech => (
                      <span key={tech} className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider bg-white/5 text-gray-400 rounded-md border border-white/5">
                        {tech}
                      </span>
                    ))}
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                    {project.title}
                  </h3>
                  
                  <p className="text-gray-400 text-sm mb-6 line-clamp-2">
                    {project.description}
                  </p>

                  <div className="flex items-center gap-4">
                    {project.live_url && (
                      <a 
                        href={project.live_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm font-medium text-white hover:text-blue-400 transition-colors"
                      >
                        <ExternalLink size={16} />
                        Live Demo
                      </a>
                    )}
                    {project.github_url && (
                      <a 
                        href={project.github_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
                      >
                        <GithubIcon size={16} />
                        Code
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
