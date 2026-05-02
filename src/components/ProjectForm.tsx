'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase'
import { X, Upload, Loader2, Image as ImageIcon } from 'lucide-react'

interface ProjectFormProps {
  onClose: () => void
  onSuccess: () => void
  project?: any // For editing
}

export default function ProjectForm({ onClose, onSuccess, project }: ProjectFormProps) {
  const [title, setTitle] = useState(project?.title || '')
  const [description, setDescription] = useState(project?.description || '')
  const [longDescription, setLongDescription] = useState(project?.long_description || '')
  const [imageUrl, setImageUrl] = useState(project?.image_url || '')
  const [githubUrl, setGithubUrl] = useState(project?.github_url || '')
  const [liveUrl, setLiveUrl] = useState(project?.live_url || '')
  const [isPrivate, setIsPrivate] = useState(project?.is_private || false)
  const [password, setPassword] = useState(project?.password || '')
  const [category, setCategory] = useState(project?.category || 'Web Development')
  const [technologies, setTechnologies] = useState(
    Array.isArray(project?.technologies) ? project.technologies.join(', ') : ''
  )
  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const supabase = createClient()

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [onClose])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = fileName

      const { error: uploadError } = await supabase.storage
        .from('project-images')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('project-images')
        .getPublicUrl(filePath)

      setImageUrl(publicUrl)
    } catch (error: any) {
      alert('Error uploading image: ' + error.message)
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (uploadingImage) return

    setLoading(true)

    const projectData = {
      title,
      description,
      long_description: longDescription,
      image_url: imageUrl,
      github_url: githubUrl,
      live_url: liveUrl,
      is_private: isPrivate,
      password: isPrivate ? password : null,
      category,
      technologies: technologies.split(',').map((t: string) => t.trim()).filter((t: string) => t !== ''),
    }

    let error
    if (project?.id) {
      const { error: updateError } = await supabase
        .from('projects')
        .update(projectData)
        .eq('id', project.id)
      error = updateError
    } else {
      const { error: insertError } = await supabase
        .from('projects')
        .insert([projectData])
      error = insertError
    }

    setLoading(false)
    if (!error) {
      onSuccess()
      onClose()
    } else {
      alert(error.message)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-4xl bg-[#111] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">{project ? 'Edit Project' : 'Add New Project'}</h2>
          <button 
            onClick={onClose} 
            className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[85vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: Basic Info & Image */}
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Project Title</label>
                <input
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-blue-500 outline-none"
                  placeholder="My Awesome App"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Category</label>
                <select 
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-blue-500 outline-none"
                >
                  <option value="Web Development">Web Development</option>
                  <option value="Mobile App">Mobile App</option>
                  <option value="Cybersecurity">Cybersecurity</option>
                  <option value="AI / ML">AI / ML</option>
                  <option value="UI/UX Design">UI/UX Design</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Short Description</label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-blue-500 outline-none resize-none"
                  placeholder="A brief summary of the project..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Project Image</label>
                <div className="flex flex-col gap-4">
                  {imageUrl && (
                    <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10 bg-black/40">
                      <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                      <button 
                        type="button"
                        onClick={() => setImageUrl('')}
                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-white hover:bg-red-500 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}
                  
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    ref={fileInputRef}
                  />
                  
                  {!imageUrl && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingImage}
                      className="w-full aspect-video flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-white/10 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all group"
                    >
                      {uploadingImage ? (
                        <Loader2 className="animate-spin text-blue-500" size={32} />
                      ) : (
                        <>
                          <div className="p-3 rounded-full bg-white/5 group-hover:bg-blue-500/20 group-hover:text-blue-400 transition-all">
                            <Upload size={24} />
                          </div>
                          <span className="text-sm text-gray-500 group-hover:text-gray-300">Click to upload image</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Long Description & Tech */}
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Detailed Description (Markdown Supported)</label>
                <textarea
                  rows={10}
                  value={longDescription}
                  onChange={e => setLongDescription(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-blue-500 outline-none resize-none h-[280px]"
                  placeholder="Describe the project in detail, features, challenges, etc..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Technologies (comma separated)</label>
                <input
                  value={technologies}
                  onChange={e => setTechnologies(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-blue-500 outline-none"
                  placeholder="Next.js, TypeScript, Tailwind"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">GitHub URL</label>
                  <input
                    value={githubUrl}
                    onChange={e => setGithubUrl(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-blue-500 outline-none"
                    placeholder="https://github.com/..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Live Demo URL</label>
                  <input
                    value={liveUrl}
                    onChange={e => setLiveUrl(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-blue-500 outline-none"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="space-y-4 py-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_private"
                    checked={isPrivate}
                    onChange={e => setIsPrivate(e.target.checked)}
                    className="w-4 h-4 rounded border-white/10 bg-white/5 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="is_private" className="text-sm text-gray-300">Mark as private (password protected)</label>
                </div>

                {isPrivate && (
                  <div className="space-y-2 animate-in slide-in-from-top-2">
                    <label className="text-sm font-medium text-gray-400">Project Password</label>
                    <input
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-blue-500 outline-none"
                      placeholder="Enter access key..."
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/5 flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="group flex-1 py-4 rounded-2xl border border-white/10 text-gray-400 font-medium hover:bg-white/5 transition-all flex items-center justify-center gap-2"
            >
              Cancel
              <span className="px-1.5 py-0.5 rounded border border-white/10 bg-white/5 text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity">Esc</span>
            </button>
            <button
              type="submit"
              disabled={loading || uploadingImage}
              className="group flex-[2] py-4 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin mx-auto" /> : (
                <>
                  {project ? 'Save Changes' : 'Create Project'}
                  <span className="px-1.5 py-0.5 rounded border border-white/20 bg-white/10 text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity">Enter</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
