import { useState, useEffect } from 'react'
import { X, Loader2 } from 'lucide-react'

interface EntityFormProps {
  title: string
  entity: any
  fields: {
    key: string
    label: string
    type: 'text' | 'textarea' | 'number' | 'url'
    placeholder?: string
    required?: boolean
  }[]
  onClose: () => void
  onSave: (data: any) => Promise<boolean | void>
}

export default function EntityForm({ title, entity, fields, onClose, onSave }: EntityFormProps) {
  const [formData, setFormData] = useState(entity || {})
  const [loading, setLoading] = useState(false)

  // Handle Esc key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const success = await onSave(formData)
    setLoading(false)
    if (success !== false) {
      onClose()
    }
  }

  const handleChange = (key: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-[#111] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-white/5 flex items-center justify-between shrink-0">
          <h2 className="text-xl font-bold text-white">{entity ? `Edit ${title}` : `Add New ${title}`}</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-all">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="p-6 space-y-4 overflow-y-auto">
            {fields.map((field) => (
              <div key={field.key} className="space-y-2">
                <label className="text-sm font-medium text-gray-400">{field.label}</label>
                {field.type === 'textarea' ? (
                  <textarea
                    required={field.required}
                    value={formData[field.key] || ''}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    rows={4}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-blue-500 outline-none resize-none"
                  />
                ) : (
                  <input
                    required={field.required}
                    type={field.type}
                    value={formData[field.key] || ''}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-blue-500 outline-none"
                  />
                )}
              </div>
            ))}
          </div>

          <div className="p-6 border-t border-white/5 flex gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="group flex-1 py-3 rounded-xl border border-white/10 text-gray-400 font-medium hover:bg-white/5 transition-all flex items-center justify-center gap-2"
            >
              Cancel
              <span className="px-1.5 py-0.5 rounded border border-white/10 bg-white/5 text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity">Esc</span>
            </button>
            <button
              type="submit"
              disabled={loading}
              className="group flex-[2] py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin mx-auto" /> : (
                <>
                  {entity ? 'Save Changes' : `Add ${title}`}
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
