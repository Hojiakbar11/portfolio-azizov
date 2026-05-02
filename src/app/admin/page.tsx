'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import ProjectForm from '@/components/ProjectForm'
import EntityForm from '@/components/EntityForm'
import { 
  Plus, 
  LayoutDashboard, 
  LogOut, 
  Trash2, 
  Edit3, 
  Globe, 
  Eye,
  EyeOff,
  User,
  Briefcase,
  GraduationCap,
  Wrench,
  Link2,
  Mail,
  ChevronRight,
  Shield,
  Search,
  Check,
  CheckCircle2,
  Loader2
} from 'lucide-react'

type Section = 'dashboard' | 'profile' | 'projects' | 'experience' | 'education' | 'skills' | 'messages' | 'taplinks' | 'terminal_commands'

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState<Section>('dashboard')
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  
  // Data States
  const [projects, setProjects] = useState<any[]>([])
  const [profile, setProfile] = useState<any>(null)
  const [experience, setExperience] = useState<any[]>([])
  const [education, setEducation] = useState<any[]>([])
  const [skills, setSkills] = useState<any[]>([])
  const [messages, setMessages] = useState<any[]>([])
  const [taplinks, setTaplinks] = useState<any[]>([])
  const [terminalCommands, setTerminalCommands] = useState<any[]>([])

  // Modal States
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<any>(null)
  const [isEntityModalOpen, setIsEntityModalOpen] = useState(false)
  const [editingEntity, setEditingEntity] = useState<any>(null)

  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
      } else {
        setUser(user)
        fetchAllData()
      }
    }
    checkUser()
  }, [supabase, router])

  const fetchAllData = async () => {
    setLoading(true)
    const [
      { data: projs },
      { data: prof },
      { data: exp },
      { data: edu },
      { data: sks },
      { data: msgs },
      { data: taps },
      { data: terms }
    ] = await Promise.all([
      supabase.from('projects').select('*').order('created_at', { ascending: false }),
      supabase.from('profile').select('*').maybeSingle(),
      supabase.from('experience').select('*').order('order_index'),
      supabase.from('education').select('*').order('order_index'),
      supabase.from('skills').select('*'),
      supabase.from('messages').select('*').order('created_at', { ascending: false }),
      supabase.from('taplinks').select('*').order('order_index'),
      supabase.from('terminal_commands').select('*').order('command_name')
    ])

    if (projs) setProjects(projs)
    if (prof) setProfile(prof)
    if (exp) setExperience(exp)
    if (edu) setEducation(edu)
    if (sks) setSkills(sks)
    if (msgs) setMessages(msgs)
    if (taps) setTaplinks(taps)
    if (terms) setTerminalCommands(terms)
    
    setLoading(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const deleteItem = async (table: string, id: string) => {
    if (confirm(`Are you sure you want to delete this ${table.slice(0, -1)}?`)) {
      try {
        const { error } = await supabase.from(table).delete().eq('id', id)
        if (error) throw error
        await fetchAllData()
      } catch (err: any) {
        alert(`Error deleting item: ${err.message}`)
      }
    }
  }

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setSaveSuccess(false)
    const { error } = await supabase.from('profile').upsert({ ...profile, updated_at: new Date().toISOString() })
    setIsSaving(false)
    if (!error) {
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    }
  }

  const saveEntity = async (data: any) => {
    const table = activeSection
    try {
      let error
      if (data.id) {
        const { error: updateError } = await supabase.from(table).update(data).eq('id', data.id)
        error = updateError
      } else {
        const { error: insertError } = await supabase.from(table).insert([data])
        error = insertError
      }
      
      if (error) throw error
      
      await fetchAllData()
      return true // Success
    } catch (err: any) {
      console.error(`Error saving ${table}:`, err)
      alert(`Error saving to ${table}: ${err.message}`)
      return false // Failure
    }
  }

interface Field {
  key: string
  label: string
  type: 'text' | 'textarea' | 'number' | 'url'
  required?: boolean
  placeholder?: string
}

const getEntityFields = (): Field[] => {
  switch (activeSection) {
    case 'experience':
      return [
        { key: 'title', label: 'Job Title', type: 'text', required: true, placeholder: 'e.g., Senior Full Stack Developer' },
        { key: 'company', label: 'Company Name', type: 'text', required: true, placeholder: 'e.g., Google' },
        { key: 'date_range', label: 'Date Range', type: 'text', placeholder: 'e.g., 2021 - Present' },
        { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Briefly describe your responsibilities or achievements...' },
        { key: 'order_index', label: 'Order Index', type: 'number', placeholder: 'Number for sorting (e.g., 1, 2, 3)' }
      ]
    case 'education':
      return [
        { key: 'degree', label: 'Degree / Certificate', type: 'text', required: true, placeholder: 'e.g., B.Sc in Computer Science' },
        { key: 'school', label: 'Institution Name', type: 'text', required: true, placeholder: 'e.g., IDU University' },
        { key: 'date_range', label: 'Date Range', type: 'text', placeholder: 'e.g., 2018 - 2022' },
        { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Major, GPA, or notable coursework...' },
        { key: 'order_index', label: 'Order Index', type: 'number', placeholder: 'Number for sorting (e.g., 1, 2, 3)' }
      ]
    case 'skills':
      return [
        { key: 'name', label: 'Skill Name', type: 'text', required: true, placeholder: 'e.g., React' },
        { key: 'category', label: 'Category (e.g., Frontend)', type: 'text', placeholder: 'e.g., Frontend' },
        { key: 'icon_name', label: 'Lucide Icon Name', type: 'text', placeholder: 'e.g., code' }
      ]
    case 'taplinks':
      return [
        { key: 'title', label: 'Link Title', type: 'text', required: true, placeholder: 'e.g., GitHub' },
        { key: 'url', label: 'URL', type: 'url', required: true, placeholder: 'https://github.com/...' },
        { key: 'icon_name', label: 'Lucide Icon Name', type: 'text', placeholder: 'e.g., github' },
        { key: 'order_index', label: 'Order Index', type: 'number', placeholder: '1' }
      ]
    case 'terminal_commands':
      return [
        { key: 'command_name', label: 'Command (e.g., about)', type: 'text', required: true, placeholder: 'e.g., about' },
        { key: 'response_text', label: 'Response Text', type: 'textarea', required: true, placeholder: 'The text that terminal will output...' },
        { key: 'category', label: 'Category', type: 'text', placeholder: 'e.g., General' }
      ]
    default:
      return []
  }
}

  if (loading && !user) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    )
  }

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'projects', label: 'Projects', icon: Globe },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'skills', label: 'Skills', icon: Wrench },
    { id: 'messages', label: 'Messages', icon: Mail, badge: messages.filter(m => !m.is_read).length },
    { id: 'terminal_commands', label: 'Terminal', icon: Shield },
    { id: 'taplinks', label: 'Taplinks', icon: Link2 },
  ]

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#111] border-r border-white/5 flex flex-col sticky top-0 h-screen overflow-y-auto">
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shadow-lg shadow-blue-500/10">
            <Shield size={22} />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight text-white">Cockpit</h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Admin Panel</p>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id as Section)}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                activeSection === item.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon size={18} className={activeSection === item.id ? 'text-white' : 'text-gray-500 group-hover:text-blue-400 transition-colors'} />
                <span className="font-medium text-sm">{item.label}</span>
              </div>
              {item.badge ? (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${activeSection === item.id ? 'bg-white text-blue-600' : 'bg-blue-600 text-white'}`}>
                  {item.badge}
                </span>
              ) : (
                <ChevronRight size={14} className={`opacity-0 group-hover:opacity-100 transition-opacity ${activeSection === item.id ? 'hidden' : ''}`} />
              )}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5">
          <div className="bg-white/5 rounded-2xl p-4 mb-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-sm font-bold">
              {user?.email?.[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate">{user?.email}</p>
              <p className="text-[10px] text-gray-500">Root Admin</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 text-gray-500 hover:text-red-400 transition-all text-sm font-medium">
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-10 max-w-7xl">
        <header className="mb-12 flex items-center justify-between">
          <div>
            <h2 className="text-4xl font-bold mb-2">{navItems.find(n => n.id === activeSection)?.label}</h2>
            <p className="text-gray-400">Manage your {activeSection} data dynamically via Supabase.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" size={16} />
              <input type="text" placeholder="Global Search..." className="bg-[#111] border border-white/5 rounded-2xl py-3 pl-12 pr-12 outline-none focus:border-blue-500/50 transition-all text-sm w-64" />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded border border-white/10 bg-white/5 text-[10px] font-mono text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                /
              </div>
            </div>
            <button className="p-3 rounded-2xl bg-[#111] border border-white/5 text-gray-400 hover:text-white transition-all"><Check size={20} /></button>
          </div>
        </header>

        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {activeSection === 'dashboard' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { id: 'projects', label: 'Total Projects', value: projects.length, icon: Globe, color: 'bg-blue-500' },
                { id: 'messages', label: 'Unread Messages', value: messages.filter(m => !m.is_read).length, icon: Mail, color: 'bg-red-500' },
                { id: 'experience', label: 'Experience Nodes', value: experience.length, icon: Briefcase, color: 'bg-green-500' },
                { id: 'skills', label: 'Total Skills', value: skills.length, icon: Wrench, color: 'bg-purple-500' }
              ].map((stat, i) => (
                <button key={i} onClick={() => setActiveSection(stat.id as Section)} className="text-left bg-[#111] border border-white/5 rounded-3xl p-6 relative overflow-hidden group hover:border-blue-500/30 transition-all">
                  <div className={`absolute top-0 right-0 w-24 h-24 ${stat.color} opacity-5 blur-[40px] group-hover:opacity-10 transition-opacity`} />
                  <div className={`w-12 h-12 rounded-2xl ${stat.color}/20 flex items-center justify-center mb-4`}>
                    <stat.icon size={24} className={stat.color.replace('bg-', 'text-')} />
                  </div>
                  <p className="text-gray-500 text-sm font-medium mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </button>
              ))}
              <div className="lg:col-span-3 bg-[#111] border border-white/5 rounded-3xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">Recent Activity</h3>
                  <button onClick={() => setActiveSection('messages')} className="text-blue-400 text-sm hover:underline">View all</button>
                </div>
                <div className="space-y-4">
                  {messages.slice(0, 3).map((msg, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center"><Mail size={18} /></div>
                        <div>
                          <p className="text-sm font-bold">{msg.name}</p>
                          <p className="text-xs text-gray-500">{msg.subject}</p>
                        </div>
                      </div>
                      <span className="text-[10px] text-gray-600">{new Date(msg.created_at).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSection === 'profile' && (
            <form onSubmit={saveProfile} className="bg-[#111] border border-white/5 rounded-3xl p-10 space-y-8 relative overflow-hidden">
              {saveSuccess && (
                <div className="absolute top-6 right-6 flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-500 rounded-xl border border-green-500/20 animate-in slide-in-from-top-2">
                  <CheckCircle2 size={16} />
                  <span className="text-sm font-bold">Profile Updated Successfully!</span>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Full Name</label>
                  <input required value={profile?.full_name || ''} onChange={e => setProfile({...profile, full_name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:border-blue-500 outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Professional Role</label>
                  <input required value={profile?.role || ''} onChange={e => setProfile({...profile, role: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:border-blue-500 outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Email Address</label>
                  <input required value={profile?.email || ''} onChange={e => setProfile({...profile, email: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:border-blue-500 outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Location</label>
                  <input required value={profile?.location || ''} onChange={e => setProfile({...profile, location: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:border-blue-500 outline-none transition-all" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Short Bio</label>
                <textarea required rows={2} value={profile?.short_bio || ''} onChange={e => setProfile({...profile, short_bio: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:border-blue-500 outline-none transition-all resize-none" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">About Me (Long)</label>
                <textarea required rows={6} value={profile?.about_me_long || ''} onChange={e => setProfile({...profile, about_me_long: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:border-blue-500 outline-none transition-all resize-none" />
              </div>
              <button type="submit" disabled={isSaving} className="px-12 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-500/20 flex items-center gap-3">
                {isSaving ? <Loader2 className="animate-spin" size={20} /> : 'Save Profile Changes'}
              </button>
            </form>
          )}

          {activeSection === 'projects' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">Project Catalog</h3>
                <button onClick={() => { setEditingProject(null); setIsProjectModalOpen(true); }} className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-500/20">
                  <Plus size={18} /> Add Project
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map(project => (
                  <div key={project.id} className="bg-[#111] border border-white/5 rounded-3xl p-6 flex gap-6 group hover:border-white/10 transition-all">
                    <div className="w-32 h-32 rounded-2xl overflow-hidden bg-black/40 border border-white/5 shrink-0">
                      {project.image_url ? (
                        <img src={project.image_url} className="w-full h-full object-cover" alt="" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-neutral-800 text-gray-600"><Globe size={32} /></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-bold text-lg truncate pr-2">{project.title}</h4>
                          <div className="flex gap-1">
                            <button onClick={() => { setEditingProject(project); setIsProjectModalOpen(true); }} className="p-2 rounded-lg hover:bg-white/5 text-gray-500 hover:text-blue-400 transition-all"><Edit3 size={16} /></button>
                            <button onClick={() => deleteItem('projects', project.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-gray-500 hover:text-red-400 transition-all"><Trash2 size={16} /></button>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{project.description}</p>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] font-bold">
                        <span className="px-2 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">{project.category}</span>
                        <span className={`flex items-center gap-1 ${project.is_private ? 'text-yellow-500' : 'text-green-500'}`}>
                          {project.is_private ? <EyeOff size={12} /> : <Eye size={12} />}
                          {project.is_private ? `Private (${project.password || 'No Pass'})` : 'Public'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {['experience', 'education', 'skills', 'taplinks', 'terminal_commands'].includes(activeSection) && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">Manage {activeSection}</h3>
                <button onClick={() => { setEditingEntity(null); setIsEntityModalOpen(true); }} className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-500/20">
                  <Plus size={18} /> Add {activeSection.slice(0, -1)}
                </button>
              </div>

              <div className="bg-[#111] border border-white/5 rounded-3xl p-8">
                {(activeSection === 'experience' ? experience : 
                  activeSection === 'education' ? education : 
                  activeSection === 'skills' ? skills : 
                  activeSection === 'terminal_commands' ? terminalCommands :
                  taplinks).length === 0 ? (
                  <div className="text-center py-12 text-gray-500 italic">No entries found for {activeSection}.</div>
                ) : (
                  <div className="space-y-4">
                    {(activeSection === 'experience' ? experience : 
                      activeSection === 'education' ? education : 
                      activeSection === 'skills' ? skills : 
                      activeSection === 'terminal_commands' ? terminalCommands :
                      taplinks).map((item: any) => (
                      <div key={item.id} className="flex items-center justify-between p-5 bg-white/5 rounded-2xl group hover:border-white/10 transition-all border border-transparent">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                            {activeSection === 'experience' ? <Briefcase size={18} /> : 
                             activeSection === 'education' ? <GraduationCap size={18} /> : 
                             activeSection === 'skills' ? <Wrench size={18} /> : 
                             activeSection === 'terminal_commands' ? <Shield size={18} /> :
                             <Link2 size={18} />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-sm truncate">
                              {item.title || item.name || item.degree || (item.command_name ? `/${item.command_name}` : 'Untitled')}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {item.company || item.school || item.url || item.response_text || item.category || 'No details'}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => { setEditingEntity(item); setIsEntityModalOpen(true); }} className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-blue-400"><Edit3 size={16} /></button>
                          <button onClick={() => deleteItem(activeSection, item.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-gray-500 hover:text-red-400"><Trash2 size={16} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeSection === 'messages' && (
            <div className="bg-[#111] border border-white/5 rounded-3xl overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-white/5 border-b border-white/5">
                  <tr>
                    <th className="px-8 py-5 text-sm font-bold">Sender</th>
                    <th className="px-8 py-5 text-sm font-bold">Subject</th>
                    <th className="px-8 py-5 text-sm font-bold">Date</th>
                    <th className="px-8 py-5 text-sm font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {messages.map(msg => (
                    <tr key={msg.id} className={`group hover:bg-white/[0.02] transition-colors ${!msg.is_read ? 'bg-blue-500/[0.02]' : ''}`}>
                      <td className="px-8 py-6">
                        <p className="font-bold text-sm">{msg.name}</p>
                        <p className="text-xs text-gray-500">{msg.email}</p>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-sm font-medium">{msg.subject}</p>
                        <p className="text-xs text-gray-500 truncate max-w-md">{msg.message}</p>
                      </td>
                      <td className="px-8 py-6 text-xs text-gray-500 font-medium">{new Date(msg.created_at).toLocaleDateString()}</td>
                      <td className="px-8 py-6 text-right">
                        <button onClick={() => deleteItem('messages', msg.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-gray-500 hover:text-red-400 transition-all opacity-0 group-hover:opacity-100"><Trash2 size={18} /></button>
                      </td>
                    </tr>
                  ))}
                  {messages.length === 0 && (
                    <tr><td colSpan={4} className="px-8 py-24 text-center text-gray-500 font-medium italic">No messages in your inbox yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {isProjectModalOpen && (
        <ProjectForm project={editingProject} onClose={() => setIsProjectModalOpen(false)} onSuccess={() => { fetchAllData(); setIsProjectModalOpen(false); }} />
      )}

      {isEntityModalOpen && (
        <EntityForm 
          title={activeSection.charAt(0).toUpperCase() + activeSection.slice(1, -1)}
          entity={editingEntity}
          fields={getEntityFields()}
          onClose={() => setIsEntityModalOpen(false)}
          onSave={saveEntity}
        />
      )}
    </div>
  )
}
