const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

const env = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf8')
const supabaseUrl = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)?.[1]?.trim()
const supabaseAnonKey = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/)?.[1]?.trim()

async function testConnection() {
  console.log('Testing connection to:', supabaseUrl)
  const supabase = createClient(supabaseUrl, supabaseAnonKey)

  console.log('Checking terminal_commands...')
  const { data: cmdData, error: cmdError } = await supabase.from('terminal_commands').select('*')
  if (cmdError) console.error('Error fetching terminal_commands:', cmdError)
  else console.log('Success terminal_commands! Found:', cmdData.length)

  console.log('Checking projects...')
  const { data: projData, error: projError } = await supabase.from('projects').select('*')
  if (projError) console.error('Error fetching projects:', projError)
  else console.log('Success projects! Found:', projData.length)
}

testConnection()
