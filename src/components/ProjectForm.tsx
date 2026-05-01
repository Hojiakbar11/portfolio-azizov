'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { X, Upload, Loader2 } from 'lucide-react'

interface ProjectFormProps {
  onClose: () => void
  onSuccess: () => void
  project?: any // For editing
}

export default function ProjectForm({ onClose, onSuccess, project }: ProjectFormProps) {
  const [title, setTitle] = useState(project?.title || '')
  const [description, setDescription] = useState(project?.description || '')
  const [imageUrl, setImageUrl] = useState(project?.image_url || '')
  const [githubUrl, setGithubUrl] = useState(project?.github_url || '')
  const [liveUrl, setLiveUrl] = useState(project?.live_url || '')
  const [isPrivate, setIsPrivate] = useState(project?.is_private || false)
  const [technologies, setTechnologies] = useState(
    Array.isArray(project?.technologies) ? project.technologies.join(', ') : ''
  )
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const projectData = {
      title,
      description,
      image_url: imageUrl,
      github_url: githubUrl,
      live_url: liveUrl,
      is_private: isPrivate,
      technologies: technologies.split(',').map(t => t.trim()).filter(t => t !== ''),
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
      <div className="w-full max-w-2xl bg-[#111] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">{project ? 'Edit Project' : 'Add New Project'}</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5 text-gray-400">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Project Title</label>
              <input
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-4 text-white focus:border-blue-500 outline-none"
                placeholder="My Awesome App"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Image URL</label>
              <input
                value={imageUrl}
                onChange={e => setImageUrl(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-4 text-white focus:border-blue-500 outline-none"
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">Description</label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-4 text-white focus:border-blue-500 outline-none resize-none"
              placeholder="Tell us about the project..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">GitHub URL</label>
              <input
                value={githubUrl}
                onChange={e => setGithubUrl(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-4 text-white focus:border-blue-500 outline-none"
                placeholder="https://github.com/..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Live Demo URL</label>
              <input
                value={liveUrl}
                onChange={e => setLiveUrl(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-4 text-white focus:border-blue-500 outline-none"
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">Technologies (comma separated)</label>
            <input
              value={technologies}
              onChange={e => setTechnologies(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-4 text-white focus:border-blue-500 outline-none"
              placeholder="Next.js, TypeScript, Tailwind"
            />
          </div>

          <div className="flex items-center gap-2 py-2">
            <input
              type="checkbox"
              id="is_private"
              checked={isPrivate}
              onChange={e => setIsPrivate(e.target.checked)}
              className="w-4 h-4 rounded border-white/10 bg-white/5 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="is_private" className="text-sm text-gray-300">Mark as private (password protected)</label>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-white/10 text-gray-400 font-medium hover:bg-white/5 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-[2] py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin mx-auto" /> : (project ? 'Save Changes' : 'Create Project')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
