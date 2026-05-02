'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Lock } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import GithubIcon from '@/components/icons/GithubIcon'
import ProjectCard from '@/components/ProjectCard'

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
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
