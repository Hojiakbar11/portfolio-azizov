'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import ProjectForm from '@/components/ProjectForm'
import { 
  Plus, 
  LayoutDashboard, 
  LogOut, 
  Trash2, 
  Edit3, 
  Globe, 
  Eye,
  EyeOff,
  Download,
  Upload
} from 'lucide-react'
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

export default function AdminDashboard() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [uploadingCv, setUploadingCv] = useState(false)
  const [cvStatus, setCvStatus] = useState<string | null>(null)
  
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkUser = async () => {
      if (!supabase || !supabase.auth) return
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
      } else {
        setUser(user)
        fetchProjects()
      }
    }
    checkUser()
  }, [supabase, router])

  const fetchProjects = async () => {
    if (!supabase || !supabase.from) {
      setLoading(false)
      return
    }
    setLoading(true)
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (data) setProjects(data)
    setLoading(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const deleteProject = async (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      const { error } = await supabase.from('projects').delete().eq('id', id)
      if (!error) {
        setProjects(prev => prev.filter(p => p.id !== id))
      } else {
        alert(error.message)
      }
    }
  }

  const handleCvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingCv(true)
    setCvStatus(null)

    const { data, error } = await supabase.storage
      .from('cvs')
      .upload('cv.pdf', file, {
        upsert: true,
        contentType: 'application/pdf'
      })

    setUploadingCv(false)
    if (error) {
      alert('Error uploading CV: ' + error.message)
    } else {
      setCvStatus('CV uploaded successfully!')
      setTimeout(() => setCvStatus(null), 3000)
    }
  }

  const openAddForm = () => {
    setEditingProject(null)
    setIsFormOpen(true)
  }

  const openEditForm = (project: Project) => {
    setEditingProject(project)
    setIsFormOpen(true)
  }

  if (loading && !user) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {isFormOpen && (
        <ProjectForm 
          onClose={() => setIsFormOpen(false)} 
          onSuccess={fetchProjects}
          project={editingProject}
        />
      )}
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-[#111] border-r border-white/5 p-6 hidden md:block">
        <div className="flex items-center gap-3 mb-12">
          <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
            <LayoutDashboard size={20} />
          </div>
          <span className="font-bold text-lg">Admin Panel</span>
        </div>

        <nav className="space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-600 text-white font-medium transition-all">
            <LayoutDashboard size={18} />
            Dashboard
          </button>
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-all text-sm font-medium"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="md:ml-64 p-8">
        <div className="flex flex-col gap-12">
          {/* CV Management Section */}
          <section className="bg-[#111] border border-white/5 rounded-2xl p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                  <Download size={20} className="text-blue-400" />
                  CV Management
                </h2>
                <p className="text-gray-400 text-sm">Upload your latest CV (PDF format). This will be available for download on the public site.</p>
              </div>
              
              <div className="relative">
                <input 
                  type="file" 
                  accept=".pdf" 
                  onChange={handleCvUpload}
                  className="hidden" 
                  id="cv-upload"
                  disabled={uploadingCv}
                />
                <label 
                  htmlFor="cv-upload"
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer font-medium ${uploadingCv ? 'opacity-50 pointer-events-none' : ''}`}
                >
                  {uploadingCv ? (
                    <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /> Uploading...</>
                  ) : (
                    <><Upload size={18} /> Upload New CV</>
                  )}
                </label>
                {cvStatus && <p className="absolute top-full mt-2 left-0 text-xs text-green-400 font-medium">{cvStatus}</p>}
              </div>
            </div>
          </section>

          {/* Projects Management Section */}
          <section>
            <header className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold">Projects</h2>
                <p className="text-gray-400 mt-1">Total: {projects.length} projects</p>
              </div>
              
              <button 
                onClick={openAddForm}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 transition-all font-semibold shadow-lg shadow-blue-500/20"
              >
                <Plus size={20} />
                Add New Project
              </button>
            </header>

            {loading ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 opacity-50">
                {[1, 2].map(i => (
                  <div key={i} className="h-48 bg-[#111] rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-24 rounded-3xl border border-dashed border-white/10 bg-white/5">
                <p className="text-gray-500 text-lg mb-6">You haven't added any projects yet.</p>
                <button onClick={openAddForm} className="text-blue-400 font-medium hover:underline">Create your first project →</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {projects.map(project => (
                  <div 
                    key={project.id}
                    className="bg-[#111] border border-white/5 rounded-2xl p-6 flex gap-6 group hover:border-white/10 transition-all"
                  >
                    <div className="w-32 h-32 rounded-xl overflow-hidden bg-black/40 shrink-0">
                      <img src={project.image_url} alt="" className="w-full h-full object-cover" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold text-lg truncate pr-4">{project.title}</h3>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => openEditForm(project)}
                            className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-all"
                            title="Edit Project"
                          >
                            <Edit3 size={18} />
                          </button>
                          <button 
                            onClick={() => deleteProject(project.id)}
                            className="p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-all"
                            title="Delete Project"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-400 line-clamp-2 mb-4">{project.description}</p>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          {project.is_private ? <EyeOff size={14} /> : <Eye size={14} />}
                          {project.is_private ? 'Private' : 'Public'}
                        </span>
                        {project.live_url && <span className="flex items-center gap-1"><Globe size={14} /> Live</span>}
                        {project.github_url && <span className="flex items-center gap-1"><GithubIcon size={14} /> Repo</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}
