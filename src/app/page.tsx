import dynamic from 'next/dynamic'
import { createClient } from '@/lib/supabase'
import Hero from '@/components/sections/Hero'

// Dynamic imports for components below the fold
const Terminal = dynamic(() => import('@/components/Terminal'), { 
  loading: () => <div className="h-[400px] w-full bg-[#050505] animate-pulse rounded-2xl border border-blue-500/10" />
})
const Projects = dynamic(() => import('@/components/sections/Projects'))
const Timeline = dynamic(() => import('@/components/sections/Timeline'))
const Skills = dynamic(() => import('@/components/sections/Skills'))
const Contact = dynamic(() => import('@/components/sections/Contact'))

export const revalidate = 0 // Disable cache for live updates

async function getData() {
  const supabase = createClient()
  
  const [
    { data: experience },
    { data: education },
    { data: skills },
    { data: projects },
    { data: commands }
  ] = await Promise.all([
    supabase.from('experience').select('*').order('order_index'),
    supabase.from('education').select('*').order('order_index'),
    supabase.from('skills').select('*'),
    supabase.from('projects').select('*').order('created_at', { ascending: false }),
    supabase.from('terminal_commands').select('*')
  ])

  return {
    experience: experience || [],
    education: education || [],
    skills: skills || [],
    projects: projects || [],
    commands: commands || []
  }
}

export default async function Home() {
  const { experience, education, skills, projects, commands } = await getData()

  return (
    <div className="bg-[#0a0a0a] min-h-screen">
      <Hero />
      
      <Projects projects={projects} />
      
      <Timeline 
        experience={experience} 
        education={education} 
      />

      <Skills skills={skills} />

      <section className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <Terminal initialCommands={commands} />
        </div>
      </section>

      <Contact />
      
      <footer className="py-12 border-t border-white/5 text-center text-gray-600 text-sm">
        <p>© {new Date().getFullYear()} Hojiakbar Azizov Portfolio. Built with Next.js & Supabase.</p>
      </footer>
    </div>
  )
}
