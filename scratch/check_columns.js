require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkColumns() {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .limit(1);

  if (error) {
    console.error('Error fetching project:', error);
    return;
  }

  if (data && data.length > 0) {
    console.log('Columns in projects table:', Object.keys(data[0]));
  } else {
    console.log('No projects found to check columns.');
  }
}

checkColumns();
