import { createClient } from '@/lib/supabase'
import Hero from '@/components/sections/Hero'
import Projects from '@/components/sections/Projects'
import Timeline from '@/components/sections/Timeline'
import Skills from '@/components/sections/Skills'
import Contact from '@/components/sections/Contact'
import Terminal from '@/components/Terminal'

export const revalidate = 0 // Disable cache to ensure live updates from Cockpit

async function getData() {
  const supabase = createClient()
  
  const [
    { data: experience },
    { data: education },
    { data: skills }
  ] = await Promise.all([
    supabase.from('experience').select('*').order('order_index'),
    supabase.from('education').select('*').order('order_index'),
    supabase.from('skills').select('*')
  ])

  return {
    experience: experience || [],
    education: education || [],
    skills: skills || []
  }
}

export default async function Home() {
  const { experience, education, skills } = await getData()

  return (
    <div className="bg-[#0a0a0a] min-h-screen">
      <Hero />
      
      <section className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <Terminal />
        </div>
      </section>

      <Projects />
      
      <Timeline 
        experience={experience} 
        education={education} 
      />

      <Skills skills={skills} />

      <Contact />
      
      <footer className="py-12 border-t border-white/5 text-center text-gray-600 text-sm">
        <p>© {new Date().getFullYear()} Admin Cockpit Portfolio. Built with Next.js & Supabase.</p>
      </footer>
    </div>
  )
}
