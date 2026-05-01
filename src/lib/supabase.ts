import { createBrowserClient } from '@supabase/ssr'

export const createClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseUrl.startsWith('http')) {
    console.error('INVALID SUPABASE URL: Please ensure NEXT_PUBLIC_SUPABASE_URL is a valid URL (e.g., https://xyz.supabase.co)')
    // Return a dummy client or throw a more descriptive error
    return {} as any 
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey!)
}
