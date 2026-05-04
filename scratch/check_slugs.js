require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkData() {
  const { data, error } = await supabase
    .from('projects')
    .select('title, slug');

  if (error) {
    console.error('Error fetching projects:', error);
    return;
  }

  console.log('Projects in DB:', JSON.stringify(data, null, 2));
}

checkData();
