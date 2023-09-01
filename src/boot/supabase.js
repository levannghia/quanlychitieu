import { createClient } from '@supabase/supabase-js'
import useAuthUser from 'src/composables/useAuthUser'

const supabaseUrl = 'https://uwfwiuyrrhpkjuytpgoi.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV3ZndpdXlycmhwa2p1eXRwZ29pIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTM0MDYzNDQsImV4cCI6MjAwODk4MjM0NH0.KTJqptyOzNg58F_X-t6Qub71tPhYb9KlLq9uJo1BF7s'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

supabase.auth.onAuthStateChange((event, session) => {
  const { user } = useAuthUser()
  user.value = session?.user || null
})

export default function  useSupabase() {
  return { supabase }
}
