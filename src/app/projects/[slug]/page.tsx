'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { ArrowLeft, ExternalLink, Globe, Calendar, Tag, ShieldCheck } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import GithubIcon from '@/components/icons/GithubIcon'

interface Project {
  id: string
  slug: string
  title: string
  description: string
  long_description: string
  image_url: string
  github_url?: string
  live_url?: string
  is_private: boolean
  password?: string
  technologies: string[] | string
  category: string
  created_at: string
}

export default function ProjectPage() {
  const params = useParams()
  const slug = params?.slug as string
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [passwordInput, setPasswordInput] = useState('')
  const [error, setError] = useState('')
  const supabase = createClient()

  useEffect(() => {
    async function fetchProject() {
      const decodedSlug = decodeURIComponent(slug)
      console.log('Fetching project for slug:', decodedSlug)
      
      // DEBUG: List all projects to see what slugs are available
      const { data: allProjects } = await supabase.from('projects').select('title, slug, id')
      console.log('Available projects in DB:', allProjects)

      // Attempt 1: Fetch by slug
      const { data, error: fetchError } = await supabase
        .from('projects')
        .select('*')
        .eq('slug', decodedSlug)
        .single()

      if (data) {
        console.log('Project found by slug:', data.title)
        setProject(data as Project)
        if (!data.is_private) setIsUnlocked(true)
        setLoading(false)
        return
      }

      console.warn('Slug fetch failed, trying ID fallback...', fetchError)

      // Attempt 2: Fallback to ID
      const { data: idData, error: idError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', decodedSlug)
        .single()

      if (idData) {
        console.log('Project found by ID fallback:', idData.title)
        setProject(idData as Project)
        if (!idData.is_private) setIsUnlocked(true)
      } else {
        console.error('Final fetch error:', idError)
        // If we found the project in the "allProjects" list but the direct fetch failed, 
        // it might be a weird encoding or RLS issue with .single()
        const foundInList = (allProjects as any[])?.find((p: any) => p.slug === decodedSlug || p.id === decodedSlug)
        if (foundInList) {
          console.log('Project found in list, fetching by ID directly...')
          const { data: finalData } = await supabase.from('projects').select('*').eq('id', foundInList.id).single()
          if (finalData) {
            setProject(finalData as Project)
            if (!finalData.is_private) setIsUnlocked(true)
            setLoading(false)
            return
          }
        }
        router.push('/#projects')
      }
      setLoading(false)
    }

    if (slug) fetchProject()
  }, [slug, supabase, router])

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (project?.password === passwordInput) {
      setIsUnlocked(true)
      setError('')
    } else {
      setError('Incorrect password. Access denied.')
      setPasswordInput('')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="relative">
          <div className="absolute inset-0 blur-xl bg-blue-500/20 rounded-full animate-pulse" />
          <div className="relative animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
        </div>
      </div>
    )
  }

  if (!project) return null

  const techArray = Array.isArray(project.technologies) 
    ? project.technologies 
    : (typeof project.technologies === 'string' ? project.technologies.split(',').map(t => t.trim()).filter(Boolean) : [])

  return (
    <main className="bg-[#0a0a0a] min-h-screen text-white pb-24">
      {/* Hero Section */}
      <div className="relative h-[60vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent z-10" />
        {project.image_url ? (
          <motion.img 
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            src={project.image_url} 
            alt={project.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-[#111] flex items-center justify-center">
             <div className="flex flex-col items-center gap-3 text-gray-500">
               <Globe size={64} className="opacity-10" />
               <span className="text-sm font-medium tracking-widest uppercase opacity-50">No Image Available</span>
             </div>
          </div>
        )}
        
        <div className="absolute inset-0 z-20 flex flex-col justify-end px-6 pb-12">
          <div className="container mx-auto">
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              Back to Projects
            </motion.button>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex flex-wrap gap-3 mb-4">
                <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-bold uppercase tracking-wider">
                  {project.category || 'General'}
                </span>
                {project.is_private && (
                  <span className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck size={12} />
                    Secured
                  </span>
                )}
              </div>
              <h1 className="text-5xl md:text-7xl font-bold mb-6">{project.title || 'Untitled Project'}</h1>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-6 mt-12">
        <AnimatePresence mode="wait">
          {!isUnlocked ? (
            <motion.div 
              key="password-gate"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-xl mx-auto mt-12"
            >
              <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-10 text-center shadow-2xl shadow-black/50">
                <div className="w-20 h-20 bg-yellow-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-yellow-500/20">
                  <ShieldCheck size={40} className="text-yellow-500" />
                </div>
                <h2 className="text-3xl font-bold mb-3">Password Protected</h2>
                <p className="text-gray-400 mb-8 leading-relaxed">
                  This project contains sensitive information and is currently encrypted. Please enter the access key to view the full case study.
                </p>
                
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div className="relative group">
                    <input 
                      type="password"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="Enter access key..."
                      className="w-full bg-[#0a0a0a] border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-blue-500/50 transition-all text-center text-lg tracking-[0.5em] group-hover:border-white/20"
                      autoFocus
                    />
                  </div>
                  
                  {error && (
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-red-400 text-sm font-medium"
                    >
                      {error}
                    </motion.p>
                  )}

                  <button 
                    type="submit"
                    className="w-full bg-white text-black font-bold py-4 rounded-2xl hover:bg-gray-200 transition-all active:scale-[0.98]"
                  >
                    Unlock Case Study
                  </button>
                </form>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start"
            >
              <div className="lg:col-span-8 space-y-12">
                <section>
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <Tag className="text-blue-500" />
                    Project Overview
                  </h2>
                  <p className="text-gray-400 text-lg leading-relaxed whitespace-pre-wrap break-words overflow-wrap-anywhere">
                    {project.long_description || project.description || 'No description provided.'}
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-6">Technologies Used</h2>
                  <div className="flex flex-wrap gap-4">
                    {techArray.length > 0 ? techArray.map((tech, i) => (
                      <motion.div 
                        key={i}
                        whileHover={{ y: -5 }}
                        className="px-6 py-3 rounded-2xl bg-[#111] border border-white/5 flex flex-col items-center gap-2 hover:border-blue-500/30 transition-all cursor-default"
                      >
                        <span className="font-bold text-white">{tech}</span>
                      </motion.div>
                    )) : (
                      <p className="text-gray-500 italic">No technologies listed.</p>
                    )}
                  </div>
                </section>
              </div>

              <div className="lg:col-span-4 space-y-8">
                <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-8 sticky top-8 shadow-xl">
                  <h3 className="text-xl font-bold mb-6">Links & Meta</h3>
                  
                  <div className="space-y-6">
                    {project.live_url && (
                      <a 
                        href={project.live_url}
                        target="_blank"
                        className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all flex items-center justify-center gap-3 shadow-lg shadow-blue-500/20 active:scale-[0.98]"
                      >
                        <ExternalLink size={20} />
                        View Live Demo
                      </a>
                    )}
                    
                    {project.github_url && (
                      <a 
                        href={project.github_url}
                        target="_blank"
                        className="w-full py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold transition-all border border-white/10 flex items-center justify-center gap-3 active:scale-[0.98]"
                      >
                        <GithubIcon size={20} />
                        Source Code
                      </a>
                    )}

                    <div className="pt-6 border-t border-white/5 space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500 flex items-center gap-2"><Calendar size={16} /> Date</span>
                        <span className="text-gray-300 font-medium">
                          {project.created_at ? new Date(project.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'N/A'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500 flex items-center gap-2"><Globe size={16} /> Status</span>
                        <span className="text-green-400 font-medium">Completed</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}
