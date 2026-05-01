import Hero from '@/components/sections/Hero'
import Projects from '@/components/sections/Projects'

export default function Home() {
  return (
    <main className="bg-[#0a0a0a] min-h-screen">
      <Hero />
      <Projects />
      
      {/* Simple Footer */}
      <footer className="py-12 border-t border-white/5 bg-[#0a0a0a]">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} John Doe. Built with Next.js & Supabase.
          </p>
        </div>
      </footer>
    </main>
  )
}
